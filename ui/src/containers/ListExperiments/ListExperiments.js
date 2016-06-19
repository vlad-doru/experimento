import React from 'react'
import { connect } from 'react-redux'
import * as repositoryActions from '../../redux/modules/repository'

@connect(
  state => ({
  }),
  repositoryActions)
class ListExperiments extends React.Component {
  constructor(props) {
    super();
  }

  render () {
    return (
      <div>
        Experiment List
      </div>
    )
  }
}

export default ListExperiments
