auth.onAuthStateChanged(user => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  loadUser(user.uid);
});

function loadUser(uid) {

  db.ref("users/" + uid)
  .on("value", snap => {

    const u = snap.val();

    render(uid, u);
  });
}

function render(uid, u) {

  const div =
  document.getElementById("units");

  div.innerHTML = "";

  for (let i = 1; i <= (u.borewellCount || 0); i++) {

    div.innerHTML += `
    <button onclick="toggleUnit('${uid}','b${i}')">
    B${i}
    </button>`;
  }

  div.innerHTML += "<br><br>";

  for (let i = 1; i <= (u.wellCount || 0); i++) {

    div.innerHTML += `
    <button onclick="toggleUnit('${uid}','w${i}')">
    W${i}
    </button>`;
  }

  div.innerHTML += "<br><br>";

  for (let i = 1; i <= (u.valveCount || 0); i++) {

    div.innerHTML += `
    <button onclick="toggleValve('${uid}','v${i}')">
    V${i}
    </button>`;
  }
}

function toggleValve(uid, valve) {

  const path =
  "users/" + uid + "/states/" + valve;

  db.ref(path).once("value", snap => {

    db.ref(path).set(!snap.val());
  });
}

function toggleUnit(uid, unit) {

  db.ref("users/" + uid)
  .once("value")
  .then(snap => {

    const u = snap.val();

    const assigned =
      u.unitValveAssignments?.[unit] || [];

    const allOn =
      assigned.every(v =>
        u.states?.[v] === true
      );

    if (!allOn) {

      alert(
      "Turn ON all assigned valves first");
      return;
    }

    const path =
    "users/" + uid + "/states/" + unit;

    db.ref(path)
    .once("value")
    .then(s => {

      db.ref(path).set(!s.val());
    });

  });
}