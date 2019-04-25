import React, { Component } from 'react';
//import 'style-loader!css-loader!../css/styles.css';
import { Segment, Sidebar, Menu, Container } from 'semantic-ui-react'
import MapViewport from './MapViewport.jsx'
import GeoData from './GeoData.jsx'
import FrameParams from './FrameParams.jsx'
import Render from './Render.jsx'
import Project from './Project.jsx'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import queryString from 'query-string';
import { loadProjectFromUrl } from '../actions.js';
import { connect } from 'react-redux'

const mapboxgl = require('mapbox-gl');

class Page extends Component {
  componentDidMount() {
    const parameters = queryString.parse(location.search)
    if (parameters.project != null) {
      this.props.dispatch(loadProjectFromUrl(parameters.project))
    }
  }

  render() {
    return (
      <Router>
        <div className="fullHeight">
          {/* <Segment inverted>
            <Menu inverted>
              <Container>
                <Menu.Item as='a' header> Project Name </Menu.Item>
                <Menu.Item as='a'>Home</Menu.Item>
              </Container>
            </Menu>
          </Segment> */}

          <Sidebar.Pushable as={Segment}>
            <Sidebar
                as={Menu}
                direction='left'
                icon='labeled'
                vertical={true}
                inverted={true}
                visible={true}
                exclusive="true"
                width="thin"
              >
              <Menu.Item as={Link} to="/m2v-site/project">
                Project
              </Menu.Item>
              <Menu.Item as={Link} to="/m2v-site/geodata">
                GEO Data
              </Menu.Item>
              <Menu.Item as={Link} to="/m2v-site/mapviewport">
                Map viewport
              </Menu.Item>
              <Menu.Item as={Link} to="/m2v-site/frameparams">
                Frame parameters
              </Menu.Item>
              <Menu.Item as={Link} to="/m2v-site/render">
                Render
              </Menu.Item>
            </Sidebar>

            <Sidebar.Pusher >
              <Route exact path="/" component={Project} />
              <Route exact path="/m2v-site/" component={Project} />
              <Route path="/m2v-site/project" component={Project} />
              <Route path="/m2v-site/mapviewport" component={MapViewport} />
              <Route path="/m2v-site/geodata" component={GeoData} />
              <Route path="/m2v-site/frameparams" component={FrameParams} />
              <Route path="/m2v-site/render" component={Render} />
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
      </Router>
    );
  }
}

export default connect()(Page)