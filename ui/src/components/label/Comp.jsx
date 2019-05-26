import React, { Component } from 'react';
import { connect } from 'react-redux'

import { Stage, Layer, Rect, Text } from 'react-konva';

class HelloWorld extends Component {
  
  componentDidMount() {
    if (this.props.onRendered != null) {
      this.canvas = this.canvasContainer.querySelector('canvas');
      this.props.onRendered(this.canvas)
    }
  }

  componentDidUpdate() {
    if (this.props.onRendered != null) {
      this.canvas = this.canvasContainer.querySelector('canvas');
      this.props.onRendered(this.canvas)
    }
  }

  render() {
    return (
      <div ref="canvasContainer" 
           ref={el => this.canvasContainer = el}>
        <Stage width={this.props.params.width} 
               height={this.props.params.height}>
          <Layer>
            <Text text={this.props.params.text} />
          </Layer>
        </Stage>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

export default connect(mapStateToProps)(HelloWorld)
