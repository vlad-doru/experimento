import React from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import NewExperiment from '../../containers/NewExperiment';

class HomeView extends React.Component {
  render () {
    return (
      <div>
        <NewExperiment />
      </div>
    )
  }
}

export default {
  component: HomeView
}
