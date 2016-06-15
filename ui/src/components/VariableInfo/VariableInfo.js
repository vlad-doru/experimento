import React from 'react'
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ActionList from 'material-ui/svg-icons/action/list';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import NavigationMoreVert from 'material-ui/svg-icons/navigation/more-vert';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import {blue500, darkBlack, lightBlack} from 'material-ui/styles/colors';
import __ from 'lodash';

export class ExperimentVariables extends React.Component {
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

    let vars =  __.map(this.state.variables,
      (value, key) => {
        console.log(key, value)
        return (
          <ListItem
            style={{
              backgroundColor: 'white',
            }}
            innerDivStyle={{
              margin: '50px 1-px',
              border: '1px solid white',
            }}
            leftAvatar={<Avatar icon={<ActionAssignment />}/>}
            rightIcon={<NavigationMoreVert />}
            primaryText={key}
            secondaryText={
              <p>
                <span style={{color: darkBlack}}>
                  {value.length ? "Possible values: " :
                                  "No values were defined"}
                </span><br />
                {value.join(", ")}
              </p>
            }
          />
        )
      }
    );

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

        <div style={{textAlign: 'left'}}>
        <List style={{border: 'none'}}>
        <Subheader inset={true}>Variables</Subheader>
          {vars}
        </List>
        </div>

      </div>
    )
  }
}

export default ExperimentVariables
