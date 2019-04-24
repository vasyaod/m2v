import { combineReducers } from 'redux'
import { List } from 'immutable'

const initialState = {
  gioEditor: {
    center: [8.538961,47.372476],
    zoom: 1
  },
  viewport: {
    width: 200,
    height: 200
  },
  viewportPosition: {
    center: [8.538961,47.372476],
    zoom: 1
  },
  frame: {
    width: 1920,
    height: 1080,
    viewportX: 0,
    viewportY: 0
  },
  mask: "circle",
  opacity: 90,
  points: List([]),
  paths: List([]),
  currentPoint: -1
}

Array.prototype.insert = function ( index, item ) {
  this.splice( index, 0, item );
};

export function todoApp(state = initialState, action) {
  switch (action.type) {

    case 'PROJECT_RESETED':
      return initialState
    
    case 'PROJECT_LOADED':
      return Object.assign({}, action.state, {
        points: List(action.state.points),
        paths: List(action.state.paths).map(y => {
          return Object.assign({}, y, {
            points: List(y.points)
          })
        })
      })

     case 'MAP_VIEWPORT_RESIZED':
     return Object.assign({}, state, {
        viewport: {
          width: action.width,
          height: action.height
        }
      })

    case 'FRAME_CHANDED':
      return Object.assign({}, state, {
        frame: action.value
      })
     
    case 'OPACITY_CHANGED':
      return Object.assign({}, state, {
        opacity: action.value
      })
    
    case 'MASK_CHANGED':
      return Object.assign({}, state, {
        mask: action.value
      })

    case 'GEO_EDITOR_UPDATED':
      return Object.assign({}, state, {
        gioEditor: action.value
      })

    case 'VIEWPORT_POSITION_UPDATED':
      return Object.assign({}, state, {
        viewportPosition: action.value
      })

    case 'POINTS_CHANGED':
      return Object.assign({}, state, {
        points: action.points,
        paths: action.paths
      })

    default:
      return state
  }
}