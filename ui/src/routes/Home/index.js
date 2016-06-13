import React from 'react'
import RaisedButton from 'material-ui/RaisedButton';

import DuckImage from './assets/Duck.jpg'

class HomeView extends React.Component {
  render () {
    return (
      <div>
        <h4>Welcome!</h4>
        <img
          alt='This is a duck, because Redux!'
          src={DuckImage} />
          <br/>
        <RaisedButton label="Default" />
      </div>
    )
  }
}

export default {
  component: HomeView
}
