var map = L.map('map').setView([45.32424,-79.210724], 12);
        mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);
        
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

        // This portion actually adds the information (layer) to the map

		map.on('draw:created', function (feature) {
			var type = feature.layerType, layer = feature.layer;

			if (type === 'marker') {
                // We can manipulate the information based on html tags
                // We need to think of the meta data aspect ???
				layer.bindPopup('<h1>Head Information</h1> + <p>Wah gwaan</p?');
			}
            
			alert("<input type='text'>")
            console.log(layer)
			drawnItems.addLayer(layer);
		});


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