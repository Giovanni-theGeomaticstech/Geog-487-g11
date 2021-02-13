// This file will be used for spatial analysis in both Leaflet and Esr Applications


////////////////////////////////////////////////////////////////
//NEAREST POINT
//https://turfjs.org/docs/#nearestPoint
// The function calcNearestPoint consumes a point (refPoint) and a featureCollection of points (pointfeatureCollection)
// and returns the nearest point in the featureCollection to the ref point
// 
export function calcNearestPoint(refPoint, pointfeatureCollection){
    return turf.nearestPoint(refPoint, pointfeatureCollection)
}
////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////
//ClusterKmeans
// Takes a set of points and partition them into clusters using the k-mean. It uses the k-means algorithm as outliers points that lie alone in low-density regions (whose nearest neighbors are too far away)
// https://turfjs.org/docs/#clustersKmeans
export function calcClustersKmeans(pointfeatureCollection){
    var options = {
        numberOfClusters:5
    }
    return turf.clustersKmeans(pointfeatureCollection, options)
}
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// getCluster
// https://turfjs.org/docs/#getCluster
export function getClusters(cluster_num, clusteredData){
    return turf.getCluster(clusteredData)
}

////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////
// Points Within Polygon
// https://turfjs.org/docs/#pointsWithinPolygon

export function pointsWithinPolygon(points, polygonFeatureCollection){
    // Trial for now
    for(let i = 0; i < points.length; i++){
        let point_geom
        if (points[i].type = "Feature"){ // For Leaflet Data (Needs a fix for types with Features)
            if (points[i].geometry["x"]){
                //long, lat
                point_geom = [points[i].geometry["x"], points[i].geometry["y"]]
            }
            else{
                point_geom = [points[i].geometry.coordinates[0], points[i].geometry.coordinates[1]]
            }
        }
        else{ // For Esri Data
            point_geom = [points[i].geometry["x"], points[i].geometry["y"]]
        }

        points[i] = turf.point(point_geom, points[i].attributes)
        if (points[i].geometry.coordinates[0] > 180){
            points[i] = turf.toWgs84(points[i])
        }
    }
    points = turf.featureCollection(points)

    // let geometry = {
    //     "type": "Point",
    //     "coordinates": points
    // }
    // points = turf.feature(geometry)
    let servicePoints = {}
    let servicePointsInfo = {}
    turf.featureEach(polygonFeatureCollection, function (currentFeature, featureIndex){
        servicePoints[currentFeature.properties.Name] = turf.pointsWithinPolygon(points, currentFeature)
    })
    // Here we get the attribute information
    console.log(servicePoints)

    for (let name in servicePoints){
        let information = []
        turf.featureEach(servicePoints[name], function(currentFeature, featureIndex){
            console.log(currentFeature)
            let featureName = `<b>Name:</b><p>${currentFeature.properties.Name}</p>`
            let featureId = `<b>ID:</b><p>${currentFeature.properties.uuid}</p>`
            let featureDescription = `<b>Description:</b><p>${currentFeature.properties.Description}</p>`
            let featureDate = `<b>Date added:</b><p>${currentFeature.properties.Date_added}</p>`
            information.push(featureName + featureId + featureDescription + featureDate)
        })
        servicePointsInfo[name] = information
    }
    return servicePointsInfo // this is the data
}
