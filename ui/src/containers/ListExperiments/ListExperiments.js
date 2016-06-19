import React from 'react'
import { connect } from 'react-redux'
import * as repositoryActions from '../../redux/modules/repository'
import ExperimentOverview from '../../components/ExperimentOverview'

import __ from 'lodash';

@connect(
  state => ({
    data: state.repository.data,
  }),
  repositoryActions)
class ListExperiments extends React.Component {
  constructor(props) {
    super();
  }

  componentWillMount = () => {
    this.props.getExperiments();
  }

  render () {
    return (
      <div>
        {__.map(this.props.data, (data, key) => {
           return (
          <ExperimentOverview key={key} data={this.props.data[key]} />
        )})}
      </div>
    )
  }
}

export default ListExperiments
