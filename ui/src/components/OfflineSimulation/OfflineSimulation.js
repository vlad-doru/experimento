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
const LineChart = require("react-chartjs").Line;


import SimulationType from './SimulationType';

import Moment from 'moment';
import __ from 'lodash';

const MAX_SAMPLES = 15000 + 1;

@connect(
  state => ({
    simulation: state.simulation.simulation,
  }),
  simulationActions)
export class OfflineSimulation extends React.Component {
  constructor(props) {
    super();

    this.state = {
      validSimulation: false,
    }
  }

  componentDidMount() {
    this.setState({
      validSimulation: this._validSimulation(this.props.simulation, this.props.data),
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      validSimulation: this._validSimulation(nextProps.simulation, nextProps.data),
    })
  }

  _constructData = (simulation, generated) => {
    const assigner = simulation.assigner;

    const groups = Object.keys(generated);
    const groups_count = Object.keys(generated).length;
    let colors = [Colors.blue500, Colors.lightGreen500, Colors.teal500,
              Colors.lime500, Colors.amber500, Colors.orange500]

    let picked_stats = {};
    let datasets = [];
    __.times(groups_count, (i) => {
      picked_stats[i] = 0;
      datasets.push({
        data:[],
        label: groups[i],
        fillColor: "transparent",
        strokeColor: colors[i],
        pointColor: colors[i],
      })
    })
    let picked = []
    let labels = []

    if (assigner == "ab") {
      // Make A/B Assignments over here.
      __.times(MAX_SAMPLES, (x) => {
        const i = __.random(0, groups_count - 1);
        picked.push(generated[groups[i]][x])
        picked_stats[i] += 1
        if (x && x % 1000 == 0) {
          labels.push((x / 1000) + "K")
          __.times(groups_count, (i) => {
            datasets[i].data.push(Math.round(1000 * picked_stats[i] / x) / 10)
          })
        }
      })
    }
    console.log(picked);
    console.log(__.mean(picked));
    console.log(datasets);
    this.setState({chartData: {
      datasets,
      labels,
    }})
  }

  _validSimulation = (simulation, data) => {
    const distribution = simulation.distribution;
    if (distribution == "bernoulli") {
      let valid =  __
        .chain(data.groups_info)
        .map((group, name) => {
          return Boolean(simulation[data.info.id + "_" + name + "_" + distribution])
        })
        .min()
        .value();
      if (valid) {
        let generated = __.mapValues(data.groups_info,
          (group, name) => {
            const prob = simulation[data.info.id + "_" + name + "_" + distribution];
            return __.times(MAX_SAMPLES, () => Number(Math.random() < prob))
          }
        )
        this._constructData(simulation, generated)
      }
      return valid;
    } else if (distribution == "normal") {
      return __
        .chain(data.groups_info)
        .map((group, name) => {
          return Boolean(simulation[data.info.id + "_" + name + "_normalMean"]) &&
                 Boolean(simulation[data.info.id + "_" + name + "_normalSD"]);
        })
        .min()
        .value();
    }
    return false;
  }

  render () {
    const info = this.props.data.info;
    const variables = this.props.data.variables_info;
    const groups = this.props.data.groups_info;
    const whitelist = this.props.data.whitelist;

    let vars_index = 0;
    let groups_index = 0;

    return (
      <Card style={{marginBottom: 10}} initiallyExpanded={true}>
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
            id={info.id}
            groups={groups}/>

          <Divider style={{marginBottom: 10}}/>

          {this.state.chartData ?
            <LineChart
              data={this.state.chartData}
              options={{
                legend: {
                  display: true,
                },
                title: {
                  display: true,
                  text: "Groups Ratio"
                }
              }}
              width="700"
              height="250"/>
            : <div></div>
          }

        </CardText>
        <CardActions expandable={true}
            style={{height: 55}}>
          <RaisedButton
            label="Simulate"
            disabled={!this.state.validSimulation}
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
