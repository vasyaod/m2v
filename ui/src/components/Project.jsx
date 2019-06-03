import React, { Component } from 'react';
import { Segment, Header, Button, Container, Grid, Placeholder} from 'semantic-ui-react'
import { connect } from 'react-redux'
import ReactFileReader from 'react-file-reader';

import { resetProject, loadProject } from '../actions/actions.js';

class Project extends Component {

  handleFiles(files) {
    console.log(this)

    const file = files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      console.log("Restore project")
      this.props.dispatch(loadProject(reader.result))
    }
    reader.readAsText(file)
  }

  render() {
    return (
      <div>
      <Grid columns={2} stackable>
        <Grid.Column>
          <Segment raised>
            <Button onClick={() => this.props.dispatch(resetProject())}>
              New project
            </Button>
          </Segment>
        </Grid.Column>
    
        <Grid.Column>
          <Segment raised>
            <Button >
              Load a example
            </Button>
          </Segment>
        </Grid.Column>

        <Grid.Column>
          <Segment raised>
            <ReactFileReader fileTypes={[".json"]} handleFiles={this.handleFiles.bind(this)}>
              <Button>
                Load from file
              </Button>
            </ReactFileReader>
          </Segment>
        </Grid.Column>

        <Grid.Column>
          <Segment raised>
            <Button onClick={() => download( JSON.stringify(this.props.state), "project.json", "application/json" )} >
              Save to file
            </Button>
          </Segment>
        </Grid.Column>
      </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
   state: state
  };
};

export default connect(mapStateToProps)(Project)
