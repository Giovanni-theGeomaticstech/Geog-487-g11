import { uuid4 } from "../../../js/uuid4.js"
import { deleteFeatureObject, updateExistingFeature,  addNewFeature, listFeatures, listFeatureIDs, } from "../../../js/connection.js" // importing our database tools
import { calcNearestPoint, pointsWithinPolygon } from "../../../js/spatial_analysis.js" // importing our spatial analysis functions
import { point_stylings } from "../../../js/basis.js" // Importing our fields schema
import { configureKey } from "../../../js/apikeys.js" // importing our spatial analysis functions


///////////////////////////////////////////////////////////////////////////////////////////////
let apiData = configureKey()

apiData.then(function(apiKey){
// Adding in Map to application

	var map = L.map('map', {
		editable: true,
		doubleClickZoom: false
	}).setView([45.32424, -79.210724], 15);

	//   let layer = L.esri.basemapLayer('Topographic').addTo(map);
	// https://developers.arcgis.com/esri-leaflet/maps/change-the-basemap-layer/
	let layer = L.esri.Vector.vectorBasemapLayer("ArcGIS:Imagery",{
		apiKey: apiKey // Adding the API Key to the map
	}).addTo(map);
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
	// Old Way of Search Bar
	// var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider();


	const searchControl = L.esri.Geocoding.geosearch({
		position: "topright",
		placeholder: "Enter an address or place e.g. 1 York St",
		useMapBounds: false,
		providers: [L.esri.Geocoding.arcgisOnlineProvider({
		apikey: apiKey,
		nearby: {
			lat: -33.8688,
			lng: 151.2093
		},
		})]
	}).addTo(map);

	const results = L.layerGroup().addTo(map);

	searchControl.on("results", (data) => {
		results.clearLayers();
		for (let i = data.results.length - 1; i >= 0; i--) {
		const lngLatString = `${Math.round(data.results[i].latlng.lng * 100000)/100000}, ${Math.round(data.results[i].latlng.lat * 100000)/100000}`;
		const marker = L.marker(data.results[i].latlng);
		marker.bindPopup(`<b>${lngLatString}</b><p>${data.results[i].properties.LongLabel}</p>`)
		results.addLayer(marker);
		marker.openPopup();
		}
	});


	///////////////////////////////////////////////////////////////////////////
	// Making the Point Marker symbol

	var LeafIcon = L.Icon.extend({
		options: {
			iconSize:     [25, 50],
			iconAnchor:   [22, 94],
			popupAnchor:  [-3, -76]
		}
	});

	// Use this to change the marker symbol
	var greenIcon = new LeafIcon({
		iconUrl: '/images/location-tag-fixed.png'
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

	function addBtnFunc(layer, existingInDB=null){
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

		
		
		let layerJson = layer.toGeoJSON()

		if (existingInDB){
			type = layerJson.geometry["type"].toLowerCase()
			unique_id = layerJson.attributes.uuid
			addAttributeData = {
				"Name": name.value,
				"Type": type,
				"uuid": layerJson.attributes.uuid, // Probably automatically crea
				"ObjectID": layerJson.attributes.ObjectID ,
				"Data_added": date_added.value,
				"Description": description.value,
			}
			
		}else{
			addAttributeData = {
				"Name": name.value,
				"Type": type,
				"uuid": unique_id, // Probably automatically crea
				"ObjectID": unique_id ,
				"Data_added": date_added.value,
				"Description": description.value,
			}

		}
		

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
		// })
		drawnItems.eachLayer(function(layer){
			layer.on('click', function(feature){			
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
		let mod_type = layerJson.geometry["type"].toLowerCase();
		if (layerJson.geometry["type"].toLowerCase() == "linestring"){
			mod_type = "line"
		}
		let attributesInfo = {
			"uuid": unique_id,
			"ObjectID": unique_id,
			"Type": mod_type//layerJson.geometry["type"].toLowerCase()
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
		layerJson.attributes = layer.attributes
		let unique_id = layerJson.attributes["uuid"]
		let type = layerJson.attributes["Type"]

		// Delete Layer in  DB
		deleteFeatureObject("residence", type + "_ids", unique_id)
	})
	///////////////////////////////////////////////////////////////////////////////////////////////



	// Esri leaflet feature
	// http://esri.github.io/esri-leaflet/api-reference/layers/feature-layer.html

	// For metadata for our service layer
	//https://esri.github.io/esri-leaflet/examples/getting-service-metadata.html


	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Creating and Adding the Leaflet Layer List
	let featureLayers = {}
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
		// let featureLayers = {} // Our Layers
		let myStyle; 
		// https://esri.github.io/esri-leaflet/examples/styling-feature-layer-points.html
		for (let i = 0; i < huntsvilleLayers.length; i++){
			let newfeatureLayer
			
			// Binding the Popup template to the feature
			if (nameLayers[i] == "Bus Stops"){
				var icon = L.icon({
					iconUrl: 'js/images/bus_stops.png',
					iconSize: [30, 50],
					iconAnchor: [13.5, 17.5],
					popupAnchor: [0, -11]
				});

				newfeatureLayer = L.esri.featureLayer({
					url: huntsvilleLayers[i],
					pointToLayer: function (geojson, latlng) {
						return L.marker(latlng, {
						icon: icon
						});
					}
					// fields: // We get an array of fields
				});

				newfeatureLayer.bindPopup(function (layer){
						
					let layer_name = `<h3>${nameLayers[i]}</h3>`
					let properties = layer.feature.properties
					let body = `<p> <strong>Stop Name:</strong> ${properties["Stop_Name"]}</p> 
					<p><strong>Stop Number:</strong> ${properties["Stop_Num"]}</p>
					`
					return layer_name + body
				})
			}
			else if(nameLayers[i] == "Huntsville Boundary"){
				myStyle = {
					"color": [74, 69, 0, 0.5],
					"weight": 5,
					"opacity": 0.65
				}
				newfeatureLayer = L.esri.featureLayer({
					url: huntsvilleLayers[i],
					style: myStyle
					// fields: // We get an array of fields
				});
			}
			else if(nameLayers[i] == "Bus Routes"){
				myStyle = {
					"color": "#A10A8A",
					"weight": 5,
					"opacity": 0.65
				};
				newfeatureLayer = L.esri.featureLayer({
					url: huntsvilleLayers[i],
					style: myStyle
					// fields: // We get an array of fields
				});
			}
			else if(nameLayers[i] == "Historical Emergency Management Events"){
				var icon = L.icon({
					iconUrl: 'js/images/flag.png',
					iconSize: [40, 50],
					iconAnchor: [13.5, 17.5],
					popupAnchor: [0, -11]
				});

				newfeatureLayer = L.esri.featureLayer({
					url: huntsvilleLayers[i],
					pointToLayer: function (geojson, latlng) {
						return L.marker(latlng, {
						icon: icon
						});
					}
					// fields: // We get an array of fields
				});
				// DIDNT WORK
				// newfeatureLayer.bindPopup(function(layer){
				// 	let layer_name = `<h3>${nameLayers[i]}</h3>`
				// 	let properties = layer.feature.properties
				// 	let body = `<p> <strong>Event Type:</strong> ${properties["EVENT_TYPE"]}</p> 
				// 	<p><strong>District Number:</strong> ${properties["DISTRICT_N"]}</p>
				// 	<p><strong>Event year:</strong> ${properties["EVENT_YEAR"]}</p>
				// 	<p><strong>Event count:</strong> ${properties["EVENT_NUMB"]}</p>
				// 	<p><strong>Evacuated ?:</strong> ${properties["EVACUATION"]}</p>
				// 	<p><strong>Description:</strong> ${properties["EVENT_DESC"]}</p>
				// 	`
				// return layer_name + body
				// // return L.Util.template('<h2>Bus Stops</h2><p>Stop Number <strong>{Stop_Num}<strong>. Stop Name {Stop_Name}.</p>', layer.feature.properties);
				// });
			}
			else{
				newfeatureLayer = L.esri.featureLayer({
					url: huntsvilleLayers[i],
					// fields: // We get an array of fields
				});
			}
			
			featureLayers[nameLayers[i]] = newfeatureLayer

			
		}    
		// Creates layer list and adds feature layers to map
		// Create layer list 
		var imagery = L.esri.Vector.vectorBasemapLayer("ArcGIS:Imagery",{
			apiKey: apiKey // Adding the API Key to the map
		})
		var topo = L.esri.Vector.vectorBasemapLayer("ArcGIS:Topographic",{
			apiKey: apiKey // Adding the API Key to the map
		})
		var navigation = L.esri.Vector.vectorBasemapLayer("ArcGIS:Navigation",{
			apiKey: apiKey // Adding the API Key to the map
		})

		var baseMaps = { // Now using thr vectorBasemapLayers
			"ArcGIS:Imagery": imagery,
			"ArcGIS:Navigation": navigation,
			"ArcGIS:Topographic": topo
		};

		//https://www.wrld3d.com/wrld.js/latest/docs/leaflet/L.Control.Layers/
		
		let controlPanel = L.control.layers(baseMaps, featureLayers, )
		controlPanel.setPosition("bottomright")
		controlPanel.addTo(map)
	}
	loadOnlineFeatLayers()





	///////////////////////////////////////////////////////////////////////////////

	//////////////////////////////////////////////////////////////////////////////
	/* Preloaded features from Database */ 
	// Note listFeatures is a JavaScript promise object of all the Features in the database
	// Thus we have to call a user type on it and the type of feature we want


	// Adding features to the client side feature layers


	function loadDBFeatures(){
		let listOfDBfeatures;
		let featureTypes = ["point", "line", "polygon"]

		for (let i = 0; i < featureTypes.length; i++){
				listOfDBfeatures = listFeatures("residence", featureTypes[i])
				listOfDBfeatures.then(function(featureListJson){

					// Note we can also just pass in the array but we will have to do fixes
					for (let k = 0; k < featureListJson.length; k++){
						let layerJson = featureListJson[k]
						// Feature For ArcGIS Api to The GeoJSON in Leaflet
						// layerJson["type"] = "Feature"

						// if (layerJson.attributes["Type"] == "line"){
						// 	layerJson.geometry["type"] = "LineString"
						// }
						if (layerJson["type"] == "Feature"){ // temporary for now
							let popUp = metaFormatHtml(layerJson.attributes)
							let feature;
							let myStyle
							if (layerJson.attributes.Type == "line"){
								myStyle = {
									"color": "#D11349",
									"weight": 5,
									"opacity": 0.65
								};
								feature = L.geoJSON(layerJson, {
									style: myStyle
								})
							}
							else if (layerJson.attributes.Type == "polygon"){
								myStyle = {
									"color": "#FF7929",
									"weight": 5,
									"opacity": 0.65
								};
								feature = L.geoJSON(layerJson, {
									style: myStyle
								})
							}
							else{
								let Icon = L.icon({
									iconUrl: point_stylings.locator.url,		
									iconSize:     [95, 95], // size of the icon
									iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
									popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
								});
								
								// feature = L.geoJSON(layerJson,{icon: animatedIcon})
								feature = L.geoJSON(layerJson, 
									{pointToLayer: function(feature, latlng) {
									return L.marker(latlng, {
									icon: greenIcon
									});
								}})
							
							}
							// Activate the POPUP FORM FOR VGI FEATURES
							feature.on("click", function(feature)  {
								metaInfoPopup() // The Form to add information
								// Here we add the add button functionality to take the layer info
								addInfoBtn.onclick = function(){
									addBtnFunc(feature.layer, "existing")
								}	
							})
							feature.addTo(map)
							feature.bindPopup(popUp)
						}
						
							// addClientFeatureLayer(featureTypes[i], featureListJson[k])
					}
					// L.geoJSON(featureListJson).addTo(map); // Adding all the features to the map
					
				})
		}     
	}
	loadDBFeatures()

	///////////////////////////////////////////////////////////////////////////////

	/********************
		 * Load in layers from user input
		 ********************/

		let search_btn = document.getElementById("search_btn_url")
		search_btn.onclick = function(){
				
				let url = document.getElementById("url_info").value + "/0"
				// Need to check for mapservice stuff
				// Sample Url
				//https://services1.arcgis.com/DwLTn0u9VBSZvUPe/arcgis/rest/services/Emergency_Management_Historical_Events/FeatureServer
				if (url && url.includes("https://services1.arcgis.com/") && url.includes("FeatureServer")){
					var newfeatureLayer = L.esri.featureLayer({
						url: url
					});
					newfeatureLayer.addTo(map)
					alert("Layer was successfully added")
				}  else{
					alert("Layer with url:" + url + " does not exists!")
				}
		}


	// Routing Feature
	// Layer Group for start/end-points
	const startLayerGroup = L.layerGroup().addTo(map);
	const endLayerGroup = L.layerGroup().addTo(map);
	// Layer Group for route lines
	const routeLines = L.layerGroup().addTo(map);

	////////////////////////////////////////////////////////////////////////////
	// Generates the Route
	function updateRoute(startCoords, endCoords, directionsWidget) {
		//https://developers.arcgis.com/esri-leaflet/route-and-directions/find-a-route-and-directions/
		// Create the arcgis-rest-js authentication object to use later.
		const authentication = new arcgisRest.ApiKey({
		key: apiKey
		});

		// make the API request
		
		arcgisRest
		.solveRoute({
			stops: [startCoords, endCoords],
			barriers: {
				geometryType:"esriGeometryPoint",
				spatialReference: {wkid: 4326, latestWkid: 4326},
				//https://turfjs.org/docs/#feature
				features: [L.point(45.31694670076911, -79.2179239581651)], // Try making this a feature
			},
			endpoint: "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve",
			authentication
		})
		.then((response) => {
			// Show the result route on the map.
			routeLines.clearLayers();
			var myStyle = {
				"color": "#FCB61E",
				"weight": 5,
				"opacity": 0.65
			};
			L.geoJSON(response.routes.geoJson, {
				style: myStyle
			}).addTo(routeLines);
			map.setView([startCoords[1], startCoords[0]], 16) // We want to move the map to start location


			// Show the result text directions on the map.
			directionsWidget.innerHTML = "<h4>Route Directions</h4>";

			const directionsHTML = response.directions[0].features.map((f) => `<p>${f.attributes.text}</p>`).join("<br/>");
			directionsWidget.innerHTML += directionsHTML;
			directionsWidget.style.backgroundColor = "white"
			let container = document.getElementById("RouteLocator")
			container.append(directionsWidget)

			startCoords = null;
			endCoords = null;
		})
		.catch((error) => {
			alert("There was a problem using the route service. See the console for details.");
		});
	}
	////////////////////////////////////////////////////////////////////////////


	////////////////////////////////////////////////////////////////////////////
	// Here we go can use it to load in GeoJSON files
	// Reimplement function
	function getGeoJsonFromFile(file=null){
		file = "../../../data/Huntsville_Transit.geojson"

		let featureCollection = fetch (file).then(x => x.text()).then(function(data){
			data = JSON.parse(data) // parse the data to make it JavaScript object
			return data
		 })
		return featureCollection
	}

	//Animated Icon
	var animatedIcon = L.icon({
		iconUrl: point_stylings.locator.url,		
		iconSize:     [95, 95], // size of the icon
		iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
		popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
	});
	
	function showPosition(position) {
		// ROUTING DIRECTIONS RELATED
		// Add a DOM Node to display the text routing directions
		// const directionsWidget = document.createElement("div");
		// directionsWidget.id = "directions";
		let directionsWidget = document.getElementById("directions")
		directionsWidget.innerHTML = "Starting Route Directions";
		document.body.appendChild(directionsWidget);


		// let currentStep = "end"; // Make it start at end for now
		let startCoords, endCoords;
		
		let curr_position = [position.coords.longitude, position.coords.latitude]
		startCoords = curr_position // Use this for GPS coordinates
		// startCoords = [-79.21996483220589, 45.31764832102381] // Here I use test coordinates

		let featureCollects = getGeoJsonFromFile() // Note this is a promise object
		featureCollects.then(function(featureCollection){
			let endPoint = calcNearestPoint(startCoords, featureCollection)
			endCoords = turf.getCoords(endPoint)
			

			// Rest of code here
			let startPointMarker, endPointMarker
			if (startCoords){ // clean everything out
				startLayerGroup.clearLayers();
				endLayerGroup.clearLayers();
				routeLines.clearLayers();
				startPointMarker = L.marker([startCoords[1], startCoords[0]], {icon: animatedIcon}).addTo(startLayerGroup); // Adding the start coords to the map
			
			}
			if (endCoords){
				endPointMarker = L.marker([endCoords[1], endCoords[0]], {icon: animatedIcon}).addTo(endLayerGroup); // Adding the end coords to map
			}
			if (startCoords && endCoords) {
				startPointMarker.bindPopup("The Start Point")
				let endPointprops =  endPoint.properties
				endPointMarker.bindPopup(`<h3>${endPointprops["Stop_Name"]}<h3></br><p>Stop Num: ${endPointprops["Stop_Num"]}</p>`)

				updateRoute(startCoords, endCoords, directionsWidget);
			}
		})
		
		// console.log("Latitude: " + position.coords.latitude +
		// "<br>Longitude: " + position.coords.longitude)
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
	////////////////////////////////////////////////////////////////////////////////


	////////////////////////////////////////////////////////////////////////////////
	// Service Area - For Governments
	// https://developers.arcgis.com/esri-leaflet/route-and-directions/find-service-areas/


	// Layer for Service Area
	const serviceLayerGroup = L.layerGroup().addTo(map)

	// Layer for points of service areas 
	let serviceStartPoints = L.layerGroup().addTo(map);


	///////////////////////////////////////////////////////////////////////////////////////
	// Gathers Data from points in the Service area generated through VGI
	function serviceAreaData(serviceFeatureCollection){
		var serviceAreaInfoDump = document.getElementById("servicedump")
		serviceAreaInfoDump.innerHTML = ""

		// Here We are going to add in points from the VGI
		let vgiFeaturesPromise = listFeatures("residence", "point") // We just need the point data
		vgiFeaturesPromise.then(function(featuresList){
			let data = pointsWithinPolygon(featuresList, serviceFeatureCollection) // A dictionary

			for (let serviceName in data){
				let serviceHeader = `<h4>${serviceName}</h4></br>`
				serviceAreaInfoDump.style.backgroundColor = "white"
				serviceAreaInfoDump.style.padding = "15px 15px 15px 30px";

				serviceAreaInfoDump.innerHTML += serviceHeader 
				for (let i = 0; i < data[serviceName].length; ++i){
					serviceAreaInfoDump.innerHTML += data[serviceName][i] + "</br>"// That feature content
				}
			}
		})
	}
	///////////////////////////////////////////////////////////////////////////////////////

	function serviceArea(){
		const authentication = new arcgisRest.ApiKey({
			key: apiKey
		});
	
		// When the map is clicked, call the service area REST service with the
		// clicked point and display the results.
		map.on("dblclick", (curr_location) => {

			// Clear the previous results
			serviceStartPoints.clearLayers();
			serviceLayerGroup.clearLayers();
	
			// Add the source point
			
			L.marker(curr_location.latlng, {icon: animatedIcon}).addTo(serviceStartPoints);
			
			// Make the API request
			arcgisRest
			.serviceArea({
				endpoint: "https://route-api.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea",
				authentication,
				facilities: [[curr_location.latlng.lng, curr_location.latlng.lat]]
			})
			.then((response) => { // Shorthand JS for function calls
				// Show the result route on the map.
				let layers = L.geoJSON(response.saPolygons.geoJson, {
				style: (feature) => { // Short Hand JS for Function calls
					const style = {
					fillOpacity: 0.5,
					weight: 1
					}

					if(feature.properties.FromBreak === 0) {
						// feature.bindPopup("5 minutes service area")
					style.color = '#AD1B10';
					feature.properties.popupTemplate = "<h1>Hello</h1>"
					} else if(feature.properties.FromBreak === 5) {
						// feature.bindPopup("10 minutes service area")
					style.color = "#DE463E";
					} else {
						// feature.bindPopup("15 minutes service area")
					style.color = "#E38984";
					}
					return style;
				},
				// https://stackoverflow.com/questions/14506989/leaflet-popup-with-additional-information-from-geojson

				onEachFeature: function (feature, layer) {
					layer.bindPopup(`<h3>Service Area-${feature.properties.Name} + minutes</h3>`);
				}
				}).addTo(serviceLayerGroup);
				let serviceAreaFeatureCollection = response.saPolygons.geoJson
				serviceAreaData(serviceAreaFeatureCollection)

			})
			.catch((error) => {
				console.error(error);
				alert("There was a problem using the route service. See the console for details.");
			});
		});
	}
	serviceArea()

	let clearServiceAreaBtn = document.getElementById("clearService")
	clearServiceAreaBtn.onclick = function(){
		serviceStartPoints.clearLayers();
		serviceLayerGroup.clearLayers();
	}
}) // CLOSE OUT API KEY