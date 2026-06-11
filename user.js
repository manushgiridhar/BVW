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

    const state =
      u.states && u.states["b" + i]
      ? "🟢 ON"
      : "🔴 OFF";

    div.innerHTML += `
      <button onclick="toggleUnit('${uid}','b${i}')">
        B${i}<br>${state}
      </button>
    `;
  }

  div.innerHTML += "<br><br>";

  // Wells
  div.innerHTML += "<h3>Wells</h3>";

  for (let i = 1; i <= (u.wellCount || 0); i++) {

    const state =
      u.states && u.states["w" + i]
      ? "🟢 ON"
      : "🔴 OFF";

    div.innerHTML += `
      <button onclick="toggleUnit('${uid}','w${i}')">
        W${i}<br>${state}
      </button>
    `;
  }

  div.innerHTML += "<br><br>";

  // Valves
  div.innerHTML += "<h3>Valves</h3>";

  for (let i = 1; i <= (u.valveCount || 0); i++) {

    const state =
      u.states && u.states["v" + i]
      ? "🟢 ON"
      : "🔴 OFF";

    div.innerHTML += `
      <button onclick="toggleValve('${uid}','v${i}')">
        V${i}<br>${state}
      </button>
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