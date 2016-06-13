import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';

export default class App extends Component {
  render() {
    return (
      <div>
        <AppBar title="Experimento" style={}/>

        <div style={{
            maxWidth: '860px',
            marginLeft: 'auto',
            marginRight: 'auto',
            height: '100%',
          }}>
          <img
            src="/src/static/logo.jpg"
            style={{
              height: '140px',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}/>
        </div>
      </div>
    );
  }
}
