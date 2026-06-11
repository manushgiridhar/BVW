let currentUser;

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;
  loadUserData(user.uid);
});

function loadUserData(uid) {
  db.ref("users/" + uid).on("value", snap => {
    const u = snap.val();
    renderUnits(uid, u);
  });
}

function renderUnits(uid, u) {
  const div = document.getElementById("units");
  div.innerHTML = "";

  // BOREWELL
  for (let i = 1; i <= u.borewellCount; i++) {
    div.innerHTML += `
      <button onclick="toggleUnit('${uid}','b${i}')">B${i}</button>
    `;
  }

  // WELL
  for (let i = 1; i <= u.wellCount; i++) {
    div.innerHTML += `
      <button onclick="toggleUnit('${uid}','w${i}')">W${i}</button>
    `;
  }

  // VALVES
  for (let i = 1; i <= u.valveCount; i++) {
    div.innerHTML += `
      <button onclick="toggleUnit('${uid}','v${i}')">V${i}</button>
    `;
  }
}

function toggleUnit(uid, unit) {
  db.ref("users/" + uid).once("value", snap => {
    const u = snap.val();

    const boreValves = u.valveAssignments.borewell;
    const wellValves = u.valveAssignments.well;

    // CHECK RULES
    if (unit.startsWith("b")) {
      const ok = boreValves.every(v => true); // simplified ON check

      if (!ok) {
        alert("Turn ON all borewell valves first!");
        return;
      }
    }

    if (unit.startsWith("w")) {
      const ok = wellValves.every(v => true);

      if (!ok) {
        alert("Turn ON all well valves first!");
        return;
      }
    }

    const path = "users/" + uid + "/states/" + unit;

    db.ref(path).once("value", s => {
      db.ref(path).set(!s.val());
    });
  });
}