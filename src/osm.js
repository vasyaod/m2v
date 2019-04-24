// @flow
import { List } from 'immutable'

const to4326 = (point) => {
  return [point.lng, point.lat];
}

const osmClosestPoint = async (point) => {
  var coord4326 = to4326(point)
  const response = await fetch('//router.project-osrm.org/nearest/v1/driving/' + coord4326.join())
  const json = await response.json()
  if (json.code === 'Ok')
    return json.waypoints[0].location
  else 
    throw new Error('Neares pint cannot be requered') 
}

export const router = async (point1, point2) => {
  const response = await fetch('//router.project-osrm.org/route/v1/driving/' + 
    (await osmClosestPoint(point1)).join() + ';' + 
    (await osmClosestPoint(point2)).join()
  )
  const json = await response.json()
  if(json.code !== 'Ok') {
    throw new Error('Route is not found') 
  }
  const geometry = json.routes[0].geometry
  // route is ol.geom.LineString
  var route = new ol.format.Polyline({
    factor: 1e5
  }).readGeometry(geometry, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'
  });
  const points = List(ol.format.Polyline.decodeDeltas(geometry, 2))
    .reduce(function(result, value, index, array) {
      if (index % 2 === 0)
        return result.push(array.slice(index, index + 2));
      else
        return result;
    }, List([]))
    .map ( x => {
      const y = x.toArray()
      return {
        lat: y[0],
        lng: y[1]
      }
    })
  return points
}
