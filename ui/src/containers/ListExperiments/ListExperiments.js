import React from 'react'
import { connect } from 'react-redux'
import * as repositoryActions from '../../redux/modules/repository'

import ExperimentOverview from '../../components/ExperimentOverview'
import TextField from 'material-ui/TextField';
import ActionSearch from 'material-ui/svg-icons/action/search';

import __ from 'lodash';

@connect(
  state => ({
    list: state.repository.list,
    term: state.repository.term,
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
        <div style={{display: 'inline-block'}}>
          <ActionSearch/>
        </div>
        <TextField
            hintText="Search"
            floatingLabelText="Search"
            value={this.props.term}
            style={{width: '95%'}}
            onChange={(e, input) => this.props.searchExperiments(input)}
          /><br/>
        {__.map(this.props.list, (data) => {
           return (
          <ExperimentOverview
              key={data.info.id}
              data={data}
              actions={true}
              onDelete={(id) => this.props.dropExperiment(id)} />
        )})}
      </div>
    )
  }
}

export default ListExperiments
