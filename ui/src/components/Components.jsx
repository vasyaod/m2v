import React, { Component } from 'react';
import { Segment, Header, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Map from './map/Map.jsx'
import MapProps from './map/MapProps.jsx'
import HelloWorld from './HelloWorld.jsx'
import { Rnd } from "react-rnd"
import { addComponent, updateComponent } from '../actions.js';
import * as UUID from 'uuid-js';

const style = {
  display: "flex",
  border: "solid 1px #ddd"
};

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
                       {comp.type == "map" && <Map comp={comp}/>}
                       {comp.type == "hello-world" && <HelloWorld comp={comp}/>}
                    </Rnd>
                  )
                })}
              </div>
              <div>
                <Button onClick={() => this.props.dispatch(addComponent("map", UUID.create().toString(), {}))}>Add map</Button>
                <Button onClick={() => this.props.dispatch(addComponent("hello-world", UUID.create().toString(), {}))}>Add HelloWorld</Button>
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
