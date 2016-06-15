import React from 'react'
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import VariablesList from './VariablesList';

export class VariableInfo extends React.Component {
  constructor(props) {
    super();

    this._isValidName = this._isValidName.bind(this);
    this._isValid = this._isValid.bind(this);
    this._updateInput = this._updateInput.bind(this);
    this._addVariable = this._addVariable.bind(this);

    this.state = {
      variableInput: props.variableInput || '',
      variables: props.variables || {},
      valid: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.variables != nextProps.variables) {
      this.setState({variables: nextProps.variables});
    }
    if (this.props.variableInput != nextProps.variableInput) {
      this.setState({variableInput: nextProps.variableInput});
    }
  }

  _isValidName(name) {
    if (!name) {
      return false;
    }
    if (this.state.variables
        && this.state.variables
        && this.state.variables.hasOwnProperty(name)) {
      return false;
    }
    return true;
  }

  _isValid(obj) {
    if (!obj) {
      return false;
    }
    // TODO: Check for at least one variable defined.
    return false;
  }

  _updateInput(value) {
    let newState = {
      ...this.state,
      variableInput: value,
    }
    if (this.props && this.props.onChange) {
      this.props.onChange(newState);
    }
    this.setState(newState);
  }

  _addVariable() {
    let newVariables = {
      ...this.state.variables,
      [this.state.variableInput]: [],
    };
    let newState = {
      variables: newVariables,
      variableInput: '',
      valid: this._isValid(newVariables)
    }
    if (this.props && this.props.onChange) {
      this.props.onChange(newState);
    }
    this.setState(newState);
  }

  render () {
    return (
      <div>
        <TextField
            hintText="Variable Name"
            floatingLabelText="Variable"
            floatingLabelFixed={true}
            fullWidth={true}
            value={this.state.variableInput}
            onChange={(e, variableInput) => this._updateInput(variableInput)}
          /><br/>
        <FloatingActionButton
            disabled={!this._isValidName(this.state.variableInput)}
            mini={true}
            style={{
              position: 'absolute',
              right: 10,
              top: 20,
            }}
            onMouseUp={this._addVariable}>
          <ContentAdd />
        </FloatingActionButton>
        <br/>

        <VariablesList variables={this.state.variables} />

      </div>
    )
  }
}

export default VariableInfo
