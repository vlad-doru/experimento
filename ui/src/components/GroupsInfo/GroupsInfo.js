import React from 'react'
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import SelectField from 'material-ui/SelectField';
import ActionCached from 'material-ui/svg-icons/action/cached';
import MenuItem from 'material-ui/MenuItem';
import {blue500, red500, yellow500, darkBlack, lightBlack} from 'material-ui/styles/colors';
import {List, ListItem} from 'material-ui/List';

import __ from 'lodash';

export class GroupsInfo extends React.Component {
  constructor(props) {
    super();

    this.state = {
      groupInput: props.groupInput || '',
      groups: props.groups || {},
      valid: false,
      values: props.values || {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.values != nextProps.values) {
      this.setState({values: nextProps.values});
    }
    if (this.props.groups != nextProps.groups) {
      this.setState({groups: nextProps.groups});
    }
    if (this.props.groupInput != nextProps.groupInput) {
      this.setState({groupInput: nextProps.groupInput});
    }
  }

  _isValidGroup = () => {
    const name = this.state.groupInput;
    if (!name) {
      return false;
    }
    if (this.state.groups
        && this.state.groups
        && this.state.groups.hasOwnProperty(name)) {
      return false;
    }
    return __
      .chain(this.props.variables)
      .map((value, key) => Boolean(this.state.values[key]))
      .min()
      .value();
  }

  _isValid = (newState) => {
    return newState.groups && Object.keys(newState.groups).length > 1;
  }

  _updateState = (state) => {
    const newState = {
      ...state,
      valid: this._isValid(state)
    };
    if (this.props && this.props.onChange) {
      this.props.onChange(newState);
    }
    this.setState(newState);
  }

  _updateInput = (value) => {
    this._updateState({
      ...this.state,
      groupInput: value,
    })
  }

  _updateValue = (key, value) => {
    this._updateState({
      ...this.state,
      values: {
        ...this.state.values,
        [key]: value,
      }
    })
  }

  _renewGroup = (key) => {
    let newGroups = {
      ...this.state.groups,
    }
    delete newGroups[key]
    this._updateState({
      groupInput: key,
      values: this.state.groups[key],
      groups: newGroups,
    })
  }

  _addGroup = () => {
    this._updateState({
      groupInput: '',
      valid: false,
      values: {},
      groups: {
        ...this.state.groups,
        [this.state.groupInput]: this.state.values,
      }
    })
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
            disabled={!this._isValidGroup(this.state.groupInput)}
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
        <div style={{textAlign: 'left'}}>
        {__.map(this.props.variables, (values, key) => (
          <SelectField
             key={key}
             value={this.state.values[key]}
             style={{marginRight: 20, width: '30%'}}
             floatingLabelText={"Variable " + key}
             hintText={"Value for variable " + key}
             onChange={(event, index, x) => this._updateValue(key, x)}
           >
             {__.map(values, (value) => (
               <MenuItem
                  style={{backgroundColor: 'white'}}
                  key={value}
                  innerDivStyle={{
                    border: '1px solid white',
                    backgroundColor: 'white',
                  }}
                  key={value}
                  value={value}
                  primaryText={value} />,
             ))}
           </SelectField>
        ))}
        </div>
        <List style={{textAlign: 'left'}}>
        {__.map(this.state.groups, (values, key) => (
          <ListItem
            onTouchTap={() => this._renewGroup(key)}
            style={{
              textAlign: 'left',
            }}
            style={{backgroundColor: 'white'}}
            innerDivStyle={{
              border: '1px solid white',
              borderBottom: '1px solid #dddddd',
              backgroundColor: 'white',
            }}
            rightIcon={<ActionCached />}>
            <div
                style={{
                  fontWeight: 'bold',
                  color: blue500,
                  marginBottom: 10,
                }}>
              Group {key}
            </div>
            {__.map(values, (value, key) => (
              <div style={{
                marginBottom: 5,
                color: lightBlack,
              }}>
                Variable {key}: {value}
              </div>
            ))}
          </ListItem>
        ))}
        </List>
      </div>
    )
  }
}

export default GroupsInfo
