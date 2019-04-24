import React, { Component } from 'react';
import {Resizable, ResizableBox } from 'react-resizable';
//import 'style-loader!css-loader!../css/styles.css';
import { Step, Button, Select, Segment, Header, Sidebar, Container, Input, Menu } from 'semantic-ui-react'
import { connect } from 'react-redux'
import {resizeViewport, changeOpacity, changeMask, updatePossitionOfViewport} from '../actions.js';
import { renderComposedPaths } from '../render-utils.js';

const mapboxgl = require('mapbox-gl');

class MapViewport extends Component {
  
  componentDidMount() {
  //   var map = new mapboxgl.Map({
  //     container: this.mapContainer,
  //     style: 'https://openmaptiles.github.io/osm-bright-gl-style/style-cdn.json',
  //     center: [8.5456, 47.3739],
  //     zoom: 11
  // });
    mapboxgl.accessToken = 'pk.eyJ1IjoidnZhemhlc292IiwiYSI6ImNqdHBpdnUxcTA1NXk0MXBjMTl4OHJlOWgifQ.J262J1QTtrGIlylAXKTYSQ';

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      //style: 'https://maps.tilehosting.com/styles/basic/style.json?key=bArAycFckX61rnr3cjXd',
      center: this.props.center,
      zoom: this.props.zoom,
      hash: false,
      preserveDrawingBuffer: true
    });
    this.map = map
    const self = this

    this.map.on("render", function() {
      self.refreshPreview()
    });
    
    map.on('moveend', e => {
      var center = map.getCenter();
      var zoom = map.getZoom();
      this.props.dispatch(updatePossitionOfViewport(center.lat, center.lng, zoom))
    })

    map.once('load', function () {
      self.renderPaths()
    })

    // Add zoom and rotation controls to the map.
    this.map.addControl(new mapboxgl.NavigationControl(),  'top-left');

  // this.map = new mapboxgl.Map({
  //   container: this.mapContainer,
  //     style: 'mapbox://styles/mapbox/streets-v9'
  //   });
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
  
  renderPaths() {
    renderComposedPaths(this.map, 0, this.props.points, this.props.paths)
  }

  onResize(e, size) {
    const map = this.map
    this.props.dispatch(resizeViewport(size.width, size.height))
  }
  
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.viewportWidth !== prevProps.viewportWidth || 
      this.props.viewportHeight !== prevProps.viewportHeight) {
        this.map.resize()
        this.refreshPreview()
    }

    if (this.props.opacity !== prevProps.opacity) {
        this.refreshPreview()
    }
  
    if (this.props.mask !== prevProps.mask) {
      this.refreshPreview()
    }

    if (this.props.data !== prevProps.data) {
      this.renderPaths()
    }
  }

  render() {
    const countryOptions = [
      {
        key: "1",
        text: "None",
        value: "none",
      },
      {
        key: "2",
        text: "Square",
        value: "square",
      },
      {
        key: "3",
        text: "Circle",
        value: "circle",
      }
    ]

    return (
      <div>
        <div className="ui three column grid">
          <div className="ten wide column">
            <Segment basic>
              <div style={{float: "left", marginRight: "10pt" }}>
                <Header as='h3'>Select scale and size</Header>
                <ResizableBox className="box" 
                              width={this.props.viewportWidth} 
                              height={this.props.viewportHeight} 
                              onResize={(e,t) => this.onResize(e, t.size)}>
                  <div style={{height: "100%", width: "100%"}} ref="mapContainer" ref={el => this.mapContainer = el}/>
                </ResizableBox>
              </div>
              <div>
                <Header as='h3'>Preview</Header>
                <canvas ref={el => this.canvas = el} style={{background: "url('./images/bg.png')"}}/>
              </div>
            </Segment>
          </div>
          <div className="four wide column">
            <Segment basic>
              <div><label>Width</label></div>
              <Input type="number" 
                     value={this.props.viewportWidth} 
                     onChange={(e, data) => this.props.dispatch(resizeViewport(parseInt(data.value), this.props.viewportHeight))}/>
              <div><label>Height</label></div>
              <Input type="number" 
                     value={this.props.viewportHeight}
                     onChange={(e, data) => this.props.dispatch(resizeViewport(this.props.viewportWidth, parseInt(data.value)))}/>
              <div><label>Mask</label></div>
              <Select placeholder='Select mask'
                      value={this.props.mask}
                      options={countryOptions} 
                      onChange={(e, data) => this.props.dispatch(changeMask(data.value))}/>
              <div><label>Opacity</label></div>
              <Input type="number" 
                     value={this.props.opacity}
                     onChange={(e, data) => this.props.dispatch(changeOpacity(parseInt(data.value)))}/>
            </Segment>
          </div>
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
    paths: state.paths,
  };
};

export default connect(mapStateToProps)(MapViewport)
