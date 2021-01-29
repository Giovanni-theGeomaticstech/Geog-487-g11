// Data Written: January 25, 2021
// This file will contain Javascript Code
// The Code will focus anything map related to the ArcGIS API for JAVASCRIPT
// This file will focus on the residences

import { fields, point_info, polyline_info, polygon_info, popupTemplate_info } from "./basis.js" // Importing our fields schema

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
      
      let graphicslayer = new GraphicsLayer()
      map.add(graphicslayer);

      

      //Now we create Graphic to add point
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
      view.popup.watch("visible", function(event){
            console.log(view.popup)
            console.log(view.popup.features)
            console.log("here")
      })
   
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

      ///////////////////////////////////////////////////////////////////
      // Feature Layer
      // https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html
      // https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#fields
      // https://developers.arcgis.com/javascript/latest/sample-code/sandbox/index.html?sample=layers-featurelayer-collection-edits
      // I can access shape properties now
      // console.log(feature_layer.source.items[0].geometry.type)
 
      let feature_layer_points = new FeatureLayer({
            source: [pointGraphic], // Collection of Graphics
            fields: fields,
            objectIdField: "ObjectID",
            geometryType: "point",
            spatialReference: { wkid: 4326 },
            popupTemplate:popupTemplate_info
          });
      map.add(feature_layer_points);
      

      let feature_layer_lines = new FeatureLayer({
            source: [polylineGraphic], // Collection of Graphics
            fields: fields,
            objectIdField: "ObjectID",
            geometryType: "polyline",
            spatialReference: { wkid: 4326 },
            popupTemplate:popupTemplate_info
          });
      map.add(feature_layer_lines);

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
            view: view
      });
     // Add widget to the view
     view.ui.add(editor, "top-right");
      
  }
  );