import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Segment, Header, Input, Button, Form, Modal } from 'semantic-ui-react'

const mapboxgl = require('mapbox-gl');

class Map extends Component {
  
  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1IjoidnZhemhlc292IiwiYSI6ImNqdHBpdnUxcTA1NXk0MXBjMTl4OHJlOWgifQ.J262J1QTtrGIlylAXKTYSQ';

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      hash: false,
      preserveDrawingBuffer: true
    });
    this.map = map
  }

  getWidth() {
    return this.props.comp.params.width == null ? 200 : this.props.comp.params.width
  }

  getHeight() {
    return this.props.comp.params.height == null ? 200 : this.props.comp.params.height
  }

  render() {
    console.log(this.getWidth(), this.getHeight())

    return (
      <Modal open={true} onClose={e => this.props.onClose()}>
        <Modal.Header>Select a Photo</Modal.Header>
        <Modal.Content>
          <Segment basic>
                <div style={{
                width: this.getWidth(),
                height: this.getHeight(),
              //  display: "none"
              }} 
              ref="mapContainer" 
              ref={el => this.mapContainer = el}
            />
            
            <div><label>Width</label></div>
            <Input type="number" 
                  value={this.props.comp.params.width} 
                  />
            <div><label>Height</label></div>
            <Input type="number" 
                  value={this.props.comp.params.height}
                  />
            <div><label>Opacity</label></div>
            <Input type="number" 
                  value={this.props.comp.params.opacity}
              />
          </Segment>
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

export default connect(mapStateToProps)(Map)
