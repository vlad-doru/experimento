import React from 'react'
import { connect } from 'react-redux'
import * as repositoryActions from '../../redux/modules/repository'

import ExperimentOverview from '../../components/ExperimentOverview'
import OfflineSimulation from '../../components/OfflineSimulation'
import ExperimentExample from '../../components/ExperimentExample'

import __ from 'lodash';

@connect(
  state => ({
    data: state.repository.data,
  }),
  repositoryActions)
class ExperimentData extends React.Component {
  constructor(props) {
    super();

    this.state = {}
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.data) {
      this.setState({
        data: nextProps.data[nextProps.params.id],
      })
    }
  }

  componentWillMount = () => {
    this.props.getExperiments();
  }

  render () {
    if (!this.state.data) {
      return (<div></div>)
    }
    return (
      <div>

        <ExperimentOverview data={this.state.data} />
        <OfflineSimulation data={this.state.data} actions={false}/>
        <ExperimentExample data={this.state.data} />
      </div>
    )
  }
}

export default ExperimentData
