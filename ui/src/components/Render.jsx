import React, { Component } from 'react';
import { Segment, Header, Input, Button, Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { maxTime } from '../utils.js';
import isElectron from 'is-electron';

/* #!if isElectron */
import electron, { remote } from 'electron'
/* #!endif */

//import CCapture from '../CCapture.js'
import * as encoder from '../encoder-actions-server.js'
import * as config from '../config.js'

import { components } from './ComponentList.js'

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
    this.resize()
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
        // rendering stuff ...
        setTimeout(() => {
          const blob = this.frame.toBlob(async (blob) => {
            await encoder.saveFrame(encodeId, this.state.currentTimePossition, blob)
            render(encodeId)
          })
        }, 0);
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

    if(isElectron()) {
      /* #!if isElectron */
      const ipcRenderer = electron.ipcRenderer
      ipcRenderer.send("download", {
        url: `${config.renderServerUrl}/video/${encodeId}`
      })
     /* #!endif */
    } else {
      window.location.assign(`${config.renderServerUrl}/video/${encodeId}`);
      this.setState({
        isRendering: false
      })
    }
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
  }

  resize() {
    const width = this.frameContainer.clientWidth;
    const factor = (width / this.props.frameWidth)
    this.setState({
      scale: factor
    })
  }

  renderComp(comp, compCanvas) {
    // if (this.frame != null) {
    //   var ctx = this.frame.getContext('2d');
    //   ctx.drawImage(compCanvas, comp.params.x, comp.params.y);
    // }
    setTimeout(() => { this.renderComp2(comp, compCanvas) }, 0);
  }
  
  renderComp2(comp, compCanvas) {
    if (this.frame != null) {
      var ctx = this.frame.getContext('2d');
      ctx.drawImage(compCanvas, comp.params.x, comp.params.y);
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
                  {this.props.components.map(comp => {
                    const compTemplate = components.find(x => comp.type == x.type)
                    const Comp = compTemplate.comp
                    return (
                      <div key={comp.id} ref={el => this[comp.id] = el}>
                        <Comp 
                            comp={comp}
                            params={comp.params} 
                            currentTimePossition = {this.state.currentTimePossition}
                            onRendered={canvas => this.renderComp(comp, canvas)}
                        />
                      </div>
                    )
                  })}
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
    components: state.components,
    frameWidth: state.frame.width,
    frameHeight: state.frame.height,
    points: state.points,
    paths: state.paths
  };
};

export default connect(mapStateToProps)(Render)
