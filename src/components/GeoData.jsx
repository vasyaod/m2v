import React, { Component } from 'react';
import {Resizable, ResizableBox } from 'react-resizable';
//import 'style-loader!css-loader!../css/styles.css';
import { Table, Segment, Input, Button, Icon, Checkbox, Container, Form, Select } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { updateGeoEditor, addPoint, removePoint, replacePoint } from '../actions.js';

import { renderComposedPaths } from '../render-utils.js';

const utils = require('../utils.js');
const mapboxgl = require('mapbox-gl');

class GeoData extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      editedPoint: -1,
      editedPointTm: -1,
      currentTimePossition: 0,
      editedPointPathType: "line",
      layer: "map"
    }

    this.pathTypeOptions = [
      {
        key: "1",
        text: "None",
        value: "none",
      },
      {
        key: "2",
        text: "Line",
        value: "line",
      },
      {
        key: "3",
        text: "Route",
        value: "route",
      }
    ]

    this.layerOptions = [
      {
        key: "1",
        text: "map",
        value: "map",
      },
      {
        key: "2",
        text: "satellite",
        value: "satellite",
      }
    ]
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

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl(),  'top-left');

  //   map.on('click', "points", (e, d)=> {
  // //    e.originalEvent.stopPropagation();
  //     e.preventDefault()
  //     return false;
  //   });
    let mousedownTm = -1
    let dragablePoint 
    map.on('mousedown', 'points', e => {
      // Prevent the default map drag behavior.
      e.preventDefault();
      mousedownTm = new Date().getTime()
      dragablePoint = utils.closestPoint(e.lngLat, this.props.points)
      map.getCanvas().style.cursor = 'grab';
//      map.on('mousemove', onMove);
    });

    map.on('mouseup', e => {
      if(mousedownTm > 0 && dragablePoint != null & (new Date().getTime() - mousedownTm) > 500) {
        this.props.dispatch(replacePoint(dragablePoint.id, {
          lng: e.lngLat.lng, 
          lat: e.lngLat.lat,
          pathType: dragablePoint.pathType,
          tm: dragablePoint.tm
        }))
      }
      dragablePoint = null
      mousedownTm = -1
    });

    // map.on('touchstart', 'point', function (e) {
    //   if (e.points.length !== 1) return;

    //   // Prevent the default map drag behavior.
    //   e.preventDefault();

    //   map.on('touchmove', onMove);
    //   map.once('touchend', onUp);
    // });

    map.on('click', (e)=> {
      var bbox = [[e.point.x - 1, e.point.y - 1], [e.point.x + 1, e.point.y + 1]];
      var features = map.queryRenderedFeatures(bbox, { layers: ['points'] });
      var pathFeatures = map.queryRenderedFeatures(bbox, { layers: ['pathRight', 'pathLeft'] });

      if(features.length > 0) {
        const point = utils.closestPoint(e.lngLat, this.props.points)
        this.editPoint(point.id)
      } else if(pathFeatures.length > 0) {
        const path = utils.closestPaths(e.lngLat, this.props.paths)
        const leftPoint = utils.pointById(path.leftPointId, this.props.points)
        const rightPoint = utils.pointById(path.rightPointId, this.props.points)
        const newTm = leftPoint.tm + (rightPoint.tm - leftPoint.tm) / 2
        this.props.dispatch(addPoint({
          lng: e.lngLat.lng, 
          lat: e.lngLat.lat,
          pathType: "line",
          tm: newTm
        }))
      } else {
        this.props.dispatch(addPoint({
          lng: e.lngLat.lng, 
          lat: e.lngLat.lat,
          pathType: "line",
          tm: -1
        }))
      }
    });

    map.on('dblclick', 'points', (e)=> {
      var bbox = [[e.point.x - 1, e.point.y - 1], [e.point.x + 1, e.point.y + 1]];
      var features = map.queryRenderedFeatures(bbox, { layers: ['points'] });

      if(features.length > 0) {
        const point = utils.closestPoint(e.lngLat, this.props.points)
        this.removePoint(point.id)
      }

      e.preventDefault()
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'points', function () {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'points', function () {
      map.getCanvas().style.cursor = 'default';
    });

    map.on('moveend', e => {
      var center = map.getCenter();
      var zoom = map.getZoom();
      this.props.dispatch(updateGeoEditor(center.lat, center.lng, zoom))
    })
    const self = this
    map.once('load', function () {
      self.loadData()
    })

    map.getCanvas().style.cursor = 'default'
    //this.loadData()
  }

  loadData() {
    
    renderComposedPaths(
      this.map, 
      this.state.currentTimePossition, 
      this.props.points, 
      this.props.paths
    )

    const pointFeatures = this.props.points.map((e, index) => {
      return {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Point",
            "coordinates": [
              e.lng,
              e.lat
            ]
        },
        "properties": {
          "icon": "marker",
          "title": index,
          "marker-size": "large",
          "marker-symbol": ""
        }
      }
    })

    const data = {
      "type": "FeatureCollection",
      "features": pointFeatures.toArray()
    }

    if (this.map.getSource('path') == null){
      this.map.addSource('path', {
        type: 'geojson',
        data: data
      });
    }
    
    if (this.map.getSource('points') == null){
      this.map.addSource('points', {
        type: 'geojson',
        data: data
      });
    }

    if (this.map.getLayer('points') == null){
      this.map.addLayer({
        "id": "points",
        "type": "symbol",
        "source": "points",
        "layout": {
          "icon-image": "{icon}-15",
          "text-field": "{title}",
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 0.6],
          "text-anchor": "top"
        }
      });
    }

    this.map.getSource('points').setData(data)
  }

  componentDidUpdate(prevProps) {
    if (this.props.points !== prevProps.points) {
      this.loadData()
    }
  }
  
  removePoint(pointId) {
    // Close editor.
    this.setState({
      editedPointId: -1,
    })

    this.props.dispatch(removePoint(pointId))
  }

  formatTm(tm) {
    var mins = Math.floor(tm/60);
    var secs = tm % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  editPoint(pointId) {
    const point = this.props.points.find(p => p.id == pointId)
    
    this.setState({
      editedPointId: point.id,
      editedPointTm: this.formatTm(point.tm),
      editedPointLat: point.lat,
      editedPointLng: point.lng,
      editedPointPathType: point.pathType,
    })
  }

  savePoint() {
    const pointId = this.state.editedPointId
    const point = this.props.points.find(p => p.id == pointId)
    let editedPointTm
    const x = this.state.editedPointTm.split(':')
    if (x.length == 1) {
      editedPointTm = parseInt(x[0]) < 0 ? point.tm : parseInt(x[0])
    } else {
      const mins = parseInt(x[0])
      const secs = parseInt(x[1])
      editedPointTm = mins * 60 + secs
    }

    this.props.dispatch(replacePoint(pointId, {
      lng: this.state.editedPointLng, 
      lat: this.state.editedPointLat,
      pathType: this.state.editedPointPathType,
      tm: editedPointTm
    }))

    // Close editor.
    this.setState({
      editedPointId: -1,
    })
  }

  setTimePosstion(value) {
    this.setState({
      currentTimePossition: value
    })
    this.loadData()
  }
  
  switchLayer(layer) {
    this.setState({layer: layer})
    if (layer == "satellite") {
      this.map.setStyle('mapbox://styles/mapbox/satellite-v9');
    } else {
      this.map.setStyle('mapbox://styles/mapbox/streets-v11');
    }
  }

  render() {
    return (
      <div style={{height: "100%"}}>
        <div className="ui three column grid" style={{height: "100%"}}>
          <div className="ten wide column" >
            <Segment basic style={{height: "100%"}}>
              <div style={{height: "90%", width: "100%"}} ref="mapContainer" ref={el => this.mapContainer = el}/>
              <Select
                onChange={(e, data) => {
                  this.switchLayer(data.value)
                }}
                // onChange={this.handleChange}
                options={this.layerOptions}
                value={this.state.layer}
              />
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
            </Segment>
          </div>
          <div className="four wide column">
            <Segment basic>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>#</Table.HeaderCell>
                    <Table.HeaderCell>Timeline</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {
                    this.props.points.map((point, index) => {
                        if (this.state.editedPointId == point.id) {
                          return (
                            <Table.Row columns={1} key={point.id}>
                              <Table.Cell colSpan={4}>
                                <div>
                                  <div>
                                    Point ID: {index}
                                  </div>
                                  <div>
                                    <Input type="number" 
                                      label='Lng'
                                      value={this.state.editedPointLng}
                                      onChange={(e, data) => {
                                            this.setState({editedPointLng: parseFloat(data.value)})
                                          }}
                                    />
                                  </div>
                                  <div>
                                    <Input type="number" 
                                      label='Lat'
                                      value={this.state.editedPointLat}
                                      onChange={(e, data) => {
                                            this.setState({editedPointLat: parseFloat(data.value)})
                                          }}
                                    />
                                  </div>
                                  <div>
                                    <Input type="text" 
                                      label='Time'
                                      value={this.state.editedPointTm}
                                      onChange={(e, data) => {
                                            this.setState({editedPointTm: data.value})
                                          }}
                                    />
                                  </div>
                                  <div>
                                    <Select
                                      onChange={(e, data) => {
                                        this.setState({editedPointPathType: data.value})
                                      }}
                                     // onChange={this.handleChange}
                                      options={this.pathTypeOptions}
                                      value={this.state.editedPointPathType}
                                    />
                                  </div>
                                  <div>
                                    <Button onClick={() => this.setState({editedPointId: -1})}>
                                      Cancel
                                    </Button>
                                    <Button onClick={() => this.savePoint()}>
                                      Save
                                    </Button>
                                    <Button icon onClick={() => this.removePoint(point.id)}>
                                      <Icon name='trash alternate outline' />
                                    </Button>
                                  </div>
                                </div>
                              </Table.Cell>
                            </Table.Row>
                          )
                        } else {
                          return (
                            <Table.Row key={point.id}>
                              <Table.Cell>{index}</Table.Cell>
                              <Table.Cell>
                                  {this.formatTm(point.tm)}
                              </Table.Cell>
                              {/* <Table.Cell><Checkbox /></Table.Cell> */}
                              <Table.Cell>  
                                <Button icon onClick={() => this.editPoint(point.id)}>
                                  <Icon name='pencil alternate' />
                                </Button>
                              </Table.Cell>
                              <Table.Cell>  
                                <Button icon onClick={() => this.removePoint(point.id)}>
                                  <Icon name='trash alternate outline' />
                                </Button>
                              </Table.Cell>
                            </Table.Row>
                          )
                        }
                      })
                  }
                </Table.Body>
              </Table>
            </Segment>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    points: state.points,
    paths: state.paths,
    center: state.gioEditor.center,
    zoom: state.gioEditor.zoom
  };
};

export default connect(mapStateToProps)(GeoData)
