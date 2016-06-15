import React from 'react'
import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ActionList from 'material-ui/svg-icons/action/list';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import NavigationMoreVert from 'material-ui/svg-icons/navigation/more-vert';
import Avatar from 'material-ui/Avatar';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {blue500, red500, darkBlack, lightBlack} from 'material-ui/styles/colors';
import __ from 'lodash';

export class VariablesListItem extends React.Component {
  constructor(props) {
    super();

    this.state = {
      open: false,
      values: props.values,
      newValue: '',
    };
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this._addValue();
    this.setState({open: false});
  };

  _addValue = () => {
    if (!this.state.newValue) {
      return;
    }
    const newValues = __.uniq([
      ...this.state.values,
      this.state.newValue,
    ])
    const newState = {
      ...this.state,
      values: newValues,
      newValue: '',
    }
    this.props.onUpdate &&
    this.props.onUpdate(this.props.name, newValues);
    this.setState(newState);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.values != nextProps.values) {
      this.setState({values: nextProps.values});
    }
  }

  render () {
    const actions = [
      <RaisedButton
          label="Done"
          primary={true}
          backgroundColor={blue500}
          style={{
            color: 'white',
            marginRight: 10,
          }}
          onMouseUp={() => this.handleClose()}
        />,
      <RaisedButton
          label="Delete variable"
          secondary={true}
          backgroundColor={red500}
          style={{
            color: 'white',
          }}
          icon={<ActionDelete />}
          onMouseUp={() => this.props.onDelete &&
                           this.props.onDelete(this.props.name)}
        />
    ];

    return (
      <div>
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
          primaryText={this.props.name}
          secondaryTextLines={2}
          secondaryText={
            <p>
              <span style={{color: darkBlack}}>
                {this.state.values.length ? "Possible values: " :
                                "No values were defined"}
              </span><br />
              {this.state.values.join(", ")}
            </p>
          }
          onTouchTap={() => this.setState({open: true})}
        />
        <Dialog
           title={"Variable: " + this.props.name}
           actions={actions}
           modal={false}
           open={this.state.open}
           onRequestClose={this.handleClose}>
         <TextField
             hintText="Possible variable value"
             floatingLabelText="Value"
             floatingLabelFixed={true}
             fullWidth={true}
             value={this.state.newValue}
             onChange={(e, x) => this.setState({newValue: x})}
           /><br/>
         <FloatingActionButton
            mini={true}
            disabled={!this.state.newValue}
            style={{
              marginRight: 10,
              position: 'absolute',
              right: '10',
              top: '95',
            }}
            onMouseUp={this._addValue}
          >
           <ContentAdd />
         </FloatingActionButton>
         </Dialog>
      </div>
    )
  }
}

export default VariablesListItem
