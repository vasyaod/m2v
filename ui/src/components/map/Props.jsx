import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Segment, Input, Form } from 'semantic-ui-react'

const mapboxgl = require('mapbox-gl');

class Props extends Component {
  
  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1IjoidnZhemhlc292IiwiYSI6ImNqdHBpdnUxcTA1NXk0MXBjMTl4OHJlOWgifQ.J262J1QTtrGIlylAXKTYSQ';

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.props.params.center,
      zoom: this.props.params.zoom,
      hash: false,
      preserveDrawingBuffer: true
    });
    this.map = map

    map.on('moveend', e => {
      var center = map.getCenter();
      var zoom = map.getZoom();
      this.props.onChanged({
        center: [center.lng, center.lat],
        zoom: zoom
      })
    })
  }

  params() {
    return this.props.comp.params
  }

  getWidth() {
    return this.props.comp.params.width
  }

  getHeight() {
    return this.props.comp.params.height
  }

  render() {
    return (
      <div>
        <div><label>Set position</label></div>
        <div style={{
            width: this.params().width,
            height: this.params().height,
          //  display: "none"
          }} 
          ref="mapContainer" 
          ref={el => this.mapContainer = el}
        />
        
        <div><label>X</label></div>
        <Input 
          type="number" 
          value={this.params().x} 
          onChange={(e, data) => this.props.onChanged({x: parseInt(data.value)})}
        />
        <div><label>Y</label></div>
        <Input 
          type="number" 
          value={this.params().y}
          onChange={(e, data) => this.props.onChanged({y: parseInt(data.value)})}
        />
        <div><label>Width</label></div>
        <Input 
          type="number" 
          value={this.params().width} 
          onChange={(e, data) => this.props.onChanged({width: parseInt(data.value)})}
        />
        <div><label>Height</label></div>
        <Input 
          type="number"
          value={this.params().height}
          onChange={(e, data) => this.props.onChanged({height: parseInt(data.value)})}
        />
        <div><label>Opacity</label></div>
        <Input 
          type="number" 
          value={this.params().opacity}
          onChange={(e, data) => this.props.onChanged({opacity: parseInt(data.value)})}
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
