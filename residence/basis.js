/*
Date Created: January 29, 2021
Date Last Edited: January 29, 2021
*/

// This file will contain the the dictionary values for schema
// The Popup template
// The Point, Polygon, Polyline creation standards from the database
// 

import { uuid4 } from "../uuid4.js" // Unique IDs


// The Schema for our feature layer
const fields = [
    {
      name: "ObjectID",
      alias: "ObjectID",
      type: "oid"
    },
    {
      name: "Name",
      alias: "Name",
      type: "string"
    },
    {
      name: "Type",
      alias: "Type",
      type: "string"
    },
    {
      name: "Data_added",
      alias: "date",
      type: "date"
    },
    {
      name: "uuid",
      alias: "uuid",
      type: "string"
    },
    {
      name: "Description",
      alias: "description",
      type: "string"
    }
  ]

// NOW POPUP INFO STYLING
// Maybe add type later
// Note "{ field_name }" field name is from the schema
let popupTemplate_info = {
    // id: "{ObjectID}",
    title: "{Name}",
    outFields:["*"],
    // content: "{Description}",
    content: [{
        // It is also possible to set the fieldInfos outside of the content
        // directly in the popupTemplate. If no fieldInfos is specifically set
        // in the content, it defaults to whatever may be set within the popupTemplate.
        type: "fields",
        fieldInfos: [{
          fieldName: "Description", // The field for access the date from attributes
          label: "Description"
        },{
          fieldName: "Date_added",
          label: "Data_added",
        },
        {
          fieldName: "ObjectID",
          label: "ID",
        },
        {
          fieldName: "uuid",
          label: "UniqueIdentifier",
        },
        ]
      }]
    
    // Date_added: "{Data_added}"
 }



 // FOR ALL THE GEOMETRY BELOW THE INFORMATION IS A SAMPLE DATASET
 // THIS WOULD BE HOW THE DATASET WOULD BE LOADED FROM THE FIREBASE DATABASE 
 // WITH THAT UNIQUE ID


// The Point geometry standards
// THE INFORMATION FOR CREATING POINTS
let point_info =  {
    geometry: {
            type: "point",
            spatialReference:{
              latestWkid: 3857,
              wkid: 102100
            },
            x: -8818308.957272682,
            y: 5672759.466050722
    },
    attributes: {
            ObjectID: uuid4(),
            uuid: uuid4(),
            Type: "point",
            Name: "TestPoint",
            Description: "Random Point",
            Data_added: Date.now()
    },
    symbol:{
        // https://developers.arcgis.com/javascript/latest/api-reference/esri-symbols-SimpleMarkerSymbol.html
        type: "simple-marker", // The Simple-Marker Type of Styling
        color: "blue",  // Orange --> Make this random 
        // size: "100px", 
        // style: "x",
        outline: {
            color: [255, 255, 255], // White
            width: 1
        }
    },
    popupTemplate:popupTemplate_info
}


// Line geometry standard
// Create a line geometry

let polyline_info = {
    geometry: {
        type: "polyline",
        paths: [
            [-118.821527826096, 34.0139576938577], //Longitude, latitude
            [-118.814893761649, 34.0080602407843], //Longitude, latitude
            [-118.808878330345, 34.0016642996246]  //Longitude, latitude
        ]
    },
    attributes: {
        ObjectID: 1,
        Type: "line",
        uuid:"value2",
        Name: "TestLine",
        Description: "Random Line",
        Data_added: Date.now()
    },
    symbol:{
        type: "simple-line",
        color: [226, 119, 40], // Orange
        width: 2
    },
    popupTemplate:popupTemplate_info
}


// Polygom geometry standard
// Create the polygon geometry

let polygon_info = {
    geometry: {
        type: "polygon",
        rings: [
            [-118.818984489994, 34.0137559967283], //Longitude, latitude
            [-118.806796597377, 34.0215816298725], //Longitude, latitude
            [-118.791432890735, 34.0163883241613], //Longitude, latitude
            [-118.79596686535, 34.008564864635],   //Longitude, latitude
            [-118.808558110679, 34.0035027131376]  //Longitude, latitude
        ]
    },
    symbol:{
        type: "simple-fill",
        color: [227, 139, 79, 0.8],  // Orange, opacity 80%
        outline: {
            color: [255, 255, 255],
            width: 1
        }
    },
    attributes: {
        ObjectID: 130,
        Type: "line",
        uuid:"value3",
        Name: "TestPolygon",
        Description: "Random Polygon",
        Data_added: Date.now()
    },
    popupTemplate:popupTemplate_info
};


//https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#applyEdits
// Gooing to use it on .applyEdits
let addFeaturesData = {
  addFeatures: []
}

let updateFeaturesData = {
  updateFeatures: []
}

let deleteFeaturesData = {
  deleteFeatures: []
}


      
export { fields, point_info, polyline_info, polygon_info, popupTemplate_info, addFeaturesData, updateFeaturesData, deleteFeaturesData } // Making the fields variable accessible to other files
