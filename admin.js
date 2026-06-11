const ADMIN_EMAIL = "admin@espcontrol.com";

auth.onAuthStateChanged(user => {
  if (!user || user.email !== ADMIN_EMAIL) {
    alert("Not admin");
    window.location.href = "index.html";
    return;
  }

  loadUsers();
});

function loadUsers() {
  db.ref("users").on("value", snap => {
    const data = snap.val();
    const container = document.getElementById("users");
    container.innerHTML = "";

    for (let uid in data) {
      const u = data[uid];

      container.innerHTML += `
        <div style="border:1px solid black; padding:10px; margin:10px;">
          <b>${u.email}</b><br>

          Borewell Count:
          <input type="number" value="${u.borewellCount}"
            onchange="updateCount('${uid}','borewellCount',this.value)"><br>

          Well Count:
          <input type="number" value="${u.wellCount}"
            onchange="updateCount('${uid}','wellCount',this.value)"><br>

          Valve Count:
          <input type="number" value="${u.valveCount}"
            onchange="updateCount('${uid}','valveCount',this.value)"><br>

          <button onclick="assignValves('${uid}')">Auto Assign Valves</button>
        </div>
      `;
    }
  });
}

function updateCount(uid, field, value) {
  db.ref("users/" + uid).update({
    [field]: parseInt(value)
  });
}

function assignValves(uid) {
  db.ref("users/" + uid).once("value", snap => {
    const u = snap.val();

    let boreValves = [];
    let wellValves = [];

    for (let i = 1; i <= u.valveCount; i++) {
      if (i % 2 === 0) boreValves.push("v" + i);
      else wellValves.push("v" + i);
    }

    db.ref("users/" + uid + "/valveAssignments").set({
      borewell: boreValves,
      well: wellValves
    });

    alert("Valves assigned!");
  });
}