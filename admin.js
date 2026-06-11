const ADMIN_EMAIL = "admin@espcontrol.com";

auth.onAuthStateChanged(user => {

  if (!user || user.email !== ADMIN_EMAIL) {
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

    if (!data) {
      container.innerHTML = "No Users";
      return;
    }

    for (let uid in data) {

      const u = data[uid];

      let html = `
      <div style="border:1px solid black;padding:10px;margin:10px;">
      <h3>${u.email}</h3>

      Borewell Count:
      <input type="number"
      value="${u.borewellCount || 0}"
      onchange="updateCount('${uid}','borewellCount',this.value)">
      <br><br>

      Well Count:
      <input type="number"
      value="${u.wellCount || 0}"
      onchange="updateCount('${uid}','wellCount',this.value)">
      <br><br>

      Valve Count:
      <input type="number"
      value="${u.valveCount || 0}"
      onchange="updateCount('${uid}','valveCount',this.value)">
      <br><br>
      `;

      for (let i = 1; i <= (u.borewellCount || 0); i++) {

        html += `
        B${i} :
        <input
        id="${uid}_b${i}"
        placeholder="v1,v2,v3">
        <button onclick="saveAssignment('${uid}','b${i}')">
        Save
        </button><br><br>`;
      }

      for (let i = 1; i <= (u.wellCount || 0); i++) {

        html += `
        W${i} :
        <input
        id="${uid}_w${i}"
        placeholder="v4,v5">
        <button onclick="saveAssignment('${uid}','w${i}')">
        Save
        </button><br><br>`;
      }

      html += `</div>`;

      container.innerHTML += html;
    }

  });
}

function updateCount(uid, field, value) {

  db.ref("users/" + uid).update({
    [field]: Number(value)
  });
}

function saveAssignment(uid, unit) {

  const val =
    document.getElementById(uid + "_" + unit).value;

  const valves =
    val.split(",")
       .map(v => v.trim())
       .filter(v => v);

  db.ref(
    "users/" +
    uid +
    "/unitValveAssignments/" +
    unit
  ).set(valves);

  alert("Saved");
}