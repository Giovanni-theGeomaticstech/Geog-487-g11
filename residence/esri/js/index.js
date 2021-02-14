// Data Written: January 25, 2021
// Last Updated: February 1, 2021
// This file will contain Javascript Code
// The Code will focus anything map related to the ArcGIS API for JAVASCRIPT
// This file will focus on the residences

import { fields, point_info, BUS_stops_Popup, EMH_Popup, polyline_info, polygon_info, popupTemplate_info, addFeaturesData, updateFeaturesData, deleteFeaturesData, point_stylings } from "../../../js/basis.js" // Importing our fields schema

import { deleteFeatureObject, updateExistingFeature,  addNewFeature, listFeatures, listFeatureIDs, } from "../../../js/connection.js" // importing our database tools

import { uuid4 } from "../../../js/uuid4.js" // Unique IDs

import { calcNearestPoint, pointsWithinPolygon } from "../../../js/spatial_analysis.js" // importing our spatial analysis functions

// close to achieve cdn node
// require("")
// require('dotenv').config()

require([
    /* REQUIRE HOLDS ALL THE MODULES/LIBRARIES WE WILL BE USING */
    "esri/config", // To config api key to 
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

    // RouteTasks
    "esri/tasks/RouteTask",

    // RouteParameters
    "esri/tasks/support/RouteParameters",

    // FeatureSet
    "esri/tasks/support/FeatureSet",

    // Service Area
    "esri/tasks/ServiceAreaTask",
    "esri/tasks/support/ServiceAreaParameters",

    // Line Symbol
    "esri/symbols/LineSymbolMarker",


    //NodeJs
//     "dojo/node!dotenv"

  ], 
  /* NOW THE FUNCTION IS WHERE WE ADD THESE LIBRARIES*/
  /* I believe within in this function we will write all or JS code*/
  function(esriConfig, Map, MapView, BasemapToggle,BasemapGallery, 
      Track, Locate, Search, PopupTemplate, 
      Graphic, GraphicsLayer, FeatureLayer, 
      Sketch, Editor, LayerList, FeatureTable, TableList,
      RouteTask, RouteParameters, FeatureSet,
      ServiceAreaTask, ServiceAreaParams,
      LineSymbolMarker,) { //dotenv

        /////////////////////////////////////////////////////////////
        // SETTING UP OUR MAP LAYER
        // All basemaps
        // Change out
        const apiKey = "AAPK97141046da3e451bbae39017f1f1105b_EGKfxJiq-gy67CMrDr-il8H9t4-5sly02yt-vTCAaeJm5ZEno5_tfub3a-_TB_T"
        esriConfig.apiKey = apiKey
        
        var map = new Map({
            basemap: "arcgis-imagery",
        });

        var view = new MapView({
            container: "viewDiv", //We define viewDiv is what holds our div
            map: map,
            center: [-79.210724,45.32424], // Center at Huntsville
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
              nextBasemap: "arcgis-navigation"
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
            title: "Resident Data - Points",
            objectIdField: "ObjectID",
            geometryType: "point",
            renderer: {type:"simple", symbol:point_stylings["tear_pin1"]},
            spatialReference: { wkid: 4326 },
            popupTemplate:popupTemplate_info
          });
      feature_layer_points.refreshInterval = 1; //Set the interval to 1 minute
      feature_layer_points.id = "feature_points"
      map.add(feature_layer_points);
      
      // ADDING FEATURES TO THE LINES FEATURE LAYER
      let feature_layer_lines = new FeatureLayer({
            source: [], // Collection of Graphics
            title: "Resident Data - Lines",
            fields: fields,
            objectIdField: "ObjectID",
            geometryType: "polyline",
            renderer: {type:"simple", symbol:polyline_info["symbol"]},
            spatialReference: { wkid: 4326 },
            popupTemplate:popupTemplate_info
          });
      feature_layer_lines.id = "feature_lines"
      map.add(feature_layer_lines);

      // ADDING FEATURES TO THE POLYGON FEATURE LAYER
      let feature_layer_polygons = new FeatureLayer({
            source: [], // Collection of Graphics
            title: "Resident Data - Polygons",
            fields: fields,
            objectIdField: "ObjectID",
            geometryType: "polygon",
            renderer: {type:"simple", symbol:polygon_info["symbol"]},
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
                        // featureJson.symbol = point_info.symbol
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
                              let layerJson = featureListJson[k]
                              
                              // The GeoJSON in Leaflet to Feature For ArcGIS Api
                              // delete layerJson["type"]
                              // if (layerJson.attributes["Type"].toLowerCase() == "linestring"){
                              //       layerJson.attributes["Type"] = "line"
                              //       layerJson.geometry["type"] = "polyline" 
                              // }
                              if (layerJson["type"]){ // temporary
                                    continue
                              }
                              addClientFeatureLayer(featureTypes[i], layerJson)
                              
                        }
                        
                  })
            }     
      }
      // Called after the online Feature Layers

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
      
      // Developed this to work with the Editor Widget

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
       * Loading Predefined ArcGIS Online Layers
       * 
       * The function loadOnlineFeatLayers adds the ArcGIS online Feature layers
       * Load in predefined layers
       ********************/
      let onlineFeatureLayers = {}
      function loadOnlineFeatLayers(){
            // Huntsville Boundary item 1
            let huntsvilleLayers = [
                  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Boundary/FeatureServer",
                  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Rivers_line_huntsville/FeatureServer",
                  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Transit_bus_stops/FeatureServer",
                  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Transit_bus_routes/FeatureServer",
                  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/lakes_and_rivers_polygons_huntsville/FeatureServer",
                  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Emergency_Management_Points_huntsville/FeatureServer"
            ]
            let onlineFeatureNames = ["boundary", "river_lines", "bus_stops", "bus_routes", "lakes_and_rivers", "emergency"]
            for (let i = 0; i < huntsvilleLayers.length; i++){
                  let newfeatureLayer;
                  let symbol;
                  let popupTemplate;

                  if (onlineFeatureNames[i] == "bus_stops"){
                        symbol = {
                              type:"simple",
                              symbol: point_stylings["bus_stops"]
                        }
                        popupTemplate = BUS_stops_Popup                        
                  }
                  else if (onlineFeatureNames[i] == "emergency"){
                        symbol = {
                              type:"simple",
                              symbol: point_stylings["flag"],
                        }
                        popupTemplate = EMH_Popup
                  }
                  else if (onlineFeatureNames[i] == "boundary"){
                        symbol = {type:"simple", symbol:polygon_info["symbol"]}
                        symbol.symbol.color = [74, 69, 0, 0.5]
                  }
                  else if (onlineFeatureNames[i] == "bus_routes"){
                        symbol = {type:"simple", symbol:polyline_info["symbol"]}
                        symbol.symbol.color = "#A10A8A"
                        symbol.symbol.width = 4
                  }
                  if (symbol){
                        newfeatureLayer = new FeatureLayer({
                              url: huntsvilleLayers[i],
                              renderer:symbol, // https://developers.arcgis.com/javascript/latest/style-a-feature-layer/
                              visible: false,
                              popupTemplate: popupTemplate,
                        });
                  }
                  else{
                        newfeatureLayer = new FeatureLayer({
                              url: huntsvilleLayers[i],
                              visible: false,
                        });
                  }
                  
                  onlineFeatureLayers[onlineFeatureNames[i]] = newfeatureLayer
                  map.add(newfeatureLayer)
                  // Test it out
                  if (i == huntsvilleLayers.length - 1){
                        createFeatureTable(newfeatureLayer)
                  }
            }    
      }
      loadOnlineFeatLayers() // Features from ArcGiS Online
      loadDBFeatures() // Feature Layers from the DB
      
      
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // Loading External ArcGIS Layers
      
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      //Filter Feature Layer
      //https://developers.arcgis.com/javascript/latest/api-reference/esri-views-layers-support-FeatureFilter.html

      // Adding the Layers List
      // Untitled layers are the feature layers I created
      var layerList = new LayerList({
            view: view,
            container: document.getElementById("toggle_layers"), // Edit widget is defined in the index.html
          });
      

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ROUTE DIRECTIONS
      const routeTask = new RouteTask({
            url: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"
      });

      ///////////////////////////////////////////////////////////////////////////
      // Here we implement the getRoute
      function getRoute(directions=null) {
            const routeParams = new RouteParameters({ // Here the Route Parameters that are passed over to be solved in RouteTask
              stops: new FeatureSet({
                features: view.graphics.toArray()
              }),
              polygonBarriers: onlineFeatureLayers["lakes_and_rivers"], // Serves as the Barrier in the case of flood event
              returnDirections: true // So we can get the directions
            });

            routeTask.solve(routeParams).then(function(data) { // Here we solve the Route with Route Task
                  console.log(data)
                  data.routeResults.forEach(function(result) {
                        result.route.symbol = {
                              color: "#FCB61E",
                              width: 2.5,
                              type:"simple-line",
                              // Define a blue "x" marker at the beginning of the line
                              marker: { // autocasts from LineSymbolMarker
                                 style: "arrow",
                                 color: "green",
                                 placement: "end"
                              }
                           };
                        view.graphics.add(result.route); // The New Route added to the layer
                  });

                  // Display Directions
                  if (data.routeResults.length > 0){
                        // Here we are going to use some of esri's styling with the widget
                        directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
                        // directions.style.marginTop = "0";
                        directions.style.padding = "15px 15px 15px 30px";
                        const directionFeatures = data.routeResults[0].directions.features;
                  

                        // Show each direction
                        let container = document.getElementById("RouteLocator")
                        directionFeatures.forEach(function(result,i){
                              const direction_ele = document.createElement("p");
                              direction_ele.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
                              directions.appendChild(direction_ele);
                        })
                        container.append(directions)
                        // view.ui.empty("top-right")
                        // view.ui.add(directions, "top-right")
                  }
            }).catch(function(error){ // Catch errors
                  console.log(error);
                  console.log("Error with creating route");
            }) 
      }
            

      ///////////////////////////////////////////////////////////////////////////
      // Here we go can use it to load in GeoJSON files
      // Reimplement function
      function getGeoJsonFromFile(file=null){
            file = "../../../data/Huntsville_Transit.geojson"

            let featureCollection = fetch (file).then(x => x.text()).then(function(data){
                  data = JSON.parse(data) // parse the data to make it JavaScript object
                  // var center = turf.center(data);
                  // console.log(center)
                  console.log(data)
                  return data
             })
            return featureCollection
      }
      ///////////////////////////////////////////////////////////////////////////

      ///////////////////////////////////////////////////////////////////////////
      // We use this function to create the new point graphic to the layer
      function addPointGraphic(type, point, serviceArea=null) {
            let graphic;
            
            if (serviceArea){ // If we are dealing with a service area point
                  view.graphics.removeAll();
                  graphic = new Graphic({
                        geometry:point,
                        symbol:point_stylings["locator"]
                  })
            }else{
                  graphic = new Graphic({
                        symbol: point_stylings["locator"],
                        geometry: {
                            x: point[0],
                            y: point[1],
                            type:"point"
                      } // Add popuptemplate
                    });
                      
            }
            view.graphics.add(graphic);
            return graphic
      }
      ////////////////////////////////////////////////////////////////////////


      ///////////////////////////////////////////////////////////////////////////
      function showPosition(position) {
            // ROUTING DIRECTIONS RELATED
            // Add a DOM Node to display the text routing directions
            // const directionsWidget = document.createElement("div");
            // directionsWidget.id = "directions";
            
            let directionsWidget = document.getElementById("directions")
            directionsWidget.innerHTML = "<h4>Route Directions</h4>";
            document.body.appendChild(directionsWidget);
      
            let startCoords, endCoords;
            
            let curr_position = [position.coords.longitude, position.coords.latitude]
            
            // startCoords = curr_position // Use this for GPS coordinates
            // Note it works via tracker and by current location
            startCoords = [-79.21996483220589, 45.31764832102381] // Here I use test coordinates
      
            let featureCollects = getGeoJsonFromFile() // Note this is a promise object
            
            featureCollects.then(function(featureCollection){
                  let endPoint = calcNearestPoint(startCoords, featureCollection) // Find the Nearest Bus Locations
                  endCoords = turf.getCoords(endPoint) // Getting the Coords to bus location
                  
                  // Rest of code here
                  let startPointMarker, endPointMarker
                  console.log(view.graphics.length)
                  if (view.graphics.length >= 2){ // if we already have the start coords and endcoords added
                        view.graphics.removeAll();
                  }
                  if (startCoords && endCoords) {
                        startPointMarker = addPointGraphic("origin", startCoords)
                        endPointMarker = addPointGraphic("destination", endCoords);
                        view.center = startCoords
                        view.zoom = 16
                        
                        startPointMarker.attributes = {
                              ObjectID: uuid4(),
                              uuid: uuid4(),
                              Type: "point",
                              Name: "Your Current location",
                              Description: "The Start Point of the route",
                              Data_added: Date.now()
                        }
                        startPointMarker.popupTemplate = point_info.popupTemplate

                        endPointMarker.attributes = endPoint.properties
                        let modTemplate = { // The template for Near Bustop to the users location
                              title: "{Stop_Name}",
                              outFields:["*"],
                              content: [{
                                    type: "fields",
                                    fieldInfos: [{
                                          fieldName: "Stop_Num", // The field for access the date from attributes
                                          label: "Stop Number"
                                        }
                                    ]
                              }]
                           }
                        
                        endPointMarker.popupTemplate = modTemplate
                        
                        getRoute(directionsWidget); // We get our route
                  } 
            })
            
            console.log("Latitude: " + position.coords.latitude +
            "<br>Longitude: " + position.coords.longitude)
      }

      // Here make geolocation functions to be used in the application for the analysis

      let calcRouteBtn = document.getElementById("calc_route")

      calcRouteBtn.onclick = function() {
            if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                  alert("Geolocation is not supported by this browser.")
            }
      }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      // SERIVICE AREA
      const serviceAreaTask = new ServiceAreaTask({
            url: "https://route.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea"
      });




///////////////////////////////////////////////////////////////////////////////////////
// Gathers Data from points in the Service area generated through VGI
      function serviceAreaData(serviceFeatureCollection){
            var serviceAreaInfoDump = document.getElementById("servicedump")
            serviceAreaInfoDump.innerHTML = ""

            // Here We are going to add in points from the VGI
            let vgiFeaturesPromise = listFeatures("residence", "point") // We just need the point data
            vgiFeaturesPromise.then(function(featuresList){
                  let data = pointsWithinPolygon(featuresList, serviceFeatureCollection) // A dictionary

                  serviceAreaInfoDump.classList = "esri-widget esri-widget--panel esri-directions__scroller";
                  serviceAreaInfoDump.style.padding = "15px 15px 15px 30px";
                  
                  for (let serviceName in data){
                        let serviceHeader = `<h4>${serviceName}</h4></br>`
                        serviceAreaInfoDump.innerHTML += serviceHeader 
                        for (let i = 0; i < data[serviceName].length; ++i){
                              serviceAreaInfoDump.innerHTML += data[serviceName][i] + "</br>" // That feature content
                        }
                  }
            })
      }
///////////////////////////////////////////////////////////////////////////////////////
      // Execute the Service Area Task
      
      function executeServiceAreaTask(serviceAreaParams) {

            return serviceAreaTask.solve(serviceAreaParams)
              .then(function(result){
                if (result.serviceAreaPolygons.length) {                  
                  // Draw each service area polygon
                  result.serviceAreaPolygons.forEach(function(graphic){
                  graphic.symbol = {
                  type: "simple-fill",
                  color: "rgba(255,50,50,.25)"
                  }
                  view.graphics.add(graphic,0);
                  });
                  let serviceAreaPolygons = result.serviceAreaPolygons
                  return serviceAreaPolygons // Here we return the service area polygons
                }
              }, function(error){
                console.log(error);
                alert("Error in Service Area Calculation")
              });
    
      }
      
      // Create Service Area Params
      function createServiceAreaParams(locationGraphic, driveTimeCutoffs, outSpatialReference) {

            // Create one or more locations (facilities) to solve for
            const featureSet = new FeatureSet({
              features: [locationGraphic]
            });

            // Set all of the input parameters for the service
            const taskParameters = new ServiceAreaParams({
                  facilities: featureSet,
                  defaultBreaks: driveTimeCutoffs,
                  trimOuterPolygon: true,
                  outSpatialReference: outSpatialReference
            });
            return taskParameters;
    
      }


      // The function to generate the point (location of interests) when one double clicks on the map
      // It will call sericeAreaData to generate data for the service area
      function serviceArea(){
            view.on("double-click", function(event){
                  const locationGraphic = addPointGraphic("point", event.mapPoint, "service")

                  const driveTimeCutoffs = [5,10,15]; // Minutes
                  // Create the Service Srea Params
                  const serviceAreaParams = createServiceAreaParams(locationGraphic, driveTimeCutoffs, view.spatialReference);
                  
                  let serviceAreaFeatures = executeServiceAreaTask(serviceAreaParams); // Execute the Service area
                  serviceAreaFeatures.then(function(features){
                        for (let i = 0; i < features.length; i++){
                              let featureJSON = features[i].toJSON()
                              // Changing it to feature geojson
                              
                              featureJSON.properties = featureJSON.attributes
                              featureJSON.type = "Feature"
                              
                              featureJSON.geometry = {
                                    coordinates: featureJSON.geometry.rings,
                                    type:"Polygon"
                              }
                              delete featureJSON.attributes
                              delete featureJSON.popupTemplate
                              delete featureJSON.symbol
                              features[i] = featureJSON
                        }
                        // Changing it to Turf FeatureCollection
                        let featureCollection = turf.featureCollection(features)
                        console.log(featureCollection)
                        serviceAreaData(featureCollection)
                  }) // Closing for ServiceAreaFeatures
                  
            })
      }
      serviceArea()

      let clearServiceAreaBtn = document.getElementById("clearService")
      
      clearServiceAreaBtn.onclick = function(){
            view.graphics.removeAll()
      }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }
);