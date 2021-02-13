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
