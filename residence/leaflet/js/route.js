const apiKey = "AAPK97141046da3e451bbae39017f1f1105b_EGKfxJiq-gy67CMrDr-il8H9t4-5sly02yt-vTCAaeJm5ZEno5_tfub3a-_TB_T"
    const basemapEnum = "ArcGIS:Navigation";
    const map = L.map('map', {
    minZoom: 2

    }).setView([43.6532,-79.3832], 12); // Toronto

    L.esri.Vector.vectorBasemapLayer(basemapEnum, {
    apiKey: apiKey
    }).addTo(map);

    // ROUTING DIRECTIONS RELATED
    // Add a DOM Node to display the text routing directions
    
    const directions = document.createElement("div");
    directions.id = "directions";
    directions.innerHTML = "Click on the map to create a start and end for the route.";
    document.body.appendChild(directions);

    // Layer Group for start/end-points
    const startLayerGroup = L.layerGroup().addTo(map);
    const endLayerGroup = L.layerGroup().addTo(map);

    // Layer Group for route lines
    const routeLines = L.layerGroup().addTo(map);

    let currentStep = "start";
    let startCoords, endCoords;

    // function routing_setup(){
    //     // ROUTING DIRECTIONS RELATED
    //     // Add a DOM Node to display the text routing directions
    
    //     const directions = document.createElement("div");
    //     directions.id = "directions";
    //     directions.innerHTML = "Click on the map to create a start and end for the route.";
    //     document.body.appendChild(directions);

    //     // Layer Group for start/end-points
    //     const startLayerGroup = L.layerGroup().addTo(map);
    //     const endLayerGroup = L.layerGroup().addTo(map);

    //     // Layer Group for route lines
    //     const routeLines = L.layerGroup().addTo(map);

    //     let currentStep = "start";
    //     let startCoords, endCoords;

    // }

    ////////////////////////////////////////////////////////////////////////////
    export function updateRoute() {
      // Create the arcgis-rest-js authentication object to use later.
      const authentication = new arcgisRest.ApiKey({
        key: apiKey
      });

      // make the API request
      arcgisRest
        .solveRoute({
          stops: [startCoords, endCoords],
          endpoint: "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve",
          authentication
        })
        .then((response) => {
          // Show the result route on the map.
          routeLines.clearLayers();
          L.geoJSON(response.routes.geoJson).addTo(routeLines);

          // Show the result text directions on the map.
          const directionsHTML = response.directions[0].features.map((f) => f.attributes.text).join("<br/>");
          directions.innerHTML = directionsHTML;
          startCoords = null;
          endCoords = null;
        })
        .catch((error) => {
          console.error(error);
          alert("There was a problem using the route service. See the console for details.");
        });
    }
    //////////////////////////////////////////////////////////////////////////////////


    // When the map is clicked, get the coordinates, store the start or end
    // state, and pass them to the updateRoute function which calls the REST endpoint.
    map.on("click", (e) => {
      const coordinates = [e.latlng.lng, e.latlng.lat];

      if (currentStep === "start") {
        startLayerGroup.clearLayers();
        endLayerGroup.clearLayers();
        routeLines.clearLayers();
        L.marker(e.latlng).addTo(startLayerGroup);
        startCoords = coordinates;
        currentStep = "end";
      } else {
        L.marker(e.latlng).addTo(endLayerGroup);
        endCoords = coordinates;
        currentStep = "start";
      }

      if (startCoords && endCoords) {
        updateRoute();
      }
    });