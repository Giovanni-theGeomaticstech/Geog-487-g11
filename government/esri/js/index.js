// Data Written: January 25, 2021
// This file will contain Javascript Code
// The Code will focus anything map related to the ArcGIS API for JAVASCRIPT
// This file will focus on the residences


require([
    /* REQUIRE HOLDS ALL THE MODULES/LIBRARIES WE WILL BE USING */
    "esri/Map",
    "esri/views/MapView"
  ], 
  /* NOW THE FUNCTION IS WHERE WE ADD THESE LIBRARIES*/
  /* I believe within in this function we will write all or JS code*/
  function(Map, MapView) { 

        var map = new Map({
        basemap: "topo-vector"
        });

        var view = new MapView({
        container: "viewDiv", //We define viewDiv is what holds our div
        map: map,
        center: [-79.3832,43.6532], // Center at toronto now
        zoom: 15
        });
  }
  );