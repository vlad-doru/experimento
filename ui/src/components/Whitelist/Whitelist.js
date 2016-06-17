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

export class Whitelist extends React.Component {
  constructor(props) {
    super();

    this.state = {
      whitelistInput: props.whitelistInput,
      whitelistGroup: props.whitelistGroup,
      whitelist: props.whitelist || {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.whitelist != nextProps.whitelist) {
      this.setState({whitelist: nextProps.whitelist});
    }
    if (this.props.whitelistInput != nextProps.whitelistInput) {
      this.setState({whitelistInput: nextProps.whitelistInput});
    }
    if (this.props.whitelistGroup != nextProps.whitelistGroup) {
      this.setState({whitelistGroup: nextProps.whitelistGroup});
    }
  }

  _isValid = () => {
    return this.state.whitelistInput && this.state.whitelistGroup;
  }

  _updateState = (newState) => {
    if (this.props && this.props.onChange) {
      this.props.onChange(newState);
    }
    this.setState(newState);
  }

  _updateInput = (value) => {
    this._updateState({
      ...this.state,
      whitelistInput: value,
    })
  }

  _updateGroup = (group) => {
    this._updateState({
      ...this.state,
      whitelistGroup: group,
    })
  }

  _renew = (key) => {
    let newWhitelist = {
      ...this.state.whitelist,
    }
    delete newWhitelist[key]
    this._updateState({
      whitelistInput: key,
      whitelistGroup: this.state.whitelist[key],
      whitelist: newWhitelist,
    })
  }

  _addException = () => {
    console.log(this.state);
    this._updateState({
      whitelistInput: '',
      whitelistGroup: undefined,
      whitelist: {
        ...this.state.whitelist,
        [this.state.whitelistInput]: this.state.whitelistGroup,
      }
    })
  }

  render () {
    return (
      <div>
        <TextField
            hintText="Entity Name"
            floatingLabelText="Entity"
            floatingLabelFixed={true}
            fullWidth={true}
            value={this.state.whitelistInput}
            onChange={(e, x) => this._updateInput(x)}
          /><br/>
        <FloatingActionButton
            disabled={!this._isValid()}
            mini={true}
            style={{
              position: 'absolute',
              right: 10,
              top: 20,
            }}
            onMouseUp={this._addException}>
          <ContentAdd />
        </FloatingActionButton>
        <br/>
        <div style={{textAlign: 'left'}}>
          <SelectField
             value={this.state.whitelistGroup}
             style={{marginRight: 20, width: '30%'}}
             floatingLabelText={"Group"}
             hintText={"Group"}
             onChange={(event, index, x) => this._updateGroup(x)}
           >
             {__.map(this.props.groups, (_, value) => (
               <MenuItem
                  style={{backgroundColor: 'white'}}
                  innerDivStyle={{
                    border: '1px solid white',
                  }}
                  key={value}
                  value={value}
                  primaryText={value} />
             ))}
           </SelectField>
        </div>
        <List>
        {__.map(this.state.whitelist, (group, entity) => (
          <ListItem
            onTouchTap={() => this._renew(key)}
            style={{
              backgroundColor: 'white',
              textAlign: 'left',
            }}
            innerDivStyle={{
              border: '1px solid white',
              borderBottom: '1px solid #dddddd',
            }}
            rightIcon={<ActionCached />}>
            <div
                style={{
                  fontWeight: 'bold',
                  color: blue500,
                  marginBottom: 10,
                }}>
              Grupul {key}
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

export default Whitelist
