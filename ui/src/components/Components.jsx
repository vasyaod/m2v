import React, { Component } from 'react';
import { Segment, Header, Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Rnd } from "react-rnd"
import { addComponent, updateComponent } from '../actions.js';
import * as UUID from 'uuid-js';

import { components } from './ComponentList.js'

const style = {
  display: "flex",
  border: "solid 1px #ddd"
};

class Components extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      scale: 1.0,
      currentTimePossition: 0,
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
    const width = this.frameContainer.clientWidth;
    const factor = (width / this.props.frameWidth)
    this.setState({
      scale: factor
    })
  }

  componentDidMount() {
    this.resize()
  }

  render() {
    return (
      <div>
        <div className="ui three column grid">
          <div className="ten wide column">
            <Segment basic>
              <Header as='h3'>Render1</Header>
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
                    width: this.props.frameWidth,
                    height: this.props.frameHeight,
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
                { 
                  components.map(c => {
                    return (
                      <Button key={c.type} onClick={() => 
                        this.props.dispatch(addComponent(c.type, UUID.create().toString(), c.defaultParams))
                      }>Add {c.type}</Button>
                    );
                  })
                }
              </div>
            </Segment> 
            { this.state.compParams &&
              <div>
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
                      onCanceled={() =>
                        this.setState({compParams: null})
                      }
                      onApplyed={() => {
                        this.props.dispatch(updateComponent(Object.assign({}, this.state.compParams, {
                          params: null
                        }), this.state.compParams.params))
                        this.setState({compParams: null})
                      }}
                    />)
                })()}
              </div>
            }
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
  };
};

export default connect(mapStateToProps)(Components)
