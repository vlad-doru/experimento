import React from 'react'
import { connect } from 'react-redux'
import * as repositoryActions from '../../redux/modules/repository'

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
        Experiments: {JSON.stringify(Object.keys(this.props.data.experiments))}
      </div>
    )
  }
}

export default ListExperiments
