// Date written: January 25, 2021
// File Purpose: Set up Firebase Database connection

// This file serves as the general firebase database connection

// https://firebase.google.com/docs/database/web/read-and-write

//Saving Data from Features into firebase
export function saveFeature(feature, type=null){
    let featureRef = firebase.database().ref("residence")

    switch (type){
        case 'point':
            let featureInfo = featureRef.push();
            featureInfo.set({
                name: "",
                email: "",
                feature_type: type,
                coordinates: feature
            });
        case 'polyline':
            //pass
        case 'polygon':
            //pass
    } 
}

// The Purpose
// The function loadFeatures loads data from the firebase database

export function loadFeatures(user_type){
    let trial = document.getElementById("under"); // Remove Later
    let ref = firebase.database().ref(user_type);                           
    ref.on("value", function(snapshot){
        let output = JSON.stringify(snapshot.val(), null, 2);
        trial.innerHTML = output
    });
}

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
