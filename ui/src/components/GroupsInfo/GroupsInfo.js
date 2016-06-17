import React from 'react'
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import __ from 'lodash';

export class GroupsInfo extends React.Component {
  constructor(props) {
    super();

    this.state = {
      groupInput: props.groupInput || '',
      groups: props.groups || {},
      valid: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.groups != nextProps.groups) {
      this.setState({groups: nextProps.groups});
    }
    if (this.props.groupInput != nextProps.groupInput) {
      this.setState({groupInput: nextProps.groupInput});
    }
  }

  _isValidName = (name) => {
    if (!name) {
      return false;
    }
    if (this.state.groups
        && this.state.groups
        && this.state.groups.hasOwnProperty(name)) {
      return false;
    }
    return true;
  }

  _updateInput = (value) => {
    let newState = {
      ...this.state,
      groupInput: value,
    }
    if (this.props && this.props.onChange) {
      this.props.onChange(newState);
    }
    this.setState(newState);
  }

  _addGroup = () => {
    // TODO: Create the group with sensible defaults here.
    console.log("new group", this.state.groupInput);
  }

  render () {
    return (
      <div>
        <TextField
            hintText="Group Name"
            floatingLabelText="Group"
            floatingLabelFixed={true}
            fullWidth={true}
            value={this.state.groupInput}
            onChange={(e, x) => this._updateInput(x)}
          /><br/>
        <FloatingActionButton
            disabled={!this._isValidName(this.state.groupInput)}
            mini={true}
            style={{
              position: 'absolute',
              right: 10,
              top: 20,
            }}
            onMouseUp={this._addGroup}>
          <ContentAdd />
        </FloatingActionButton>
        <br/>
      </div>
    )
  }
}

export default GroupsInfo
