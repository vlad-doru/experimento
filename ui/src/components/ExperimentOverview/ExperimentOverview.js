import React from 'react'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';

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
          subtitle={this._subtitle(info, variables, groups)}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <strong>Start date: </strong>
          {Moment(parseInt(info.started)).format('DD MMMM HH:MM, YYYY')}
          <br/>
          <strong>Size: </strong> {info.size * 100 + "%"}<br/>
          <Divider style={{marginTop: 10, marginBottom: 10}}/>
          <strong> Variables: </strong>
          {__.map(variables, (data, name) => {
            return(
              <div style={{marginLeft: 30}}>
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
              <div style={{marginLeft: 30}}>
                <strong>#{++groups_index} Group {name}</strong>
                  {__.map(data.variables, (value, variable) => {
                    return (
                      <div style={{marginLeft:30}}>
                        <strong>{variable}: </strong> {value}
                      </div>
                    )
                  })}
                <Divider style={{marginTop: 10, marginBottom: 10}}/>
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
                <div style={{marginLeft: 30}}>
                  <strong>• {entity}</strong> => {group}
                </div>
            )})
          : "No entity has been whitelisted"}
        </CardText>
        <CardActions expandable={true}>
          // TODO: Delete and inspect results action.
          <FlatButton label="Action1" />
        </CardActions>
      </Card>
    )
  }
}

export default ExperimentOverview
