import Map from './map/Comp.jsx'
import MapProps from './map/Props.jsx'
import HelloWorld from './hello-world/HelloWorld.jsx'

export let components = [
  { 
    type: "map",
    comp: Map,
    props: MapProps,
    defaultParams: require('./map/DefaultParams.js').default
  }
]
