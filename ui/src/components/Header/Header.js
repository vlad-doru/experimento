import React from 'react'
import { IndexLink } from 'react-router'
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';

import List from 'material-ui/svg-icons/action/list';
import Add from 'material-ui/svg-icons/content/add';

import classes from './Header.scss'

import Paper from 'material-ui/Paper';
import ExperimentoLogo from '../../static/logo.jpg'

import __ from 'lodash';

class Header extends React.Component {
  constructor() {
    super()

    this.state = {
      open: false,
    }

    this.routes = [
      {
        path: "/",
        text: "Experiments",
        icon: <List/>
      },
      {
        path: "/create",
        text: "New Experiment",
        icon: <Add/>
      }
    ]
  }

  render () {
    return (
      <div>
      <AppBar
          zDepth={2}
          onLeftIconButtonTouchTap={() => this.setState({open: true})}>
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}>

          {__.map(this.routes, (route) => {
            return (
              <IndexLink key={route.path} to={route.path} style={{
                  textDecoration: 'none',
                }}>
                <MenuItem primaryText={route.text}
                  style={{
                    backgroundColor: 'white',
                  }}
                  innerDivStyle={{
                    backgroundColor: 'white',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.15)',
                  }}
                  onTouchTap={() => this.setState({open: false})}
                  rightIcon={route.icon}/>
              </IndexLink>
            )
          })}
        </Drawer>
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
                marginLeft: 20,
              }}/>
        </Paper>
      </AppBar>
      </div>
    )
  }
}

export default Header
