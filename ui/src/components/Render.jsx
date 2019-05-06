import React, { Component } from 'react';
import { Segment, Header, Input, Button, Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { renderComposedPaths } from '../render-utils.js';
import { maxTime } from '../utils.js';

//import CCapture from '../CCapture.js'
import * as encoder from '../encoder-actions.js'

const mapboxgl = require('mapbox-gl');

class Render extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 1.0,
      currentTimePossition: 0,
      isRendering: false
    }
  }

  componentDidMount() {
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
    })
    
    map.once('load', function () {
      self.renderPaths()
    })

    this.resize()
  }
  
  renderPaths() {
    renderComposedPaths(
      this.map, 
      this.state.currentTimePossition, 
      this.props.points, 
      this.props.paths
    )
  }

  startRenderingOfVideo() {
    console.log("Start rendering")
    
    this.setState({
      isRendering: true
    })

    const t = maxTime(this.props.points)
    const render = (encodeId) => {
      if (this.state.currentTimePossition < t) {
//        requestAnimationFrame(render);
        this.setTimePosstion(this.state.currentTimePossition + 1)
        this.refreshPreview() 
        console.log("!!!!")
        // rendering stuff ...
        const blob = this.frame.toBlob(async (blob) => {
          console.log("!!!!+", blob)
          await encoder.saveFrame(encodeId, this.state.currentTimePossition, blob)
          console.log("!!!!++")
          render(encodeId)
          console.log("!!!!+++")
        })
      } else {
        this.stopRenderingOfVideo(encodeId)
      }
    }
    
    this.setTimePosstion(0)
    encoder
      .startEncoding()
      .then( encodeId =>
        render(encodeId)
      )
  }

  snapshot() {
    console.log("Snapshot")
    
    this.frame.toBlob( blob => {
      download( blob, "snapshot.png", 'image/png' );
    }, 'image/png', 1.0 )
  }

  stopRenderingOfVideo(encodeId) {
    console.log("Stop rendering")
    const url = "http://localhost:8081"
    window.location.assign(`${url}/video/${encodeId}`);

    this.setState({
      isRendering: false
    })
  }

  cancelRenderingOfVideo() {
    console.log("Cancel rendering")
    this.capturer.stop()

    this.setState({
      isRendering: false
    })
  }

  setTimePosstion(value) {
    this.setState({
      currentTimePossition: value
    })
    this.renderPaths()
  }

  resize() {
    const width = this.frameContainer.clientWidth;
    const factor = (width / this.props.frameWidth)
    this.setState({
      scale: factor
    })
  }

  refreshPreview() {
    const canvas1 = this.mapContainer.querySelector('canvas');
    var ctx = this.frame.getContext('2d');
    
//     ctx.beginPath();
//     ctx.rect(0, 0, this.frame.width, this.frame.height);
//  //   ctx.fillStyle = "#009933";
//     ctx.fill();

    ctx.globalAlpha = this.props.opacity / 100;
    if (this.props.mask == "circle") {
      ctx.beginPath();
      ctx.arc(
        this.props.viewportX + canvas1.width / 2, 
        this.props.viewportY + canvas1.height / 2, 
        Math.min(canvas1.width / 2, canvas1.height / 2), 
        0, Math.PI * 2, true);
      ctx.clip();
    }
    
    if (this.props.mask == "square") {
      ctx.beginPath();
      const d = Math.min(canvas1.width / 2, canvas1.height / 2)

      ctx.rect(canvas1.width / 2 - d, 
               canvas1.height / 2 - d, 
               d * 2, 
               d * 2);
        ctx.clip();
    }

    ctx.drawImage(canvas1, this.props.viewportX, this.props.viewportY);
  }

  componentDidUpdate(prevProps) {
    if (this.props.viewportX !== prevProps.viewportX ||
      this.props.viewportY !== prevProps.viewportY ||
      this.props.viewportWidth !== prevProps.viewportWidth ||
      this.props.viewportHeight !== prevProps.viewportHeight) {
      this.refreshPreview()
    }

    if (this.props.data !== prevProps.data) {
      this.renderPaths()
    }
  }

  render() {
    return (
      <div>
        <div className="ui three column grid">
          <div className="ten wide column">
            <Segment basic>
              <Header as='h3'>Render</Header>
              <div style={{
                  height: 0,
                  width: 0,
                  position: "relative",
                  overflow: "hidden",
                }}>
                <div style={{
                  height: this.props.viewportHeight,
                  width: this.props.viewportWidth,
                //  display: "none"
                }} ref="mapContainer" ref={el => this.mapContainer = el}/>
              </div>
              <div 
                ref={el => this.frameContainer = el} 
                style={{
                  position: "relative",
                  overflow: "hidden",
                  width: "100%",
                  zoom: this.state.scale,
                  background: "url('./images/bg.png')"
                }}>
                <canvas
                  ref={el => this.frame = el}
                  height = {this.props.frameHeight}
                  width = {this.props.frameWidth}
                />
              </div>
                <div>
                  <Form.Input
                    style={{width: "100%"}} 
                    label={`Time: ${this.state.currentTimePossition}s `}
                    min={0}
                    max={this.props.points.size > 1 ? this.props.points.last().tm : 0}
                    onChange={(e, data) => this.setTimePosstion(parseInt(data.value))}
                    step={1}
                    type='range'
                    value={this.state.currentTimePossition}
                  />
                </div>
                { !this.state.isRendering &&
                  <div>
                    <Button onClick={() => this.startRenderingOfVideo()}>Start render video</Button>
                    <Button onClick={() => { this.snapshot() } }>Snapshot</Button>
                  </div>
                }
                { this.state.isRendering &&
                  <Button onClick={() => this.cancelRenderingOfVideo()}>Cancel render video</Button>
                }
            </Segment>
          </div>
          <div className="four wide column">

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
    frameWidth: state.frame.width,
    frameHeight: state.frame.height,
    viewportX: state.frame.viewportX,
    viewportY: state.frame.viewportY,
    points: state.points,
    paths: state.paths
  };
};

export default connect(mapStateToProps)(Render)
