import React from 'react'
import { IndexLink, Link } from 'react-router'
import AppBar from 'material-ui/AppBar';

import classes from './Header.scss'

import Paper from 'material-ui/Paper';
import ExperimentoLogo from '../../static/logo.jpg'

class Header extends React.Component {
  render () {
    return (
      <div>
      <AppBar zDepth={2}>
        <Paper circle={true} zDepth={2} style={{
          width: 120,
          height: 120,
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          marginTop: 10,
        }}>
            <img
              alt='Experiment Logo'
              src={ExperimentoLogo}
              style={{
                width: 80,
                marginTop: 20,
              }}/>
        </Paper>
      </AppBar>
      </div>
    )
  }
}

export default Header
