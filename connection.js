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

import { addFeature, loadFeatures, loadfeatureIDs } from './database.js'

//////////////////////////////////////////////////////////////////////////////////

// Calling the saveFeature
let savedFeature = addFeature("residence",{"ObjectID":10,"x":1,"y":4}, "polygon")

// Calling the loadFeature
let loadSavedFeatures = loadFeatures('residence')
///////////////////////////////////////////////////////////////////////////////////

// function deleteFeature (user_type, featureID)
// Which also need to remove from the database

export function deleteFeature(user_type, featureID){
  //pass
}

//function listFeatures(user_type, type) 

export function listFeatures(user_type, type){
  let featureJson = loadFeatures(user_type, type)
  //pass
}

//function listfeatureIDs(user_type, type)
export function listfeatureIDs(user_type, type){
  let featureIDJson = loadfeatureIDs(user_type, type)
  //pass
}


export function updateFeature(user_type, feature_id, feature){
  //pass
  // this function is only called if the feature already exists in the database
  // Just need to figure out how to update an already existing content
  // Another way is to delete feature and add the new one
}


export function addNewFeature(user_type, feature, type){
  addFeature(user_type, feature)
}






