import React, { Component } from 'react';
import { connect } from 'react-redux'

class HelloWorld extends Component {
  
  render() {
    return (
      <div>
        Hello world
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

export default connect(mapStateToProps)(HelloWorld)
