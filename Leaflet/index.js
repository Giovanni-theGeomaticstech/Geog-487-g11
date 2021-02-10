// Adding in Map to application
var map = L.map('map', {
	editable: true,
	doubleClickZoom: false
  }).setView([45.32424, -79.210724], 15);

  let layer = L.esri.basemapLayer('Topographic').addTo(map);

 ///////////////////////////////////////////////////////////////////////////////////////////////
// Switch Between Base Maps
// Removed this Option
// As it gave multiple Basemaps

// var layerLabels;

// function setBasemap (basemap) {
// 	if (layer) {
// 	map.removeLayer(layer);
// 	}

// 	layer = L.esri.basemapLayer(basemap);

// 	map.addLayer(layer);

// 	if (layerLabels) {
// 	map.removeLayer(layerLabels);
// 	}

// 	if (
// 	basemap === 'ShadedRelief' ||
// 	basemap === 'Oceans' ||
// 	basemap === 'Gray' ||
// 	basemap === 'DarkGray' ||
// 	basemap === 'Terrain'
// 	) {
// 		layerLabels = L.esri.basemapLayer(basemap + 'Labels');
// 		map.addLayer(layerLabels);
// 	} else if (basemap.includes('Imagery')) {
// 		layerLabels = L.esri.basemapLayer('ImageryLabels');
// 		map.addLayer(layerLabels);
// 	}
// }

// document.querySelector('#basemaps').addEventListener('change', function (e) {
// 	var basemap = e.target.value;
// 	setBasemap(basemap);
// });


///////////////////////////////////////////////////////////////////////////////////////////////
// Geocoding Search Bar
var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider();

L.esri.Geocoding.geosearch({
	position:"topright",
	providers: [
	arcgisOnline,
	L.esri.Geocoding.mapServiceProvider({
		label: 'States and Counties',
		url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer',
		layers: [2, 3],
		searchFields: ['NAME', 'STATE_NAME']
	})
	]
}).addTo(map);


///////////////////////////////////////////////////////////////////////////

// var map = L.map('map', {
// 	editable: true,
// 	doubleClickZoom: false
// })
  // mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	
// L.tileLayer(
// 	'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// 	attribution: '&copy; ' + mapLink + ' Contributors',
// 	maxZoom: 18,
// 	}).addTo(map);

// LICON is styling for the Marker symbols/points
//https://leafletjs.com/examples/custom-icons/
var LeafIcon = L.Icon.extend({
	options: {
		shadowUrl: 
			'http://leafletjs.com/docs/images/leaf-shadow.png',
		iconSize:     [38, 95],
		shadowSize:   [50, 64],
		iconAnchor:   [22, 94],
		shadowAnchor: [4, 62],
		popupAnchor:  [-3, -76]
	}
});

// Use this to change the marker symbol
var greenIcon = new LeafIcon({
	iconUrl: 'https://image.freepik.com/free-icon/map-marker_318-49860.jpg'
});

// FeatureGroup might be similar to FeatureLayer in ArcGIS API for Javascript
// https://docs.eegeo.com/eegeo.js/v0.1.730/docs/leaflet/L.FeatureGroup/
// https://www.tutorialspoint.com/leafletjs/leafletjs_layers_group.htm

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
	position: 'bottomleft',
	draw: {
		polygon: {
			shapeOptions: {
				color: 'purple'
			},
			allowIntersection: false,
			drawError: {
				color: 'orange',
				timeout: 1000
			},
			showArea: true,
			metric: false,
			repeatMode: true
		},
		polyline: {
			shapeOptions: {
				color: 'red'
			},
		},
		// rect: {
		// 	shapeOptions: {
		// 		color: 'green'
		// 	},
		// },
		// circle: {
		// 	shapeOptions: {
		// 		color: 'steelblue'
		// 	},
		// },
		marker: {
			icon: greenIcon
		},
	},
	edit: {
		featureGroup: drawnItems
	}
});
map.addControl(drawControl);



// This portion Adds the layer that we draw to (layer) to the map

map.on('draw:created', function (feature) {
	let type = feature.layerType, layer = feature.layer;
	alert(type)
	// alert("<input type='text'>")

	if (type === 'marker') {
		// We can manipulate the information based on html tags
		// We need to think of the meta data aspect ???
		layer.bindPopup('<h1>Head Information</h1> + <p>Wah gwaan</p?');
	}
	
	console.log(layer)
	drawnItems.addLayer(layer);
});

// https://gis.stackexchange.com/questions/259250/how-to-detect-delete-or-edit-events-in-popup-menu-created-with-leaflet-draw

// For edit event
// Better for the two events is to get the clicked features
map.on('draw:edited', function (evt) {
	layer = evt.layer;
	console.log(layer)
	// do something when polygon is edited
});

// For deleted event
map.on('draw:deleted', function(feature){
	alert(feature.layerType)
})

// To access the coords for points
// layer.editing._maker._latlng

// For polygon
// layer.editing.latlngs

// For Lines
// layer.editing.latlngs

// Esri leaflet feature
// http://esri.github.io/esri-leaflet/api-reference/layers/feature-layer.html

// For metadata for our service layer
//https://esri.github.io/esri-leaflet/examples/getting-service-metadata.html


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Creating the Leaflet Layer List

// Adding in our layers

// Define Huntsville Feature Layers

function loadOnlineFeatLayers(){

	// Huntsville Boundary item 1
	// var CensusSubdivisions = L.esri.featureLayer({ 
	// 	url: "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Census_sub_divisions/FeatureServer/0"})
	// var HunstvilleTransitBusStops = L.esri.featureLayer({url: "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Transit_bus_stops/FeatureServer/0"})
	// var HuntsvilleTransitBusRoutes = L.esri.featureLayer({ url: "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Transit_bus_routes/FeatureServer/0"})
	// var LakesAndRivers = L.esri.featureLayer({url:"https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/lakes_and_rivers_polygons/FeatureServer/0"})
	// var RiversLines = L.esri.featureLayer({url: "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/rivers_lines/FeatureServer/0"})
	// var Emergency_Management_HistoricalEvent = L.esri.featureLayer({url: "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Emergency_Management_Historical_Events/FeatureServer/0"})
	
	let huntsvilleLayers = [
		  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Boundary/FeatureServer/0",
		  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Rivers_line_huntsville/FeatureServer/0",
		  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Transit_bus_stops/FeatureServer/0",
		  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Transit_bus_routes/FeatureServer/0",
		  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/lakes_and_rivers_polygons_huntsville/FeatureServer/0",
		  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Emergency_Management_Points_huntsville/FeatureServer/0"
		  // "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Census_sub_divisions/FeatureServer",
		  // "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/rivers_lines/FeatureServer",
		  // "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Transit_bus_stops/FeatureServer",
		  // "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Transit_bus_routes/FeatureServer",
		  // "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/lakes_and_rivers_polygons/FeatureServer",
		  // "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Emergency_Management_Historical_Events/FeatureServer"
	]

	let nameLayers = ["Huntsville Boundary", "Rivers", "Bus Stops", "Bus Routes", "Lakes and Rivers", "Historical Emergency Management Events"]
	let featureLayers = {} // Our Layers
	for (let i = 0; i < huntsvilleLayers.length; i++){
		  var newfeatureLayer = L.esri.featureLayer({
				url: huntsvilleLayers[i]
		  });
		  featureLayers[nameLayers[i]] = newfeatureLayer
	}    
	// Creates layer list and adds feature layers to map
	// Create layer list 
	var imagery = L.esri.basemapLayer('Imagery');
    var topo = L.esri.basemapLayer('Topographic');

	var baseMaps = {
		"Imagery": imagery,
		"Topographic": topo
	};

	//https://www.wrld3d.com/wrld.js/latest/docs/leaflet/L.Control.Layers/
	
	let controlPanel = L.control.layers(baseMaps, featureLayers, )
	controlPanel.setPosition("bottomright")
	controlPanel.addTo(map)
}
loadOnlineFeatLayers()

// var OverlayMaps = {
//     "Census Subdivisions": CensusSubdivisions,
//     "Bus Stops": HunstvilleTransitBusStops,
//     "Bus Routes": HuntsvilleTransitBusRoutes,
//     "Lakes and Rivers": LakesAndRivers,
//     "River Outlines": RiversLines,
//     "Emergency Management Historical Events": Emergency_Management_HistoricalEvent,    
// };
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// Adding Locator
// https://esri.github.io/esri-leaflet/api-reference/
// https://docs.mapbox.com/mapbox.js/example/v1.0.0/leaflet-locatecontrol/
// Note to self we can also integrate differenct cdns for leaflet from mapbox for example
L.control.locate().addTo(map);


// https://www.w3schools.com/js/js_timing.asp
// Timing JS
// https://www.w3schools.com/js/js_ajax_http_send.asp
// Probably use ajax for .env
// https://www.w3schools.com/js/tryit.asp?filename=tryjs_api_fetch
// Probably need webworks for the pop up
//https://www.w3schools.com/js/js_api_web_workers.asp
// Classes Javascript
// https://www.w3schools.com/jsref/jsref_classes.asp