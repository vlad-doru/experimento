import React from 'react'
import RaisedButton from 'material-ui/RaisedButton';

import ExperimentoLogo from './assets/logo.jpg'

class HomeView extends React.Component {
  render () {
    return (
      <div>
        <img
          alt='Experiment Logo'
          src={ExperimentoLogo}
          style={{
            maxWidth: 140,
          }}/>
          <br/>
        <RaisedButton label="Default" />
      </div>
    )
  }
}

export default {
  component: HomeView
}
