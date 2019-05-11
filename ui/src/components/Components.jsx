import React, { Component } from 'react';
import { Segment, Header} from 'semantic-ui-react'
import { connect } from 'react-redux'
import Map from './Map.jsx'
import HelloWorld from './HelloWorld.jsx'
import Draggable from 'react-draggable'
import {Resizable, ResizableBox } from 'react-resizable';
import { Rnd } from "react-rnd"

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
      isRendering: false
    }

    this.components = {
      "map": Map
    }

    this.objects = [
      <HelloWorld/>,
      <Map/>
    ]
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
                {this.objects.map(obj => {
                  return (
                    <Rnd style={style}>
                       {obj}
                    </Rnd>
                  )
                })}
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
