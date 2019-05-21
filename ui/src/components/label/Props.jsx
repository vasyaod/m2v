import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Segment, Input, Form } from 'semantic-ui-react'

const mapboxgl = require('mapbox-gl');

class Props extends Component {
  
  render() {
    return (
      <div>
        <div><label>X</label></div>
        <Input 
          type="number" 
          value={this.props.params.x} 
          onChange={(e, data) => this.props.onChanged({x: parseInt(data.value)})}
        />
        <div><label>Y</label></div>
        <Input 
          type="number" 
          value={this.props.params.y}
          onChange={(e, data) => this.props.onChanged({y: parseInt(data.value)})}
        />
        <div><label>Width</label></div>
        <Input 
          type="number" 
          value={this.props.params.width} 
          onChange={(e, data) => this.props.onChanged({width: parseInt(data.value)})}
        />
        <div><label>Height</label></div>
        <Input 
          type="number"
          value={this.props.params.height}
          onChange={(e, data) => this.props.onChanged({height: parseInt(data.value)})}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

export default connect(mapStateToProps)(Props)
