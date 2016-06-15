import React from 'react'
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
import {blue500, darkBlack, lightBlack} from 'material-ui/styles/colors';
import __ from 'lodash';

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
      (value, key) => {
        return (
          <ListItem
            style={{
              backgroundColor: 'white',
            }}
            key={key}
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
