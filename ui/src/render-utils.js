import { List } from 'immutable'
import * as utils from '../src/utils.js'

export function renderPolyline(map, polyline) {

  const data = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        'geometry': {
          'type': 'LineString',
          'coordinates': polyline.points.map(p => {
            return [p.lng, p.lat]
          }).toArray()
        }
      }
    ]
  }

  if (map.getSource(polyline.id) == null){
    map.addSource(polyline.id, {
      type: 'geojson',
      data: data
    });
  }

  if (map.getLayer(polyline.id) == null){
    map.addLayer({
      "id": polyline.id + "-2",
      "type": "line",
      "source": polyline.id,
      "layout": {
        "line-cap": "round"
      },
      "paint": {
        "line-color": polyline.color1,
        "line-opacity": 0.8,
        "line-width": 7
        }
    });
    
    map.addLayer({
      "id": polyline.id,
      "type": "line",
      "source": polyline.id,
      "layout": {
        "line-cap": "round"
      },
      "paint": {
        "line-color": polyline.color2,
        "line-opacity": 0.9,
        "line-width": 5
        }
    });
  }

  map.getSource(polyline.id).setData(data)
}

export function renderComposedPaths(map, time, points, paths) {
  const res = utils.splitPathes(time, points, paths, utils.dist1)
  renderPolyline(map, {
    points: res.right, 
    id: "pathRight",
    color1: "#3379c3",
    color2: "#00b3fd"
  })

  renderPolyline(map, {
    points: res.left, 
    id: "pathLeft",
    color1: "#fd0000",
    color2: "#c33333"
  })
}
