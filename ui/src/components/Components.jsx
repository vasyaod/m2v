import React, { Component } from 'react';
import { Segment, Header, Button, Input, Modal, Select } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Rnd } from "react-rnd"
import { addComponent, updateComponent, removeComponent, updateFrameWidth, updateFrameHeight } from '../actions.js';
import * as UUID from 'uuid-js';

import { components } from './ComponentList.js'

const style = {
  display: "flex",
  border: "solid 1px #ddd"
};


const componentOptions = components.map(c => 
  ({ 
      key: c.type,
      text: c.type,
      value: c.type,
  })
)

class Components extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      scale: 1.0,
      currentTimePossition: 0,
      selectedComponentType: "map",
      compParams: null
    }
  }

  componentResize(comp, widthStr, heightStr) {
    this.props.dispatch(updateComponent(comp, {
      width: parseInt(widthStr.replace(/px/, '')), 
      height: parseInt(heightStr.replace(/px/, ''))
    }))
  }
  
  resize() {
    const factor = (this.width / this.props.width)
    this.setState({
      scale: factor
    })
  }

  componentDidMount() {
    this.width = this.frameContainer.clientWidth
    this.resize()
  }

  render() {
    return (
      <div>
        <div className="ui three column grid">
          <div className="ten wide column">
            <Segment basic>
              <Header as='h3'>Components</Header>
              <div 
                ref={el => this.frameContainer = el} 
                style={{
                  width: "100%",
                  overflow: "hidden",
                  zoom: this.state.scale,
                }}
              >
                <div 
                  ref={el => this.frame = el} 
                  style={{
                    position: "relative",
                    width: this.props.width,
                    height: this.props.height,
                    float: "left",
                    overflow: "hidden",
                    background: "url('./images/bg.png')"
                  }}
                >
                  {this.props.components.map(comp => {
                    const compTemplate = components.find(x => comp.type == x.type)
                    const Comp = compTemplate.comp
                    return (
                      <Rnd 
                        style={style} 
                        key={comp.id}
                        position={{ 
                          x: comp.params.x == null ? 0: comp.params.x, 
                          y: comp.params.y == null ? 0: comp.params.y 
                        }}
                        onDragStop={(e, d) => {
                          this.props.dispatch(updateComponent(comp, {x: d.x, y: d.y})) 
                        }}
                        onResize={(e, direction, ref, delta, position) => {
                          this.componentResize(comp, ref.style.width, ref.style.height)
                        }}
                        onDoubleClick={e => this.setState({compParams: comp})}
                      >
                        <Comp 
                            comp={comp}
                            params={comp.params} 
                            currentTimePossition = {this.state.currentTimePossition}
                        />
                      </Rnd>
                    )
                  })}
                </div>
              </div>
              <div>
                <Select
                  onChange={(e, data) => {
                    this.setState({selectedComponentType: data.value})
                  }}
                  options={componentOptions}
                  value={this.state.selectedComponentType}
                />
                <Button onClick={() => {
                  const compTemplate = components.find(x => x.type == this.state.selectedComponentType)
                  this.props.dispatch(addComponent(this.state.selectedComponentType, UUID.create().toString(), compTemplate.defaultParams))
                }}>Add</Button>
              </div>
            </Segment> 
            { this.state.compParams &&
              <Modal open={true} onClose={this.props.onCanceled}>
                <Modal.Header>Properties</Modal.Header>
                <Modal.Content>
                  <Segment basic>
                    {(() => {
                        const compTemplate = components.find(x => x.type == this.state.compParams.type)
                        const Comp = compTemplate.props
                        return (<Comp
                          comp={this.state.compParams} 
                          params={this.state.compParams.params}
                          currentTimePossition = {this.state.currentTimePossition}
                          onChanged={ params => {
                            const newParam = Object.assign({}, this.state.compParams.params, params)
                            this.setState({
                              compParams: Object.assign({}, this.state.compParams, {params: newParam})
                            })
                          }}
                        />)
                    })()}
                  </Segment>
                </Modal.Content>
                <Modal.Actions>
                  <Button onClick={() => {
                    this.props.dispatch(removeComponent(this.state.compParams.id))
                    this.setState({compParams: null})
                  }}>
                    Remove
                  </Button>
                  <Button onClick={() => this.setState({compParams: null})}>
                    Cancel
                  </Button>
                  <Button basic onClick={() => {
                    this.props.dispatch(updateComponent(Object.assign({}, this.state.compParams, {
                      params: null
                    }), this.state.compParams.params))
                    this.setState({compParams: null})
                  }}>
                    Apply
                  </Button>
                </Modal.Actions>
              </Modal>
            }
          </div>
          <div className="four wide column">
            <Segment basic>
                <div><label>Frame width</label></div>
                <Input type="number"
                      value={this.props.width}
                      onChange={(e, data) => this.props.dispatch(updateFrameWidth(parseInt(data.value)))}/>
                <div><label>Frame height</label></div>
                <Input type="number"
                      value={this.props.height}
                      onChange={(e, data) => this.props.dispatch(updateFrameHeight(parseInt(data.value)))}/>
            </Segment>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    components: state.components,
    width: state.frame.width,
    height: state.frame.height,
  };
};

export default connect(mapStateToProps)(Components)
