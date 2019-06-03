//import utils from './utils.js'
import { List } from 'immutable'
import * as utils from '../utils.js'
import * as equal from 'deep-equal'

export function loadGpx(data) {
  return (dispatch, getState) => {
 
    const points = List(data.tracks).flatMap (track => {
      return List(track.segments).flatMap (segment => {
        return List(segment).map ( point =>{
          return {
            lng: point.lon,
            lat: point.lat,
            tm: Date.parse(point.time),
            pathType: "line"
          }
        })
      })
    })

    const state = getState()
    utils
      .addPoints(state.points, state.paths, points)
      .then(res => {
        dispatch({
          type: 'POINTS_CHANGED',
          points: res.points,
          paths: res.paths
        })
      })
  }
}
