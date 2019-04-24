import React, { Component } from 'react';
//import 'style-loader!css-loader!../css/styles.css';
import { Segment, Sidebar, Menu, Container } from 'semantic-ui-react'
import MapViewport from './MapViewport.jsx'
import GeoData from './GeoData.jsx'
import FrameParams from './FrameParams.jsx'
import Render from './Render.jsx'
import Project from './Project.jsx'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const mapboxgl = require('mapbox-gl');

class Page extends Component {
  
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
              <Menu.Item as={Link} to="/project">
                Project
              </Menu.Item>
              <Menu.Item as={Link} to="/geodata">
                GEO Data
              </Menu.Item>
              <Menu.Item as={Link} to="/mapviewport">
                Map viewport
              </Menu.Item>
              <Menu.Item as={Link} to="/frameparams">
                Frame parameters
              </Menu.Item>
              <Menu.Item as={Link} to="/render">
                Render
              </Menu.Item>
            </Sidebar>

            <Sidebar.Pusher >
              <Route exact path="/" component={Project} />
              <Route path="/project" component={Project} />
              <Route path="/mapviewport" component={MapViewport} />
              <Route path="/geodata" component={GeoData} />
              <Route path="/frameparams" component={FrameParams} />
              <Route path="/render" component={Render} />
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
      </Router>
    );
  }
}

export default Page