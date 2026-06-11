const firebaseConfig = {
  apiKey: "AIzaSyBF-bnOqs-rX4-PjlVM_6ligsYKPC9IEX0",
  authDomain: "esp-relay-control-6488c.firebaseapp.com",
  databaseURL: "https://esp-relay-control-6488c-default-rtdb.firebaseio.com",
  projectId: "esp-relay-control-6488c",
  storageBucket: "esp-relay-control-6488c.firebasestorage.app",
  messagingSenderId: "418928329926",
  appId: "1:418928329926:web:77dd4b66be9b8d22ea03c7"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();