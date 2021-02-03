// Date written: January 25, 2021
// File Purpose: Set up Firebase connection

// This file serves as the general firebase connection



// https://dev.to/deammer/loading-environment-variables-in-js-apps-1p7p
// https://medium.com/evenbit/getting-started-with-firebase-real-time-database-for-the-web-f53b527aae27
// https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04
// Promises Javascript
// https://stackoverflow.com/questions/38884522/why-is-my-asynchronous-function-returning-promise-pending-instead-of-a-val
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
// Test data
// Calling the saveFeature
// let savedFeature = addFeature("residence",{"ObjectID":10,"x":1,"y":4}, "polygon")


///////////////////////////////////////////////////////////////////////////////////

// function deleteFeature (user_type, featureID)
// Which also need to remove from the database

export function deleteFeature(user_type, featureID){
  //pass
}


// We load the features of specific types
// The return type is a promise feature
// So call any function needed within the promise
export function listFeatures(user_type, type){
  let featureJson = loadFeatures(user_type)
 
  // Idea is that this feature.json contains the data for polygon
  // So just make this list here using Promise of the data
  return featureJson[type].then(function(data){
    let listOfFeatures = []
    for (let feature in data){
      listOfFeatures.push(data[feature])
    }
    // console.log(listOfFeatures)
    return listOfFeatures
  })
}
listFeatures("residence", "polygon")

// The Return is a Promise of ID's
export function listFeatureIDs(user_type, type=null){
  let featureIDJson = loadfeatureIDs(user_type)
  return featureIDJson[type].then(function(data){
    let listOfFeatureIDs = []
    for (let featureID in data){
      listOfFeatureIDs.push(data[featureID])
    }
    // console.log(listOfFeatureIDs)
    return listOfFeatureIDs
  })
}
listFeatureIDs("residence", "polygon_ids")


export function updateExistingFeature(user_type, feature_id, feature){
  promiseFeatureIDs = listFeatureIDs(user_type, feature["geometry"][type])
  promiseFeatureIDs.then(function(data){
    if(data.includes(feature_id)){
      // find the feature by the key
    }else{
      // Feature does not exists
    }
  })
  //pass
  // this function is only called if the feature already exists in the database
  // Just need to figure out how to update an already existing content
  // Another way is to delete feature and add the new one
}


export function addNewFeature(user_type, feature, type){
  // Basically we want to call that Add Feature function in our connection .js
  if (feature){
    // Add in a functionality for a pop up of feature saved
    return addFeature(user_type, feature, type)
  }
  else{
    alert("Check your Feature")
  }
}






