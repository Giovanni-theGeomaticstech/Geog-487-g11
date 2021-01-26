// Date written: January 25, 2021
// File Purpose: Set up Firebase connection

// This file serves as the general firebase connection



// https://dev.to/deammer/loading-environment-variables-in-js-apps-1p7p
// https://medium.com/evenbit/getting-started-with-firebase-real-time-database-for-the-web-f53b527aae27
// https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04
// make sure we do sudo npm install -g firebase-tools
// firebase login
// firebase init

//// Browserify Setup
// var firebase = require('firebase/app');
// require('firebase/auth');
// require('firebase/database');
//Consider doing this later

const firebaseConfig = {
    apiKey: "AIzaSyDEbPCl-DqP0Au6z0ojUqCyP3bD9JitAdY",
    authDomain: "sample-c4b1e.firebaseapp.com",
    databaseURL: "https://sample-c4b1e.firebaseio.com",
    projectId: "sample-c4b1e",
    storageBucket: "sample-c4b1e.appspot.com",
    messagingSenderId: "86495474066",
    appId: "1:86495474066:web:79594a6a19a33ec44ed14b",
    measurementId: "G-MDNH01Q427"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

let trial = document.getElementById("under");
var ref = firebase.database().ref();                           
ref.on("value", function(snapshot){
    let output = JSON.stringify(snapshot.val(), null, 2);
    trial.innerHTML = output
});

// var rootRef = firebase.database().ref();
// rootRef.once("value")
//   .then(function(snapshot) {
//     var key = snapshot.key; // null
//     var childKey = snapshot.child("users/ada").key; // "ada"
//   });