import React, { Component } from 'react';
import { Segment, Header} from 'semantic-ui-react'
import { connect } from 'react-redux'
import Map from './Map.jsx'
import HelloWorld from './HelloWorld.jsx'
import Draggable from 'react-draggable'

class Components extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 1.0,
      currentTimePossition: 0,
      isRendering: false
    }

    this.components = {
      "map": Map
    }

    // this.objects = [
    //   <HelloWorld/>
    //   <Map/>
    // ]
  }

  render() {
    return (
      <div>
        <div className="ui three column grid">
          <div className="ten wide column">
            <Segment basic>
              <Header as='h3'>Render1</Header>
              <div 
                ref={el => this.frameContainer = el} 
                style={{
                  position: "relative",
                  width: "100%",
                  height: 600,
                  float: "left",
                  overflow: "hidden",
//                  zoom: this.state.scale,
                  background: "url('./images/bg.png')"
                }}>
                  <Map/>
                  <Draggable><HelloWorld/></Draggable>
                {/* {this.objects.map(obj => {
                  return (
                    <Draggable 
                      position = {{
                        x: 100, 
                        y: 100
                      }}
                      bounds = "parent"
                      // onDrag = {(e,data) => this.setPosition(data.x, data.y)}
                    >
                      {obj}
                    </Draggable>
                  )
                })} */}
              </div>
            </Segment>
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
    viewportWidth: state.viewport.width,
    viewportHeight: state.viewport.height,
    opacity: state.opacity,
    mask: state.mask,
    center: state.viewportPosition.center,
    zoom: state.viewportPosition.zoom,
    frameWidth: state.frame.width,
    frameHeight: state.frame.height,
    viewportX: state.frame.viewportX,
    viewportY: state.frame.viewportY,
    points: state.points,
    paths: state.paths
  };
};

export default connect(mapStateToProps)(Components)
