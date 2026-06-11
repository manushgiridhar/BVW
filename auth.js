const ADMIN_EMAIL = "admin@espcontrol.com";

function signup() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((res) => {

      return db.ref("users/" + res.user.uid).set({
        email,
        borewellCount: 0,
        wellCount: 0,
        valveCount: 0,
        unitValveAssignments: {},
        states: {}
      });

    })
    .then(() => {
      alert("Signup Successful");
      window.location.href = "user.html";
    })
    .catch(err => alert(err.message));
}

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((res) => {

      if (res.user.email === ADMIN_EMAIL)
        window.location.href = "admin.html";
      else
        window.location.href = "user.html";

    })
    .catch(err => alert(err.message));
}