import React from 'react'
import List from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import {blue500, darkBlack, lightBlack} from 'material-ui/styles/colors';
import __ from 'lodash';

import VariablesListItem from './VariablesListItem';

export class VariablesList extends React.Component {
  constructor(props) {
    super();

    this._handleDelete = this._handleDelete.bind(this);
    this._handleUpdate = this._handleUpdate.bind(this);

    this.state = {
      variables: props.variables || {},
    };
  }

  _handleDelete(name) {
    let newVariables = {
      ...this.state.variables,
    }
    delete newVariables[name];
    if (this.props.onChange) {
      this.props.onChange(newVariables);
    }
    this.setState({variables: newVariables});
  }

  _handleUpdate(name, values) {
    console.log("UPDATE", name, values)
    let newVariables = {
      ...this.state.variables,
      [name]: values,
    }
    if (this.props.onChange) {
      this.props.onChange(newVariables);
    }
    this.setState({variables: newVariables});
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.variables != nextProps.variables) {
      this.setState({variables: nextProps.variables});
    }
  }

  render () {

    let vars =  __.map(this.state.variables,
      (values, key) => <VariablesListItem
        name={key} key={key} values={values}
        onDelete={this._handleDelete}
        onUpdate={this._handleUpdate}/>
    );

    return (
      <div style={{textAlign: 'left'}}>
        <List style={{border: 'none'}}>
          {vars}
        </List>
      </div>
    )
  }
}

export default VariablesList
