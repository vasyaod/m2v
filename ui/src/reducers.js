import { combineReducers } from 'redux'
import { List } from 'immutable'

const initialState = {
  components: List([]),
  geoEditorCenter: [8.538961, 47.372476],
  geoEditorZoom: 1,
  frame: {
    width: 1920,
    height: 1080,
  },
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

    case 'COMPONENT_ADDED':
      return Object.assign({}, state, {
        components: state.components.push(action.component)
      })
    
    case 'COMPONENT_UPDATED':
      return {
        ...state,
        components: state.components.map(comp => {
          if(comp.id == action.id) {
            return {
              ...comp,
              params: action.params
            }
          } else {
            return comp
          }
        })
      }

    case 'FRAME_CHANDED':
      return Object.assign({}, state, {
        frame: action.value
      })
     
    case 'GEO_EDITOR_CENTER_UPDATED':
      return Object.assign({}, state, {
        geoEditorCenter: action.value
      })

    case 'GEO_EDITOR_ZOOM_UPDATED':
      return Object.assign({}, state, {
        geoEditorZoom: action.value
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
