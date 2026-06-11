auth.onAuthStateChanged(user => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  loadUser(user.uid);
});

function loadUser(uid) {

  db.ref("users/" + uid).on("value", snap => {

    const u = snap.val();

    console.log("User Data:", u);

    if (!u) {
      document.getElementById("units").innerHTML =
        "<h3>No user data found in Firebase</h3>";
      return;
    }

    render(uid, u);
  });
}

function render(uid, u) {

  const div = document.getElementById("units");

  div.innerHTML = "";

  // Borewells
  div.innerHTML += "<h3>Borewells</h3>";

  for (let i = 1; i <= (u.borewellCount || 0); i++) {

    const unit = "b" + i;
    const state = u.states && u.states[unit] ? "ON" : "OFF";

    div.innerHTML += `
      <div style="margin:10px 0">
        <b>B${i}</b>
        <button onclick="toggleUnit('${uid}','${unit}')">
          ${state}
        </button>
      </div>
    `;
  }

  // Wells
  div.innerHTML += "<h3>Wells</h3>";

  for (let i = 1; i <= (u.wellCount || 0); i++) {

    const unit = "w" + i;
    const state = u.states && u.states[unit] ? "ON" : "OFF";

    div.innerHTML += `
      <div style="margin:10px 0">
        <b>W${i}</b>
        <button onclick="toggleUnit('${uid}','${unit}')">
          ${state}
        </button>
      </div>
    `;
  }

  // Valves
  div.innerHTML += "<h3>Valves</h3>";

  for (let i = 1; i <= (u.valveCount || 0); i++) {

    const valve = "v" + i;
    const state = u.states && u.states[valve] ? "ON" : "OFF";

    div.innerHTML += `
      <div style="margin:10px 0">
        <b>V${i}</b>
        <button onclick="toggleValve('${uid}','${valve}')">
          ${state}
        </button>
      </div>
    `;
  }
}

function toggleValve(uid, valve) {

  const path = "users/" + uid + "/states/" + valve;

  db.ref(path).once("value").then(snap => {

    db.ref(path).set(!snap.val());
  });
}

function toggleUnit(uid, unit) {

  db.ref("users/" + uid).once("value").then(snap => {

    const u = snap.val();

    const assigned =
      (u.unitValveAssignments &&
       u.unitValveAssignments[unit]) || [];

    const allOn = assigned.every(v =>
      u.states &&
      u.states[v] === true
    );

    if (!allOn) {
      alert("Turn ON all assigned valves first");
      return;
    }

    const path =
      "users/" + uid + "/states/" + unit;

    db.ref(path).once("value").then(s => {

      db.ref(path).set(!s.val());
    });
  });
}