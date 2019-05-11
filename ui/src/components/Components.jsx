import React, { Component } from 'react';
import { Segment, Header, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import Map from './Map.jsx'
import HelloWorld from './HelloWorld.jsx'
import Draggable from 'react-draggable'
import {Resizable, ResizableBox } from 'react-resizable';
import { Rnd } from "react-rnd"
import { addComponent } from '../actions.js';

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
                    <Rnd style={style} key={comp.id}>
                       {comp.type == "map" && <Map params={comp.params}/>}
                       {comp.type == "hello-world" && <HelloWorld params={comp.params}/>}
                    </Rnd>
                  )
                })}
              </div>
            </Segment>
            <div>
              <Button onClick={() => this.props.dispatch(addComponent("map", "1", {}))}>Add map</Button>
              <Button onClick={() => this.props.dispatch(addComponent("hello-world", "2", {}))}>Add HelloWorld</Button>
            </div>
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
