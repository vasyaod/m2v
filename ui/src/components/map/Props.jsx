import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Segment, Header, Input, Button, Form, Modal } from 'semantic-ui-react'

const mapboxgl = require('mapbox-gl');

class Props extends Component {
  
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
      <Modal open={true} onClose={e => this.props.onClose()}>
        <Modal.Header>Select a Photo</Modal.Header>
        <Modal.Content>
          <Segment basic>
            <div><label>Set position</label></div>
            <div style={{
                width: this.params().width,
                height: this.params().height,
              //  display: "none"
              }} 
              ref="mapContainer" 
              ref={el => this.mapContainer = el}
            />
            
            <div><label>Width</label></div>
            <Input type="number" 
                  value={this.params().width} 
                  />
            <div><label>Height</label></div>
            <Input type="number" 
                  value={this.params().height}
                  />
            <div><label>Opacity</label></div>
            <Input type="number" 
                  value={this.params().opacity}
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

export default connect(mapStateToProps)(Props)
