import React from 'react'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { Link } from 'react-router'
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import ActionAssessment from 'material-ui/svg-icons/action/assessment';
import ActionDone from 'material-ui/svg-icons/action/done';
import * as Colors from 'material-ui/styles/colors';
import { connect } from 'react-redux'
import * as simulationActions from '../../redux/modules/simulation'

import SimulationType from './SimulationType';

import Moment from 'moment';
import __ from 'lodash';

@connect(
  state => ({
    simulation: state.simulation.simulation,
  }),
  simulationActions)
export class OfflineSimulation extends React.Component {
  constructor(props) {
    super();
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
          title={"Offline Simulation"}
          avatar={
            <div style={{marginTop: 5, display: 'inline-block'}}>
              <ActionAssessment color={Colors.lightBlack}/>
            </div>}
          subtitle={"Test various scenarios"}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <Divider style={{marginBottom: 10}}/>
          <SimulationType
            onChange={(params) => this.props.setSimulation(params)}
            simulation={this.props.simulation}
            groups={groups}/>
        </CardText>
        <CardActions expandable={true}
            style={{height: 55}}>
          <RaisedButton
            label="Simulate"
            backgroundColor={Colors.blue500}
            labelColor={Colors.white}
            style={{
              float: 'right',
            }}
            icon={<ActionDone />}/>
        </CardActions>
      </Card>
    )
  }
}

export default OfflineSimulation
