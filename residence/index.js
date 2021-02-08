// Data Written: January 25, 2021
// Last Updated: February 1, 2021
// This file will contain Javascript Code
// The Code will focus anything map related to the ArcGIS API for JAVASCRIPT
// This file will focus on the residences

import { fields, point_info, polyline_info, polygon_info, popupTemplate_info } from "./basis.js" // Importing our fields schema

import { deleteFeatureObject, updateExistingFeature,  addNewFeature, listFeatures, listFeatureIDs} from "../connection.js" // importing our database tools


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
    "esri/widgets/Editor"
  ], 
  /* NOW THE FUNCTION IS WHERE WE ADD THESE LIBRARIES*/
  /* I believe within in this function we will write all or JS code*/
  function(Map, MapView, BasemapToggle,BasemapGallery, Track, Locate, Search, PopupTemplate, 
      Graphic, GraphicsLayer, FeatureLayer, Sketch, Editor) { 

        /////////////////////////////////////////////////////////////
        // SETTING UP OUR MAP LAYER
        // All basemaps
        var map = new Map({
        basemap: "satellite"
        });

        var view = new MapView({
        container: "viewDiv", //We define viewDiv is what holds our div
        map: map,
        center: [-79.3832,43.6532], // Center at toronto now
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
      let graphicslayer = new GraphicsLayer()
      map.add(graphicslayer);


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



      const sketch = new Sketch({
          layer: graphicslayer,
          view: view,
          // graphic will be selected as soon as it is created
          creationMode: "update"
        });

      view.ui.add(sketch, "bottom-left");

      // We can either use this as the editor tag
      sketch.on("create", function(event) {
            // check if the create event's state has changed to complete indicating
            // the graphic create operation is completed.
            if (event.state === "complete") {
              // remove the graphic from the layer. Sketch adds
              // the completed graphic to the layer by default.
            //   graphicslayer.remove(event.graphic);
                  console.log(event.graphic.geometry.type)
          
              // use the graphic.geometry to query features that intersect it
            //   selectFeatures(event.graphic.geometry);
            }
      })

      ///////////////////////////////////////////////////////////////////
      // Feature Layer
      // https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html
      // https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#fields
      // https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=layers-featurelayer-collection-edits
      // I can access shape properties now
      // console.log(feature_layer.source.items[0].geometry.type)
        
      // ADDING FEATURES TO THE POINTS FEATURE LAYER
      let feature_layer_points = new FeatureLayer({
            source: [pointGraphic], // Collection of Graphics
            fields: fields,
            objectIdField: "ObjectID",
            geometryType: "point",
            spatialReference: { wkid: 4326 },
            popupTemplate:popupTemplate_info
          });
      feature_layer_points.refreshInterval = 0.2; //Set the interval to 1 minute

      map.add(feature_layer_points);
      
      // ADDING FEATURES TO THE LINES FEATURE LAYER
      let feature_layer_lines = new FeatureLayer({
            source: [polylineGraphic], // Collection of Graphics
            fields: fields,
            objectIdField: "ObjectID",
            geometryType: "polyline",
            spatialReference: { wkid: 4326 },
            popupTemplate:popupTemplate_info
          });
      map.add(feature_layer_lines);

      // ADDING FEATURES TO THE POLYGON FEATURE LAYER
      let feature_layer_polygons = new FeatureLayer({
            source: [polygonGraphic], // Collection of Graphics
            fields: fields,
            objectIdField: "ObjectID",
            geometryType: "polygon",
            spatialReference: { wkid: 4326 },
            popupTemplate:popupTemplate_info
          });
      map.add(feature_layer_polygons);
      


      /////////////////////////////////////////////////////////////////
      // Probably best draw and edit feature layer
      // https://community.esri.com/t5/arcgis-api-for-javascript/can-i-draw-simple-geometries-and-save-them-as-features-on-my/td-p/120037
      
      
      
      /////////////////////////////////////////////////////////////////
      // EDIT FEATURE DATA
     //https://developers.arcgis.com/javascript/latest/edit-feature-data/

      
     //Editor widget
     const editor = new Editor({
            view: view,
            allowedWorkflows: ["create","update"],
            container: document.getElementById("editWidget"), // Edit widget is defined in the index.html
            //layerInfos: if we do not want people to edit these layers specifically
      });
     // Add widget to the view
//      view.ui.add(editor, "top-right"); // We would use this if we wanted to have this directly on our map layer

      // Just like with Sketch widget we listened for the create maybe we can do similar stuff with the Editor
      // We look on Methods
      
//      console.log(editor.hasEventListener("create"))
      view.popup.watch("visible", function(event){
            // console.log(view.popup)
            // console.log(view.popup.features)
            console.log("here")
            // we can move this from here now
            if (editor.activeWorkflow != null){
                  console.log(editor.activeWorkflow.data.edits) // Do not pass this
                  console.log(editor.activeWorkflow.data.edits.attributesModified)
                  console.log(editor.activeWorkflow.data.edits.geometryModified)
                  console.log(editor.activeWorkflow.data.edits.feature.toJSON()) // NOW THIS WORKS [geometry, attributes, symbol, popupTemplate]
                  console.log(editor.activeWorkflow.data.edits._baselineGeometryJSON)
                  console.log(editor.activeWorkflow.data.edits._baselineAttributesJSON)
                  console.log(editor.activeWorkflow.data.edits.updatingHandles)
                  console.log(editor.activeWorkflow.data.edits.modified)
            }           
      })

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
                              console.log(clicked_feature_attr) // Gives me the currently clicked element
                        }    
                  })
            })
      })


      // Here we target the widget storing the add, update and delete feature
      let esri_widget = document.getElementById("editWidget")
      
      esri_widget.onclick = function(event){
            // We have to load features in here to make sure it fully loads
            console.log(feature_layer_points.source.items) // Here we get the feature list
            console.log(feature_layer_points.geometryType)
            //https://support.esri.com/en/technical-article/000013384

            let current_widget_item = event.target
            let info_update;
            let feature_info;

            let feature_id;
            // Note this caused problems !!!
            
            switch(current_widget_item.innerHTML){
                  case "Update":
                        info_update = "update"
                        feature_info = editor.activeWorkflow.data.edits.feature.toJSON()
                        feature_id = clicked_feature_attr["ObjectID"];
                        console.log(feature_info) // Leave this here for new info
                        // updateFeatureLayer("residence", feature_id, null)
                        break
                  case "Add":
                        info_update = "add"
                        // console.log(feature_layer_points.source.items)

                        feature_info = editor.activeWorkflow.data.edits.feature.toJSON() 
                        feature_info.attributes["ObjectID"] = 103;
                        
                        if (feature_info.geometry.rings){
                              feature_info.attributes["Type"] = "polygon"
                              feature_info.geometry["type"] = "polygon"
                              // We have polygon
                        }
                        else if(feature_info.geometry.paths){
                              feature_info.attributes["Type"] = "line"
                              feature_info.geometry["type"] = "polyline"
                        }
                        else{
                              feature_info.attributes["Type"] = "point"
                              feature_info.geometry["type"] = "point"
                        }
                        console.log(feature_info)
                        
                        // Note need to make sure we update feature layer too
                        // addFeatureLayer("residence",null, null)
                        addNewFeature("residence", feature_info, feature_info.attributes["Type"])
                        // Might be the hardest to do
                        // Tricky gotta figure out where the layer is

                        break
                  case "Delete":
                        info_update = "delete"
                        console.log(editor.activeWorkflow.data.edits.feature.toJSON()) // So this does work
                        feature_id = clicked_feature_attr["ObjectID"];
                        // deleteFeatureLayer("residence", null, feature_id)
                        break
            }
            // console.log(feature_id)

      }

      /// For Add feature we need a check to say the feature is not already in DB
      // Update Feature we need the new feature and the type
      // While delete feature we need the type of feature

      function returnFeature(){
            //pass
      }
      /////////////////////////////////////////////////////////////////

      // Maybe I need this editing tool on the features
      // https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#EditingInfo
      // https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#applyEdits
      // Best example to use
      // https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=editing-applyedits


    
      
  }
  );