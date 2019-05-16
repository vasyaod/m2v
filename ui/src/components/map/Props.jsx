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
      <Modal open={true} onClose={this.props.onCanceled}>
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
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.props.onCanceled}>
            Cancel
          </Button>
          <Button basic onClick={this.props.onApplyed}>
            Apply
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

export default connect(mapStateToProps)(Props)
