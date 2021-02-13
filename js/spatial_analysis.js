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
    let geometry = {
        "type": "Point",
        "coordinates": points
    }
    points = turf.feature(geometry)
    let servicePoints = {}
    let servicePointsInfo = {}
    turf.featureEach(polygonFeatureCollection, function (currentFeature, featureIndex){
        servicePoints[currentFeature.properties.Name] = turf.pointsWithinPolygon(points, currentFeature)
    })
    // Here we get the attribute information
    for (let name in servicePoints){
        servicePointsInfo[name] = function(){
            let information = []
            turf.featureEach(servicePoints[name], function(currentFeature, featureIndex){
                let featureName = `<h4>${currentFeature.attributes.Name}</h4>`
                let featureDescription = `<b>Description:</b><p>${currentFeature.attributes.Description}</p>`
                let featureDescription = `<b>Date added:</b><p>${currentFeature.attributes.Date_added}</p>`
                information.push(currentFeature.attributes.Name + "")
            })
        }
    }
    return servicePoints
    // return turf.pointsWithinPolygon(points, polygonFeatureCollection);
}
