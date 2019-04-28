import React, { Component } from 'react';
//import 'style-loader!css-loader!../css/styles.css';
import { Segment, Header, Input } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Draggable from 'react-draggable'
import { updateViewportPossition, updateFrameWidth, updateFrameHeight } from '../actions.js';


class FrameParams extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frameHeight: 0
    }
  }

  componentDidMount() {
    this.resize()
  }

  resize() {
    const width = this.divElement.clientWidth;
    const factor = (width / this.props.width)
    this.setState({
      frameHeight: this.props.height * factor,
      mapWidth: this.props.viewportWidth * factor,
      mapHeight: this.props.viewportHeight * factor
    })
  }

  componentDidUpdate(prevProps) {
    const width = this.divElement.clientWidth;
    
    if (this.props.height !== prevProps.height ||
        this.props.width !== prevProps.width ||
        this.props.viewportWidth !== prevProps.viewportWidth ||
        this.props.viewportHeight !== prevProps.viewportHeight) {
          this.resize()
        }
  }

  setPosition(scaledX, scaledY) {
    this.props.dispatch(updateViewportPossition(
      Math.round(scaledX / this.getPositionFactor()), 
      Math.round(scaledY / this.getPositionFactor())
    ))
  }

  getPositionFactor() {
    if (this.divElement == null){
      return 1
    }
    const width = this.divElement.clientWidth;
    return width / this.props.width
  }

  render() {
    return (
      <div>
        <div className="ui three column grid">
          <div className="ten wide column">
            <Segment basic>
              <Header as='h3'>Map position and frame properties</Header>
              <div style={{
                  position: "relative",
                  width: "100%",
                  height: this.state.frameHeight,
                  float: "left",
                  overflow: "hidden",
                  background: "url('./images/bg.png')"
                }}
                ref={ (divElement) => this.divElement = divElement}>
                <Draggable 
                  position = {{
                    x: this.props.viewportX * this.getPositionFactor(), 
                    y: this.props.viewportY * this.getPositionFactor()
                  }}
                  bounds = "parent"
                  onDrag = {(e,data) => this.setPosition(data.x, data.y)}
                  >
                  <div style={{
                      width: this.state.mapWidth,
                      height: this.state.mapHeight,
                      opacity: 0.9,
                      "background-color": "#eee"
                    }}>
                    <div>Map portview</div>
                  </div>
                </Draggable>
              </div>
            </Segment>
          </div>
          <div className="four wide column">
            <Segment basic>
              <div><label>Frame width</label></div>
              <Input type="number" 
                     value={this.props.width}
                     onChange={(e, data) => this.props.dispatch(updateFrameWidth(parseInt(data.value)))}/>
              <div><label>Frame height</label></div>
              <Input type="number" 
                     value={this.props.height}
                     onChange={(e, data) => this.props.dispatch(updateFrameHeight(parseInt(data.value)))}/>
              <div><label>Map position X</label></div>
              <Input type="number" 
                     value={this.props.viewportX}
                      />
              <div><label>Map position Y</label></div>
              <Input type="number" 
                     value={this.props.viewportY}
                      />
            </Segment>
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
    width: state.frame.width,
    height: state.frame.height,
    viewportX: state.frame.viewportX,
    viewportY: state.frame.viewportY
  };
};

export default connect(mapStateToProps)(FrameParams)
