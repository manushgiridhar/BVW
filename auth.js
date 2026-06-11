const ADMIN_EMAIL = "admin@espcontrol.com";

function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCred => {
      createUserInDB(userCred.user);
    })
    .catch(err => alert(err.message));
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCred => {
      routeUser(userCred.user);
    })
    .catch(err => alert(err.message));
}

function createUserInDB(user) {
  const role = (user.email === ADMIN_EMAIL) ? "admin" : "user";

  db.ref("users/" + user.uid).set({
    email: user.email,
    role: role,
    borewellCount: 0,
    wellCount: 0,
    valveCount: 0,
    valveAssignments: {
      borewell: [],
      well: []
    }
  });

  routeUser(user);
}

function routeUser(user) {
  const role = (user.email === ADMIN_EMAIL) ? "admin" : "user";

  if (role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "user.html";
  }
}