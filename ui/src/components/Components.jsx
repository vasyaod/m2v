import React, { Component } from 'react';
import { Segment, Header, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Map from './map/Comp.jsx'
import MapProps from './map/Props.jsx'
import HelloWorld from './HelloWorld.jsx'
import { Rnd } from "react-rnd"
import { addComponent, updateComponent } from '../actions.js';
import * as UUID from 'uuid-js';

const style = {
  display: "flex",
  border: "solid 1px #ddd"
};

const components = [
  { 
    id: "map",
    comp: Map,
    props: MapProps,
    defaultParams: require('./map/DefaultParams.js')
  }
]

class Components extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      scale: 1.0,
      currentTimePossition: 0,
      isRendering: false,
      compParams: null
    }

  }

  componentResize(comp, widthStr, heightStr) {
    this.props.dispatch(updateComponent(comp, {
      width: parseInt(widthStr.replace(/px/, '')), 
      height: parseInt(heightStr.replace(/px/, ''))
    }))
  }
  render() {
    return (
      <div>
        <div className="ui three column grid">
          <div className="ten wide column">
            <Segment basic>
              <Header as='h3'>Render1</Header>
              <div style={{
                  position: "relative",
                  width: "100%",
                  height: 500,
                  float: "left",
                  overflow: "hidden",
                  background: "url('./images/bg.png')"
                }}
              >
                {this.props.components.map(comp => {
                  const compTemplate = components.find(x => comp.type == x.id)
                  const Comp = compTemplate.comp
                  return (
                    <Rnd 
                      style={style} 
                      key={comp.id}
                      position={{ 
                        x: comp.params.x == null ? 0: comp.params.x, 
                        y: comp.params.y == null ? 0: comp.params.y 
                      }}
                      onDragStop={(e, d) => this.props.dispatch(updateComponent(comp, {x: d.x, y: d.y})) }
                      onResize={(e, direction, ref, delta, position) => {
                        this.componentResize(comp, ref.style.width, ref.style.height)
                      }}
                      onDoubleClick={e => this.setState({compParams: comp})}
                    >
                       <Comp comp={comp}/>}
                    </Rnd>
                  )
                })}
              </div>
              <div>
                { 
                  components.map(c => {
                    return (
                      <Button key={c.id} onClick={() => this.props.dispatch(addComponent(c.id, UUID.create().toString(), {}))}>Add {c.id}</Button>
                    );
                  })
                }
              </div>
            </Segment> 
            { this.state.compParams &&
              <div>
                { this.state.compParams.type == "map" && 
                  <MapProps 
                    comp={this.state.compParams} 
                    onChanged={params => this.props.dispatch(updateComponent(comp, params))}
                    onClose={e => this.setState({compParams: null})}
                  />
                }
                { this.state.compParams.type == "hello-world" && 
                  <MapProps 
                    comp={this.state.compParams} onChanged={params => this.props.dispatch(updateComponent(comp, params))}/>
                }
              </div>
            }
          </div>
          <div className="four wide column">

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    components: state.components
  };
};

export default connect(mapStateToProps)(Components)
