import { uuid4 } from "../js/uuid4.js"
import { deleteFeatureObject, updateExistingFeature,  addNewFeature, listFeatures, listFeatureIDs, } from "../js/connection.js" // importing our database tools


///////////////////////////////////////////////////////////////////////////////////////////////

// Adding in Map to application
var map = L.map('map', {
	editable: true,
	doubleClickZoom: false
  }).setView([45.32424, -79.210724], 15);

  let layer = L.esri.basemapLayer('Topographic').addTo(map);
///////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Adding Locator

// https://esri.github.io/esri-leaflet/api-reference/
// https://docs.mapbox.com/mapbox.js/example/v1.0.0/leaflet-locatecontrol/
// Note to self we can also integrate differenct cdns for leaflet from mapbox for example
L.control.locate().addTo(map);

//////////////////////////////////////////////////////////////////////////////////////////////////////////



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
// Making the Point Marker symbol

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






///////////////////////////////////////////////////////////////////////////////////////////////
// Adding the drawing info for the features 

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
	// position: 'bottomleft',
	// container: document.getElementById("toolbar"),
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

///////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////
// The metadata feature information
// The Javascript for allowing our form to automatically open when we draw to map
let formOpen = document.getElementById("myForm")

function metaInfoPopup(){
	formOpen.style.display = "block";
}
///////////////////////////////////////////////////////////////////////////////////


// The Add information Button
let addInfoBtn = document.getElementById("addBtn") // When we submit the info
let closeBtn = document.getElementById("closeBtn")

// This variable stores the metadata
let addAttributeData;



// Formats the data to be used for the meta information
function metaFormatHtml(attributes){
	// Going to use template literals
	// Simple string substitution

	let header = `<h3>${attributes["Name"]}</h3></br>`
	let date_added = ""
	if (attributes["Date_added"]){
		date_added = `<b>Date Last Updated:</b> <p>${attributes["Date_added"]}</p></br>`
	}
	let description = `<b>Description:</b> <p>${attributes["Description"]}</p></br>`

	let type = `<b>Type:</b> <p>${attributes["Type"]}</p></br></br>`

	return header + type + date_added + description
}
///////////////////////////////////////////////////////////////////

function addBtnFunc(layer){
	let unique_id;
	let type;

	let name = document.getElementById("input_name")
	// let type = document.getElementById("input_type")
	let date_added = document.getElementById("input_date")
	let description = document.getElementById("input_description")

	if (layer.attributes){
		unique_id = layer.attributes["uuid"]
		type = layer.attributes["Type"]
		// name.value = layer.attributes["Name"]
		// type.value = layer.attributes["Type"]
		// date_added.value = layer.attributes["Data_added"]
		// description.value = layer.attributes["Description"]
	}
	else{ // Probably never called because we create Unique ID when the Feature is Made
		unique_id = uuid4()
	}
	

    addAttributeData = {
        "Name": name.value,
        "Type": type,
        "uuid": unique_id, // Probably automatically crea
        "ObjectID": unique_id ,
        "Data_added": date_added.value,
        "Description": description.value,
    }

	let layerJson = layer.toGeoJSON()

	layer.attributes = addAttributeData // We add the corresponding metadata
	layerJson.attributes = addAttributeData // We add the information to the JSON

	updateExistingFeature("residence", unique_id, layerJson, type)

	// HERE We Create the POPUP
	let popup = metaFormatHtml(addAttributeData)
	
	// Add the popup to the layer
	layer.bindPopup(popup)

	// CLOSE THE FORM
	formOpen.style.display = "none";

	// Clear out the form information
	name.value = ""
	// type.value = ""
	date_added.value = ""
	description.value = ""

}

///////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////
// Feature Group.on click event
// https://stackoverflow.com/questions/30849283/how-to-get-id-of-layer-in-feature-group-on-click
// http://plnkr.co/edit/4fh7vhVet8N0iD4GE3aN?preview

let activeFeature; // The current Layer being hovered over
map.on("mouseover", function(){
	// drawControl.on('mouseover', function(tool){
	// 	console.log('here')
	// })
	drawnItems.eachLayer(function(layer){
		layer.on('mouseover', function(feature){
			
			metaInfoPopup() // The Form to add information
			// Here we add the add button functionality to take the layer info
			addInfoBtn.onclick = function(){
				addBtnFunc(layer)
			}

		})
	})
})


///////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////
// On Map Draw completed
// ADDING FEATURE TO THE MAP AND THE DATABASE

map.on('draw:created', function (feature) {
	let type = feature.layerType, layer = feature.layer;
	// Here we create the UUID and Object ID
	let unique_id = uuid4()


	let layerJson = layer.toGeoJSON() // Convert our Feature to GeoJSON
	// Note Properties is Native to Leaflet
	
	// We are going to add the attributes to keep consistency with ESRI
	let attributesInfo = {
		"uuid": unique_id,
		"ObjectID": unique_id,
		"Type": layerJson.geometry["type"].toLowerCase()
	}

	// We add the attributes to both the actual Layers and the Feature

	layer.attributes = attributesInfo
	layerJson.attributes = attributesInfo


	// ADDING Layer to the DB
	addNewFeature("residence", layerJson, layerJson.attributes["Type"])
	
	//ADDING Layer TO THE MAP
	drawnItems.addLayer(layer);
});
///////////////////////////////////////////////////////////////////////////////////////////////

map.on('click', function(){
	drawnItems.eachLayer(function(layer){
		layer.on('click', function(feature){
			activeFeature = layer
		})
	})
})


///////////////////////////////////////////////////////////////////////////////////////////////
// On Map Draw edit
// https://gis.stackexchange.com/questions/259250/how-to-detect-delete-or-edit-events-in-popup-menu-created-with-leaflet-draw
// THIS IS FOR UPDATING THE FEATURE INFORMATION




map.on('draw:edited', function() {
	let layer = activeFeature
	let layerJson = layer.toGeoJSON()
	console.log(layer)
	layerJson.attributes = layer.attributes
	let unique_id = layerJson.attributes["uuid"]
	let type = layerJson.attributes["Type"]

	// Updating DB, this update is for Layer Geometry
	updateExistingFeature("residence", unique_id, layerJson, type)
});
///////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
// On Map Draw deleted
map.on('draw:deleted', function(){
	let layer = activeFeature
	let layerJson = layer.toGeoJSON()
	console.log(layer)
	layerJson.attributes = layer.attributes
	let unique_id = layerJson.attributes["uuid"]
	let type = layerJson.attributes["Type"]

	// Delete Layer in  DB
	deleteFeatureObject("residence", type + "_ids", unique_id)
})
///////////////////////////////////////////////////////////////////////////////////////////////

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
// Creating and Adding the Leaflet Layer List
function loadOnlineFeatLayers(){
	let huntsvilleLayers = [
		  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Boundary/FeatureServer/0",
		  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Rivers_line_huntsville/FeatureServer/0",
		  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Transit_bus_stops/FeatureServer/0",
		  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Huntsville_Transit_bus_routes/FeatureServer/0",
		  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/lakes_and_rivers_polygons_huntsville/FeatureServer/0",
		  "https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Emergency_Management_Points_huntsville/FeatureServer/0"
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



// https://www.w3schools.com/js/js_timing.asp
// Timing JS
// https://www.w3schools.com/js/js_ajax_http_send.asp
// Probably use ajax for .env
// https://www.w3schools.com/js/tryit.asp?filename=tryjs_api_fetch
// Probably need webworks for the pop up
//https://www.w3schools.com/js/js_api_web_workers.asp
// Classes Javascript
// https://www.w3schools.com/jsref/jsref_classes.asp