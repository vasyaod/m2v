import React, { Component } from 'react';
import { connect } from 'react-redux'

class HelloWorld extends Component {
  
  render() {
    return (
      <div>
        Hello world
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
    data: state.points,
    paths: state.paths
  };
};

export default connect(mapStateToProps)(HelloWorld)
