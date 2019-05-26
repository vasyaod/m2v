import Map from './map/Comp.jsx'
import MapProps from './map/Props.jsx'
import Label from './label/Comp.jsx'

export let components = [
  { 
    type: "map",
    comp: Map,
    props: MapProps,
    defaultParams: require('./map/DefaultParams.js').default
  },
  {
    type: "label",
    comp: require('./label/Comp.jsx').default,
    props: require('./label/Props.jsx').default,
    defaultParams: require('./label/DefaultParams.js').default
  }
]
