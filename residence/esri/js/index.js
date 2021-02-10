// Data Written: January 25, 2021
// Last Updated: February 1, 2021
// This file will contain Javascript Code
// The Code will focus anything map related to the ArcGIS API for JAVASCRIPT
// This file will focus on the residences

import { fields, point_info, polyline_info, polygon_info, popupTemplate_info, addFeaturesData, updateFeaturesData, deleteFeaturesData } from "../../../js/basis.js" // Importing our fields schema

import { deleteFeatureObject, updateExistingFeature,  addNewFeature, listFeatures, listFeatureIDs, } from "../../../js/connection.js" // importing our database tools

import { uuid4 } from "../../../js/uuid4.js" // Unique IDs


require([
    /* REQUIRE HOLDS ALL THE MODULES/LIBRARIES WE WILL BE USING */
    "esri/Map",
    "esri/views/MapView",

    // Basemaps
    "esri/widgets/BasemapToggle",
    "esri/widgets/BasemapGallery",

    // Geolocation widgets
    "esri/widgets/Track", // Use this for our location
    "esri/widgets/Locate", 

    // Geocode widget
    "esri/widgets/Search",

    // Popup Templates
    "esri/PopupTemplate",

    // Add Map graphics
    // Graphics Layers are displayed on top of other layers
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",

    // Widget for sketching
    "esri/widgets/Sketch",

    // Editor
    "esri/widgets/Editor",

    // Layerslists
    "esri/widgets/LayerList", 

    // Tables
    "esri/widgets/FeatureTable",
    // Table Lists
    "esri/widgets/TableList",


    //NodeJs
//     "dojo/node!dotenv"

  ], 
  /* NOW THE FUNCTION IS WHERE WE ADD THESE LIBRARIES*/
  /* I believe within in this function we will write all or JS code*/
  function(Map, MapView, BasemapToggle,BasemapGallery, Track, Locate, Search, PopupTemplate, 
      Graphic, GraphicsLayer, FeatureLayer, Sketch, Editor, LayerList, FeatureTable, TableList) { //dotenv

        /////////////////////////////////////////////////////////////
        // SETTING UP OUR MAP LAYER
        // All basemaps
        var map = new Map({
        basemap: "satellite"
        });

        var view = new MapView({
        container: "viewDiv", //We define viewDiv is what holds our div
        map: map,
      //   center: [-79.3832,43.6532], // Center at toronto now
        center: [-79.210724,45.32424], // Center at toronto now
        zoom: 15
        });
        //////////////////////////////////////////////////////////////
        
        
        //////////////////////////////////////////////////////////////
        // ADDING ANOTHER BASE MAP THROUGH BASEMAP TOGGLE
        // https://developers.arcgis.com/javascript/latest/change-the-basemap-layer/
        // LIST OF BASEMAPS
        // https://developers.arcgis.com/javascript/3/jsapi/esri.basemaps-amd.html

        let basemapToggle = new BasemapToggle({
              view:view,
              nextBasemap: "topo"
        })
        view.ui.add(basemapToggle, "bottom-right") // Adding the basemap toggle bottom rights
        
        //////////////////////////////////////////////////////////////


        //////////////////////////////////////////////////////////////
        //SEARCH WIDGET
        let search = new Search({  
            view: view
          });
        view.ui.add(search, "top-right"); //Add to the map
        //////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////
        // GETTING OUR CURRENT LOCATION
        // https://developers.arcgis.com/javascript/latest/display-your-location/

        // We will use tack instead
        var track = new Track({
            view: view,
            graphic: new Graphic({
                  symbol: {
                        type: "simple-marker",
                        size: "15px",
                        color: "green",
                        outline: {
                        color: "black",
                        width: "1.5px"
                        }
                  }
               }),
               useHeadingEnabled: true // So the page rotates in the direction of movement
         });
         view.ui.add(track, "top-right"); // Add the widget to screen
     //////////////////////////////////////////////////////////////

     // Service Areas
     //https://developers.arcgis.com/javascript/latest/find-service-areas/

     // Route and Directions (Maybe for rescue of people)
     //https://developers.arcgis.com/javascript/latest/find-a-route-and-directions/
      
     //////////////////////////////////////////////////////////////
      // GRAPHICS
     //https://developers.arcgis.com/javascript/latest/add-a-point-line-and-polygon/
      
     // THE GRAPHICS CODE LAYER IS PROBABLY NO LONGER NEEDED
      // let graphicslayer = new GraphicsLayer()
      // graphicslayer.id = "Core graphics"
      // map.add(graphicslayer);


      // Note we take our graphic from Point Info
      let pointGraphic = new Graphic(point_info) 

      // graphicslayer.add(pointGraphic)
     //////////////////////////////////////////////////////////////

     // Polyline Graphic Creation
      let polylineGraphic = new Graphic(
            polyline_info
      );
      // graphicslayer.add(polylineGraphic)

      //////////////////////////////////////////////////////////////

       // Create a polygon geometry
       // https://developers.arcgis.com/javascript/latest/api-reference/esri-Graphic.html#attributes

      
      let polygonGraphic = new Graphic(polygon_info);
      // graphicslayer.add(polygonGraphic);

      //////////////////////////////////////////////////////////////

 
      // Listen to the click event on the map view.
      //https://www.esri.com/arcgis-blog/products/js-api-arcgis/mapping/find-graphics-under-a-mouse-click-with-the-arcgis-api-for-javascript/
      
   
      // view.on("click", function(event) {
      //       console.log(graphicslayer.graphics.items[0].geometry.type)
      //       console.log
      //       // console.log("click event: ", event.mapPoint);
      //       // console.log(event.mapPoint.type)
      //       // alert(event.mapPoint.x)
      // });


      ////////////////////////////////////////////////////////////////////////
      // Using the Sketch widget
      // const sketch = new Sketch({
      //     layer: graphicslayer,
      //     view: view,
      //     // graphic will be selected as soon as it is created
      //     creationMode: "update"
      //   });

      // view.ui.add(sketch, "bottom-left");

      // // We can either use this as the editor tag
      // sketch.on("create", function(event) {
      //       // check if the create event's state has changed to complete indicating
      //       // the graphic create operation is completed.
      //       if (event.state === "complete") {
      //         // remove the graphic from the layer. Sketch adds
      //         // the completed graphic to the layer by default.
      //       //   graphicslayer.remove(event.graphic);
      //             console.log(event.graphic.geometry.type)
          
      //         // use the graphic.geometry to query features that intersect it
      //       //   selectFeatures(event.graphic.geometry);
      //       }
      // })

      ///////////////////////////////////////////////////////////////////
      // Feature Layer
      // https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html
      // https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#fields
      // https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=layers-featurelayer-collection-edits
      // I can access shape properties now
      // console.log(feature_layer.source.items[0].geometry.type)
      

      // ADDING FEATURES TO THE POINTS FEATURE LAYER
      let feature_layer_points = new FeatureLayer({
            source: [], // Collection of Graphics
            fields: fields,
            objectIdField: "ObjectID",
            geometryType: "point",
            spatialReference: { wkid: 4326 },
            popupTemplate:popupTemplate_info
          });
      feature_layer_points.refreshInterval = 1; //Set the interval to 1 minute
      feature_layer_points.id = "feature_points"
      map.add(feature_layer_points);
      
      // ADDING FEATURES TO THE LINES FEATURE LAYER
      let feature_layer_lines = new FeatureLayer({
            source: [], // Collection of Graphics
            fields: fields,
            objectIdField: "ObjectID",
            geometryType: "polyline",
            spatialReference: { wkid: 4326 },
            popupTemplate:popupTemplate_info
          });
      feature_layer_lines.id = "feature_lines"
      map.add(feature_layer_lines);

      // ADDING FEATURES TO THE POLYGON FEATURE LAYER
      let feature_layer_polygons = new FeatureLayer({
            source: [], // Collection of Graphics
            fields: fields,
            objectIdField: "ObjectID",
            geometryType: "polygon",
            spatialReference: { wkid: 4326 },
            popupTemplate:popupTemplate_info
          });
      feature_layer_polygons.id = "feature_polygons"
      map.add(feature_layer_polygons);
      


      /////////////////////////////////////////////////////////////////
      // Probably best draw and edit feature layer
      // https://community.esri.com/t5/arcgis-api-for-javascript/can-i-draw-simple-geometries-and-save-them-as-features-on-my/td-p/120037
      
      
      
      /////////////////////////////////////////////////////////////////
      // EDIT FEATURE DATA
     //https://developers.arcgis.com/javascript/latest/edit-feature-data/

      
     //Editor widget

//     let editConfigPoliceLayer = {
//       layer: feature_layer_points,
//       // Set it so that only one field displays within the form
//       fieldConfig: [{
//         name: "Name",
//         label: "Name"
//       }]
//     };

//      https://developers.arcgis.com/javascript/latest/sample-code/widgets-editor-configurable/
// https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Editor-CreateWorkflowData.html
// Might have to create my own form
// We have the createworkflow and updateworkflow

      let editor = new Editor({
            view: view,
            allowedWorkflows: ["create","update"],
            container: document.getElementById("editWidget"), // Edit widget is defined in the index.html
            //layerInfos: if we do not want people to edit these layers specifically
            // layerInfos: [editConfigPoliceLayer]
      });
     // Add widget to the view
//      view.ui.add(editor, "top-right"); // We would use this if we wanted to have this directly on our map layer

      // Just like with Sketch widget we listened for the create maybe we can do similar stuff with the Editor
      // We look on Methods
      
//      console.log(editor.hasEventListener("create"))
      // view.popup.watch("visible", function(event){
            // console.log(view.popup)
            // console.log(view.popup.features)
            // console.log("here")
            // we can move this from here now
            // if (editor.activeWorkflow != null){
            //       console.log(editor.activeWorkflow.data.edits) // Do not pass this
            //       console.log(editor.activeWorkflow.data.edits.attributesModified)
            //       console.log(editor.activeWorkflow.data.edits.geometryModified)
            //       console.log(editor.activeWorkflow.data.edits.feature.toJSON()) // NOW THIS WORKS [geometry, attributes, symbol, popupTemplate]
            //       console.log(editor.activeWorkflow.data.edits._baselineGeometryJSON)
            //       console.log(editor.activeWorkflow.data.edits._baselineAttributesJSON)
            //       console.log(editor.activeWorkflow.data.edits.updatingHandles)
            //       console.log(editor.activeWorkflow.data.edits.modified)
            // }           
      // })

      /////////////////////////////////////////////////////////////////

      // THIS PORTION DEALS WITH SENDING DATA OVER

      // Here we are getting the event widget and we want to target
      // The Update button (Update)
      // The Delete Button (Delete)
      // Add features button (Add)

      // This is the feature which the user clicks
      // We are going to use the attribute from it to target the other layers
      let clicked_feature_attr; 

      // When A user clicks on item on the view we target the object id
      view.when(function(){
            view.on("click", function(event){
                  view.hitTest(event).then(function(response){
                        if (response.results[0]){
                              
                              clicked_feature_attr = response.results[0].graphic.attributes // Here we add the information, specifically the attributes
                              // response.results[0].graphic
                              // console.log(clicked_feature_attr) // Gives me the currently clicked element
                        }    
                  })
            })
      })

      // We use this to correct any added feature
      // To check for the type of feature
      function checkFeatureType(feature_info){
            if (feature_info.geometry.rings){
                  feature_info.attributes["Type"] = "polygon"
                  feature_info.geometry["type"] = "polygon"
            }
            else if(feature_info.geometry.paths){
                  feature_info.attributes["Type"] = "line"
                  feature_info.geometry["type"] = "polyline"
            }
            else{
                  feature_info.attributes["Type"] = "point"
                  feature_info.geometry["type"] = "point"
            }    
            feature_info.popupTemplate = popupTemplate_info
            return feature_info

      }

      //https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#applyEdits
      // Adding features to the client side feature layers

      
      function addClientFeatureLayer(type, featureJson){
            // addFeaturesData, updateFeaturesData, deleteFeaturesData
            let edits = addFeaturesData
            let featureGraphic;

            switch(type){
                  case "point":
                        featureJson.symbol = point_info.symbol
                        featureGraphic = new Graphic(featureJson) 
                        edits.addFeatures.push(featureGraphic)
                     
                        feature_layer_points.applyEdits(edits)
                        break
                  case "line" || "polyline":
                        featureJson.symbol = polyline_info.symbol
                        featureGraphic = new Graphic(featureJson) 
                        edits.addFeatures.push(featureGraphic)

                        feature_layer_lines.applyEdits(edits)
                        break
                  case "polygon":
                        featureJson.symbol = polygon_info.symbol
                        featureGraphic = new Graphic(featureJson) 
                        edits.addFeatures.push(featureGraphic)

                        feature_layer_polygons.applyEdits(edits)
                        break
            }
      }

      //////////////////////////////////////////////////////////////////////////////
      /* Preloaded features from Database */ 
      // Note listFeatures is a JavaScript promise object of all the Features in the database
      // Thus we have to call a user type on it and the type of feature we want
      
      function loadDBFeatures(){
            let listOfDBfeatures;
            let featureTypes = ["point", "line", "polygon"]
            
            for (let i = 0; i < featureTypes.length; i++){
                  listOfDBfeatures = listFeatures("residence", featureTypes[i])
                  listOfDBfeatures.then(function(featureListJson){
                        // Note we can also just pass in the array but we will have to do fixes
                        for (let k = 0; k < featureListJson.length; k++){
                              addClientFeatureLayer(featureTypes[i], featureListJson[k])
                        }
                        
                  })
            }     
      }
      loadDBFeatures()

      //////////////////////////////////////////////////////////////////////////////


      // Adding features to the client side feature layers

      function deleteClientFeatureLayer(type, featureJson){
            // Note the FeaturesData are JSON values
            // addFeaturesData, updateFeaturesData, deleteFeaturesData
            let edits = deleteFeaturesData 
            let featureGraphic;

            switch(type){
                  case "point":
                        featureJson.symbol = point_info.symbol
                        featureGraphic = new Graphic(featureJson) 
                        edits.deleteFeatures.push(featureGraphic)
                        
                        feature_layer_points.applyEdits(edits)
                        break
                  case "line" || "polyline":
                        featureJson.symbol = polyline_info.symbol
                        featureGraphic = new Graphic(featureJson) 
                        edits.deleteFeatures.push(featureGraphic)

                        feature_layer_lines.applyEdits(edits)
                        break
                  case "polygon":
                        featureJson.symbol = polygon_info.symbol
                        featureGraphic = new Graphic(featureJson) 
                        edits.deleteFeatures.push(featureGraphic)

                        feature_layer_polygons.applyEdits(edits)
                        break
            }
      }
      // Here we target the widget storing the add, update and delete feature
      // Now the work flow needs to be modified with the uuid as a comparison
      let esri_widget = document.getElementById("editWidget")
      
      esri_widget.onclick = function(event){
            // We have to load features in here to make sure it fully loads
            // console.log(feature_layer_points.source.items) // Here we get the feature list
            //https://support.esri.com/en/technical-article/000013384

            let current_widget_item = event.target
            let info_update;
            let feature_info;

            let feature_id;

            switch(current_widget_item.innerHTML){
                  case "Update":
                        info_update = "update"
                        feature_info = editor.activeWorkflow.data.edits.feature.toJSON()
                        // feature_id = clicked_feature_attr["ObjectID"];
                        feature_id = feature_info.attributes["uuid"] // Use the uuid instead
                        // Note that in the db both Object ID and UUID have the same values

                        feature_info = checkFeatureType(feature_info)
                        console.log(info_update)
                        console.log(feature_info)
                        
                        // Updating DB
                        updateExistingFeature("residence", feature_id, feature_info, feature_info.geometry["type"])
                        break
                  case "Add":
                        info_update = "add"
                        // console.log(feature_layer_points.source.items)

                        feature_info = editor.activeWorkflow.data.edits.feature.toJSON() 
                        // console.log(feature_info.attributes["ObjectID"])
                        let unique_id = uuid4()
                        feature_info.attributes["ObjectID"] = unique_id
                        feature_info.attributes["uuid"] = unique_id

                        /*****
                        // So we have known glitch where we have two features that are added
                        // Figure out how tof fix this

                        The other option is to use the object ids.
                        As we know the next new ones added would be of the last number that was added
                        So keep track of this in the program
                        ********************************************************* */

                        feature_info = checkFeatureType(feature_info)
                        // Note need to make sure we update feature layer too
                        addClientFeatureLayer(feature_info.attributes["Type"], feature_info) // Note we have a duplicate features one from the editor features
                        
                        // Adding to DB
                        addNewFeature("residence", feature_info, feature_info.attributes["Type"])
                        break

                  case "Delete":
                        info_update = "delete"
                        feature_info = editor.activeWorkflow.data.edits.feature.toJSON()

                        feature_info = checkFeatureType(feature_info) // Protective measure for features

                        // Dealing with the duplicate only touch db if their is a uuid
                        // None Editor widget data

                        if (feature_info.attributes){
                              console.log("Getting UUID")
                              feature_id = feature_info.attributes["uuid"] // Use the uuid instead
                        }
                        if (feature_id){ 
                              console.log(feature_id)
                              // Deleting from DB
                              console.log(info_update)
                              deleteClientFeatureLayer(feature_info.attributes["Type"], feature_info)
                              deleteFeatureObject("residence", feature_info.attributes["Type"] + "_ids", feature_id)
                        }
                        
                        break
            }
            // console.log(feature_id)

      }

     

      
      // Implement Table List feature
      function createFeatureTable(feature_layer){
            //https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-FeatureTable.html
            // https://developers.arcgis.com/javascript/latest/sample-code/widgets-tablelist/
            // https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=widgets-tablelist
            // third example is real good
            let featureTable = new FeatureTable({
                  view:view,
                  layer:feature_layer,
                  container: document.getElementById("tableInfo")
            })
            // const tableList = new TableList({
            //       // Two tables should display, the first one is stored within the webmap,
            //       //ie. Chicago public health statistics. The other is dynamically loaded
            //       //from the portal item, ie. Chicago Covid daily cases deaths and hospitalizations.
            //       map: webmap, // get access to the map which has the collection of tables
            //       selectionEnabled: true,
            //       listItemCreatedFunction: createActions,
            //       container: document.createElement("div")
            //     });
      }

      // Maybe I need this editing tool on the features
      // https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#EditingInfo
      // https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#applyEdits
      // Best example to use
      // https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=editing-applyedits

      /********************
       * Add feature layer From Gabby
       * 
       * The function loadOnlineFeatLayers adds the ArcGIS online Feature layers
       * Load in predefined layers
       ********************/

      function loadOnlineFeatLayers(){
            // Huntsville Boundary item 1
            let huntsvilleLayers = [
                  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Boundary/FeatureServer",
                  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Rivers_line_huntsville/FeatureServer",
                  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Transit_bus_stops/FeatureServer",
                  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Transit_bus_routes/FeatureServer",
                  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/lakes_and_rivers_polygons_huntsville/FeatureServer",
                  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Emergency_Management_Points_huntsville/FeatureServer"
                  // "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Census_sub_divisions/FeatureServer",
                  // "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/rivers_lines/FeatureServer",
                  // "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Transit_bus_stops/FeatureServer",
                  // "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Transit_bus_routes/FeatureServer",
                  // "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/lakes_and_rivers_polygons/FeatureServer",
                  // "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Emergency_Management_Historical_Events/FeatureServer"
            ]

            for (let i = 0; i < huntsvilleLayers.length; i++){
                  var newfeatureLayer = new FeatureLayer({
                        url: huntsvilleLayers[i]
                  });
                  map.add(newfeatureLayer)
                  // Test it out
                  if (i == huntsvilleLayers.length - 1){
                        createFeatureTable(newfeatureLayer)
                  }
            }    
      }
      loadOnlineFeatLayers()
      
      /********************
       * Add feature layer From Gabby
       * 
       * Load in layers from user input
       ********************/

      let search_btn = document.getElementById("search_btn_url")
      search_btn.onclick = function(){
            
            let url = document.getElementById("url_info").value
            // Need to check for mapservice stuff
            // Sample Url
            //https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Emergency_Management_Historical_Events/FeatureServer
            if (url && url.includes("https://services1.arcgis.com/") && url.includes("FeatureServer")){
                  var newfeatureLayer = new FeatureLayer({
                        url: url
                  });
                  map.add(newfeatureLayer)
                  alert("Layer was successfully added")
            }  else{
                  alert("Layer with url:" + url + " does not exists!")
            }
      }

      //Filter Feature Layer
      //https://developers.arcgis.com/javascript/latest/api-reference/esri-views-layers-support-FeatureFilter.html
 
      


      // Adding the Layers List
      // Untitled layers are the feature layers I created
      var layerList = new LayerList({
            view: view,
            container: document.getElementById("toggle_layers"), // Edit widget is defined in the index.html
          });
      // Add widget to the top right corner of the view
      // view.ui.add(layerList, "top-right");

  }
);