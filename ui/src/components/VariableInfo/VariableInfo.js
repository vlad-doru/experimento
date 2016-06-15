import React from 'react'
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

export class ExperimentVariables extends React.Component {
  constructor(props) {
    super();

    this._isValid = this._isValid.bind(this);
    this.state = {
      variables: props.variables || {
        id: '',
      },
      valid: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.variables != nextProps.variables) {
      this.setState({variables: nextProps.variables})
    }
  }

  _isValid(obj) {
    if (!obj) {
      return false;
    }
    if (!obj.id || obj.id == '') {
      return false;
    }
    return true;
  }

  _updateState(key, value) {
    let newVariables = {
      ...this.state.variables,
      [key]: value,
    };
    let newState = {
        variables: newVariables,
        valid: this._isValid(newVariables),
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
            value={this.state.variables.id}
            onChange={(e, input) => this._updateState('id', input)}
          /><br/>
        <FloatingActionButton mini={true} style={{
          position: 'absolute',
          right: 10,
          top: 20,
        }}>
            <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }
}

export default ExperimentVariables
