import React, { Component } from 'react';
import { connect } from 'react-redux'
import {resizeViewport, changeOpacity, changeMask, updatePossitionOfViewport} from '../actions.js';
import { renderComposedPaths } from '../render-utils.js';

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
  
    this.map.on("render", () => {
      this.refreshPreview()
    });
  }

  refreshPreview() {
    const canvas1 = this.mapContainer.querySelector('canvas');
    var ctx = this.canvas.getContext('2d');

    this.canvas.width = canvas1.width;
    this.canvas.height = canvas1.height;

    ctx.globalAlpha = this.props.opacity/100;
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
  }

  render() {
    return (
      <div style={{
          height: 200,
          width: 200,
        //  display: "none"
        }}>
        <canvas ref={el => this.canvas = el} style={{background: "url('./images/bg.png')"}}/>
        <div style={{
          height: 0,
          width: 0,
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            height: 200,
            width: 200,
          //  display: "none"
          }} ref="mapContainer" ref={el => this.mapContainer = el}/>
        </div>
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

export default connect(mapStateToProps)(Map)
