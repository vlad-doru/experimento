import React from 'react'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { Link } from 'react-router'
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ActionTrendingUp from 'material-ui/svg-icons/action/trending-up';
import * as Colors from 'material-ui/styles/colors';

import Moment from 'moment';
import __ from 'lodash';

export class ExperimentOverview extends React.Component {
  constructor(props) {
    super();
  }

  _subtitle = (info, vars, groups) => {
    const percent = info.size * 100;
    const groups_count = Object.keys(groups).length;
    const vars_count = Object.keys(vars).length;
    return "Size " + percent + "%, " +
           groups_count + " groups, " +
           vars_count + (vars_count == 1 ? " variable" : " variables")
  }

  render () {
    const info = this.props.data.info;
    const variables = this.props.data.variables_info;
    const groups = this.props.data.groups_info;
    const whitelist = this.props.data.whitelist;

    let vars_index = 0;
    let groups_index = 0;

    return (
      <Card style={{marginBottom: 10}}>
        <CardHeader
          title={"Experiment: " + info.id}
          subtitle={
            <div>
              {this._subtitle(info, variables, groups)} <br/>
              Started: {Moment(parseInt(info.started)).format('DD MMMM HH:MM, YYYY')}
            </div>
          }
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <Divider style={{marginBottom: 10}}/>
          <strong>Size: </strong> {info.size * 100 + "%"}<br/>
          <strong>Seed:</strong> {info.seed_value} <br/>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
          <strong> Variables: </strong>
          {__.map(variables, (data, name) => {
            return(
              <div key={name} style={{marginLeft: 30}}>
                <strong>#{++vars_index} Var {name}: </strong> {data.options.join(", ")}
              </div>
            )
          })}
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
          <div style={{marginBottom: 10}}>
            <strong> Groups: </strong>
          </div>
          {__.map(groups, (data, name) => {
            return(
              <div key={name} style={{marginLeft: 30}}>
                <strong>#{++groups_index} Group {name}</strong>
                  {__.map(data.variables, (value, variable) => {
                    return (
                      <div key={variable} style={{marginLeft:30}}>
                        <strong>{variable}: </strong> {value}
                      </div>
                    )
                  })}
                {groups_index < Object.keys(groups).length ?
                  (<Divider style={{marginTop: 10, marginBottom: 10}}/>)
                  : undefined
                }
              </div>
            )
          })}
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
          <div style={{marginBottom: 10}}>
            <strong> Whitelist: </strong>
          </div>
          {Object.keys(whitelist).length ?
            __.map(whitelist, (group, entity) => {
              return (
                <div key={entity} style={{marginLeft: 30}}>
                  <strong>• {entity}</strong> => {group}
                </div>
            )})
          : "No entity has been whitelisted"}
        </CardText>
        {this.props.actions ?
          <CardActions expandable={true}
              style={{height: 55}}>
            <RaisedButton
              label="Delete"
              backgroundColor={Colors.red500}
              labelColor={Colors.white}
              style={{
                float: 'right',
              }}
              onMouseUp={() =>
                this.props.onDelete && this.props.onDelete(info.id)}
              icon={<ActionDelete />}/>
            <Link to={'/data/' + info.id} style={{
                    textDecoration: 'none',
                    float: 'right',
                    marginRight: 10,
                  }}>
              <RaisedButton
                label="Data"
                backgroundColor={Colors.blue500}
                labelColor={Colors.white}
                icon={<ActionTrendingUp />}/>
            </Link>
          </CardActions>
        : <div></div>
        }
      </Card>
    )
  }
}

export default ExperimentOverview
