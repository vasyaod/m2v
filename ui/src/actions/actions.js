//import utils from './utils.js'
import { List } from 'immutable'
import * as utils from '../utils.js'
import * as equal from 'deep-equal'

export function resetProject() {
  return dispatch => {
    dispatch({
      type: 'PROJECT_RESETED'
    })
  }
}

export function loadProject(jsonStr) {
  return dispatch => {
    dispatch({
      type: 'PROJECT_LOADED',
      state: JSON.parse(jsonStr)
    })
  }
}

export function loadProjectFromUrl(url) {
  return dispatch => {
    fetch(url)
      .then(res => res.json())
      .then(json => {
        dispatch({
          type: 'PROJECT_LOADED',
          state: json
        })
      })
  }
}

export function addComponent(type, id, params) {
  return dispatch => {
    dispatch({
      type: 'COMPONENT_ADDED',
      component: {
        type: type,
        id: id,
        params: params
      }
    })
  }
}

export function updateComponent(comp, params) {
  return dispatch => {
    const newParams = Object.assign({}, comp.params, params)
    if (!equal(comp.params, newParams)) {
      dispatch({
        type: 'COMPONENT_UPDATED',
        id: comp.id,
        params: newParams
      })
    }
  }
}

export function removeComponent(id) {
  return dispatch => {
    dispatch({
      type: 'COMPONENT_REMOVED',
      id: id
    })
  }
}

export function resizeViewport(width, height) {
  return dispatch => {
    dispatch({
      type: 'MAP_VIEWPORT_RESIZED',
      width: width, 
      height: height
    })
  }
}

export function updateFrameWidth(width) {
  return (dispatch, getState) => {
    const state = getState()
    dispatch({
      type: 'FRAME_CHANDED',
      value: {
        width: width,
        height: state.frame.height,
        viewportX: state.frame.viewportX,
        viewportY: state.frame.viewportY
      }
    })
  }
}

export function updateFrameHeight(height) {
  return (dispatch, getState) => {
    const state = getState()
    dispatch({
      type: 'FRAME_CHANDED',
      value: {
        width: state.frame.width,
        height: height,
        viewportX: state.frame.viewportX,
        viewportY: state.frame.viewportY
      }
    })
  }
}

export function updateViewportPossition(viewportX, viewportY) {
  return (dispatch, getState) => {
    const state = getState()
    dispatch({
      type: 'FRAME_CHANDED',
      value: {
        width: state.frame.width,
        height: state.frame.height,
        viewportX: viewportX,
        viewportY: viewportY
      }
    })
  }
}

export function changeOpacity(value) {
  return dispatch => {
    dispatch({
      type: 'OPACITY_CHANGED',
      value: value
    })
  }
}

export function changeMask(value) {
  return dispatch => {
    dispatch({
      type: 'MASK_CHANGED',
      value: value
    })
  }
}

export function updateGeoEditorCenter(centerLat, centerLng) {
  return dispatch => {
    dispatch({
      type: 'GEO_EDITOR_CENTER_UPDATED',
      value: [centerLng, centerLat]
    })
  }
}

export function updateGeoEditorZoom(zoom) {
  return dispatch => {
    dispatch({
      type: 'GEO_EDITOR_ZOOM_UPDATED',
      value: zoom
    })
  }
}

export function updatePossitionOfViewport(centerLat, centerLng, zoom) {
  return dispatch => {
    dispatch({
      type: 'VIEWPORT_POSITION_UPDATED',
      value: {
        center: [centerLng, centerLat],
        zoom: zoom
      }
    })
  }
}

export function addPoint(point) {
  return (dispatch, getState) => {
    const state = getState()

    utils
      .addPoint(state.points, state.paths, point)
      .then( res => {
        dispatch({
          type: 'POINTS_CHANGED',
          points: res.points,
          paths: res.paths
        })
      })
  }
}

export function removePoint(id) {
  return (dispatch, getState) => {
    const state = getState()
    utils
      .removePoint(state.points, state.paths, id)
      .then( res => {
        dispatch({
          type: 'POINTS_CHANGED',
          points: res.points,
          paths: res.paths
        })
      })
  }
}

export function replacePoint(id, newPoint) {
  return (dispatch, getState) => {
    const state = getState()
    utils
      .removePoint(state.points, state.paths, id)
      .then(res => utils.addPoint(res.points, res.paths, newPoint))
      .then(res => {
        dispatch({
          type: 'POINTS_CHANGED',
          points: res.points,
          paths: res.paths
        })
      })
  }
}

export function setCurretPossition(id) {
  return dispatch => {
    dispatch({
      type: 'POSSITION_SET',
      id: id
    })
  }
}
