import React, { Component } from 'react';
import { connect } from 'react-redux'
import { renderComposedPaths } from '../../render-utils.js';

const mapboxgl = require('mapbox-gl');

class Map extends Component {
  
  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1IjoidnZhemhlc292IiwiYSI6ImNqdHBpdnUxcTA1NXk0MXBjMTl4OHJlOWgifQ.J262J1QTtrGIlylAXKTYSQ';

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      hash: false,
      center: this.props.params.center,
      zoom: this.props.params.zoom,
      preserveDrawingBuffer: true
    });
    this.map = map

    this.map.on("render", () => {
      this.refreshPreview()
    });

    map.once('load', () => {
      this.renderPaths()
    })
  }
  
  renderPaths() {
    renderComposedPaths(
      this.map, 
      this.props.currentTimePossition, 
      this.props.points, 
      this.props.paths
    )
  }

  refreshPreview() {
    const canvas1 = this.mapContainer.querySelector('canvas');
    var ctx = this.canvas.getContext('2d');

    this.canvas.width = canvas1.width;
    this.canvas.height = canvas1.height;

    ctx.globalAlpha = this.props.comp.params.opacity/100;
    if (this.props.mask == "circle") {
      ctx.beginPath();
      ctx.arc(
        this.canvas.width / 2, 
        this.canvas.height / 2, 
        Math.min(canvas1.width / 2, canvas1.height / 2), 
        0, Math.PI * 2, true);
        ctx.clip();
    }
    
    if (this.props.mask == "square") {
      ctx.beginPath();
      const d = Math.min(canvas1.width / 2, canvas1.height / 2)

      ctx.rect(this.canvas.width / 2 - d, 
               this.canvas.height / 2 - d, 
               d * 2, 
               d * 2);
      ctx.clip();
    }
    
    ctx.drawImage(canvas1, 0, 0);
    
    if (this.props.onRendered != null) {
      this.props.onRendered(this.canvas)
    }
  }

  getWidth() {
    return this.props.comp.params.width
  }

  getHeight() {
    return this.props.comp.params.height
  }

  componentDidUpdate(prevProps) {

    if (this.props.params.center !== prevProps.params.center) {
      this.map.setCenter(this.props.params.center);
    }

    if (this.props.params.zoom !== prevProps.params.zoom) {
      this.map.setZoom(this.props.params.zoom)
    }

    if (this.props.params !== prevProps.params) {
      this.map.resize()
      this.refreshPreview()
    }

    if (this.props.currentTimePossition !== prevProps.currentTimePossition) {
      this.renderPaths()
    }
  }

  render() {
    return (
      <div style={{
        width: this.getWidth(),
        height: this.getHeight()
        //  display: "none"
        }}
      >
        <canvas 
          ref={el => this.canvas = el} 
        />
        <div style={{
          height: 0,
          width: 0,
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
              width: this.getWidth(),
              height: this.getHeight(),
            //  display: "none"
            }} 
            ref="mapContainer" 
            ref={el => this.mapContainer = el}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    points: state.points,
    paths: state.paths
  };
};

export default connect(mapStateToProps)(Map)
