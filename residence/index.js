// Data Written: January 25, 2021
// This file will contain Javascript Code
// The Code will focus anything map related to the ArcGIS API for JAVASCRIPT
// This file will focus on the residences


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


    // Add Map graphics
    "esri/Graphic"
  ], 
  /* NOW THE FUNCTION IS WHERE WE ADD THESE LIBRARIES*/
  /* I believe within in this function we will write all or JS code*/
  function(Map, MapView, BasemapToggle, BasemapGallery, Track, Locate, Search, Graphic) { 

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
      
     // Edit Feature Data
     //https://developers.arcgis.com/javascript/latest/edit-feature-data/

     // Service Areas
     //https://developers.arcgis.com/javascript/latest/find-service-areas/

     // Route and Directions (Maybe for rescue of people)
     //https://developers.arcgis.com/javascript/latest/find-a-route-and-directions/

      // Point layers
     //https://developers.arcgis.com/javascript/latest/add-a-point-line-and-polygon/

  }
  );