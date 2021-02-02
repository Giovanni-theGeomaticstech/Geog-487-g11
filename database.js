// Date written: January 25, 2021
// Last update: February 1, 2021
// File Purpose: Set up Firebase Database connection

// This file serves as the general firebase database connection

// Note we could have built this use Javascript class
//https://www.c-sharpcorner.com/article/object-oriented-programming-javascript-es6

// https://firebase.google.com/docs/database/web/read-and-write

/*
The purpose of the function addfeatureID is to add a newly added feature
to the database.

addfeatureID: Str Str Str -> None
*/

function addfeatureID(user_type, feature_id, type=null){
    type = type + "_ids"
    let db_location_feature = user_type + "/" + type
    let featureRef = firebase.database().ref(db_location_feature)
    let featureInfo = featureRef.push(feature_id);
}

//Saving Data from Features into firebase
export function addFeature(user_type, feature, type=null){
    // Make sure modifications to this to separate the point, polygon and lines 
    // Features 
    let db_location_feature = user_type + "/" + type
    let featureRef = firebase.database().ref(db_location_feature)
    let featureInfo = featureRef.push();
    featureInfo.set(feature);

    // As we add a feature we add its contents
    addfeatureID(user_type, feature["ObjectID"], type)

    // switch (type){
    //     case 'point':
    //         //pass
    //     case 'polyline':
    //         //pass
    //     case 'polygon':
    //         //pass
    // } 
}



export function loadfeatureIDs(user_type){
    let feature_types = ["point_ids", "polygon_ids", "line_ids"]
    let featureIDs = {}

    for (let feature_type in feature_types){
        let db_location_feature = user_type + "/" + feature_type
        let ref = firebase.database().ref(db_location_feature);                           
        ref.on("value", function(snapshot){
            let output = JSON.stringify(snapshot.val(), null, 2);
            // trial.innerHTML = output
            featureIDs[feature_type] = snapshot.val()
        });
    }
    return featureIDs 
}

// The Purpose
// The function loadFeatures loads data from the firebase database
// An object with all the feature information 
export function loadFeatures(user_type){
    let feature_types = ["point", "polygon", "line"]
    let features = {} 

    for (let feature_type in feature_types){
        let db_location_feature = user_type + "/" + feature_type
        let ref = firebase.database().ref(db_location_feature);                           
        ref.on("value", function(snapshot){
            let output = JSON.stringify(snapshot.val(), null, 2);
            // trial.innerHTML = output
            features[feature_type] = snapshot.val()
        });
    }
    return features
}

// var rootRef = firebase.database().ref();
// rootRef.once("value")
//   .then(function(snapshot) {
//     var key = snapshot.key; // null
//     var childKey = snapshot.child("users/ada").key; // "ada"
//   });

// function saveMessage(fname,lname,dob,last_grade,grade,email,phone,subject,notes,style_learn){

//     var newMessageRef = messagesRef.push();
//     //Now here I am creating an object to store in this collection
//     newMessageRef.set({
//         first_name:fname,
//         last_name: lname,
//         age: dob,
//         last_grade: last_grade,
//         grade: grade,
//         email:email,
//         phone_no: phone,
//         availability:status,
//         courses:subject,
//         notes:notes,
//         learn_style:style_learn
//     });

// }
