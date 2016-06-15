import React from 'react'
import List from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import {blue500, darkBlack, lightBlack} from 'material-ui/styles/colors';
import __ from 'lodash';

import VariablesListItem from './VariablesListItem';

export class VariablesList extends React.Component {
  constructor(props) {
    super();

    this.state = {
      variables: props.variables || {},
      valid: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.variables != nextProps.variables) {
      this.setState({variables: nextProps.variables});
    }
  }

  render () {

    let vars =  __.map(this.state.variables,
      (values, key) => <VariablesListItem
        name={key} key={key} values={values} />
    );

    return (
      <div style={{textAlign: 'left'}}>
        <List style={{border: 'none'}}>
        <Subheader inset={true}>Variables</Subheader>
          {vars}
        </List>
      </div>
    )
  }
}

export default VariablesList
