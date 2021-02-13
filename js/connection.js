// Date written: January 25, 2021
// Last update: February 5, 2021
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

// This is going to tell the server to call anything that is .env 
// https://www.youtube.com/watch?v=17UVejOw3zA


// require('dotenv').config( {
//       path: path.join(__dirname, '.env')
//   });
// console.log(process.env)

// Note this File is the connection path for the DB






  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();
//button id =search_btn_url
import { addFeature, loadFeatures, loadfeatureIDs, deleteDbFeature, updateFeature } from './database.js'



// We are going to use this function to firebase object keys
// The function will return the Firebase Object key of a feature
// Function assumes field in the database
// Have a check for null

function firebaseOjectKey(user_type, type, indexID){
  let  featureIdJson; 
  // We use ids

  if (type.search("_ids") > 0){ // If item in string 1 , -1 not in string
    featureIdJson = loadfeatureIDs(user_type)
  } else { // We use the other the base load features
    featureIdJson = loadFeatures(user_type)
  }
  
  return featureIdJson[type].then(function(data){
    let i = 0 // starting index
    let objectKey;
    for (let featureID in data){
      if (i == indexID){
        objectKey = featureID
        break
      }
      ++i
    }
    console.log(objectKey)
    return objectKey
  })
}
// firebaseOjectKey("residence", "polygon", 1)
// firebaseOjectKey("residence", "polygon_ids", 3)


///////////////////////////////////////////////////////////////////////////////////

// function deleteFeature (user_type, featureID)
// Which also need to remove from the database

// We take feature id 
// We look for the index of that feature in firebase database feature IDs
// Then we take this information and get the key of item at index
// Note only id based data is passed here 
// Thus it must be `obj`+ `_ids`

export function deleteFeatureObject(user_type, type, featureID){

  if (type.search("_ids") < 0){
    console.log("You need to pass in ID data")
    return
  }

  let featureIDsArrPromise = listFeatureIDs(user_type, type)

  return featureIDsArrPromise.then(function(featureIDsArr){
    // We check if the feature ID is the Feature ID list
    if (featureIDsArr.includes(featureID)){
      let objectIndex = featureIDsArr.indexOf(featureID)
      let type_feature = type.slice(0, (type.length) - 4) // remove "_ids"
      
      // Delete ID
      let objectKeyPromise_id = firebaseOjectKey(user_type, type, objectIndex) // We get the Object Key in db
      objectKeyPromise_id.then(function(objectKey){
        console.log("Key ID " + objectKey)
        deleteDbFeature(user_type, type, objectKey) // We delete from DB
      })

      // Delete Feature
      let objectKeyPromise_feature = firebaseOjectKey(user_type, type_feature, objectIndex) // We get the Object Key in db
      objectKeyPromise_feature.then(function(objectKeyFeature){
        console.log("Key ID Feature" + objectKeyFeature)
        deleteDbFeature(user_type, type_feature , objectKeyFeature) // We delete from DB
      })
    }
    return "Feature Does not Exists"
})
}
// deleteFeatureObject("residence", "polygon_ids", 13)

///////////////////////////////////////////////////////////////////////////////////

// The update Existing Feature is used to update features that we have in the DB

// Note A feature is passed directly from the front 
export function updateExistingFeature(user_type, featureID, feature, type_feature){
  let type = type_feature + "_ids"
  let featureIDsArrPromise = listFeatureIDs(user_type, type)

  return featureIDsArrPromise.then(function(featureIDsArr){
    // We check if the feature ID is the Feature ID list
    console.log(featureID)
    console.log(featureIDsArr)
    if (featureIDsArr.includes(featureID)){
      let objectIndex = featureIDsArr.indexOf(featureID)
      
      //  Update ID
      // let objectKeyPromise_id = firebaseOjectKey(user_type, type, objectIndex) // We get the Object Key in db
      // objectKeyPromise_id.then(function(objectKey){
      //   console.log("Key ID " + objectKey)
      //   deleteDbFeature(user_type, type, objectKey) // We delete from DB
      // })

      // Update Feature
      let objectKeyPromise_feature = firebaseOjectKey(user_type, type_feature, objectIndex) // We get the Object Key in db
      objectKeyPromise_feature.then(function(objectKeyFeature){
        console.log("Key ID Feature" + objectKeyFeature)
        updateFeature(user_type, feature, type_feature , objectKeyFeature) // We delete from DB
      })
      console.log("Feature Updated")
      return "Feature Updated"
    }
    console.log("Feature Does not Exists")
    return "Feature Does not Exists"
})
}

// let test_geom = {"ObjectID":15, "geometry":
// {
//   "type":"polygon",
//   "x":2009,
//   "y":4
// }
// }
// updateExistingFeature("residence", 15, test_geom)


///////////////////////////////////////////////////////////////////////////////////

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
    console.log(listOfFeatures)
    return listOfFeatures
  })
}
// listFeatures("residence", "polygon")

// The Return is a Promise of ID's
// The IDS are the FireBase Database IDS
export function listFeatureIDs(user_type, type){
  let featureIDJson = loadfeatureIDs(user_type)
  console.log(type)
  return featureIDJson[type].then(function(data){
    let listOfFeatureIDs = []
    for (let featureID in data){
      listOfFeatureIDs.push(data[featureID])
    }
    console.log(listOfFeatureIDs)
    return listOfFeatureIDs
  })
}
// listFeatureIDs("residence", "polygon_ids")


///////////////////////////////////////////////////////////////////////////////////

export function addNewFeature(user_type, feature, type){
  // Basically we want to call that Add Feature function in our connection .js
  console.log("add feature")
  
  // We can use to delete to remove an object property
  // delete feature.popupTemplate

  if (feature){
    // Add in a functionality for a pop up of feature saved
    return addFeature(user_type, feature, type)
  }
  else{
    console.log("There is no data in the feature")
  }
}

///////////////////////////////////////////////////////////////////////////////////





