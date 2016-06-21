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
import { Line as LineChart } from "react-chartjs";
import ChartLegend from "./ChartLegend";


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
    if (this.drawTimeout) {
      clearTimeout(this.drawTimeout);
    }
    this.drawTimeout = setTimeout(() => {
      this.setState({
        validSimulation: this._validSimulation(nextProps.simulation, nextProps.data),
      })
    }, 500);
  }

  _constructData = (simulation, generated) => {
    const assigner = simulation.assigner;

    const groups = Object.keys(generated);
    const groups_count = Object.keys(generated).length;
    let colors = [Colors.blue500, Colors.lightGreen500, Colors.teal500,
              Colors.lime500, Colors.amber500, Colors.orange500]

    let groupPicked = {};
    let groupMeans = [];
    let datasets = [];
    __.times(groups_count, (i) => {
      groupPicked[i] = 0;
      groupMeans[i] = 1;
      datasets.push({
        data:[],
        label: groups[i],
        fillColor: "transparent",
        strokeColor: colors[i],
        pointColor: colors[i],
      })
    })
    let labels = []
    let assign

    if (assigner == "ab") {
      // Make A/B Assignments over here.
      assign = (count, means) => __.random(0, count - 1)
    }
    if (assigner == "multiarm") {
      // Multiarm Bandit assignments.
      assign = (count, means) => {
        const aux = Math.random();
        if (aux < 0.9) {
          // Exploatation phase.
          const max = __.max(means)
          let candidates = []
          __.times(count, (i) => {
            if (means[i] == max) {
              candidates.push(i);
            }
          })
          return __.head(__.shuffle(candidates));
        } else {
          // Exploration phase.
          return __.random(0, count - 1)
        }
      }
    }
    if (assigner == "experimento") {
      assign = (count, means) => {
        const aux = Math.random();
        if (aux < 0.8) {
          // Probabilistic phase.
          const prob = Math.random();
          const s = __.sum(means)
          let acc = 0
          let result
          __.times(count, (i) => {
            let prevAcc = acc
            acc += (means[i] / s)
            if (prob < acc && prob > prevAcc) {
              result = i
            }
          })
          return result;
        } else if (aux < 0.9) {
          // Exploration phase.
          return __.random(0, count - 1)
        } else {
          // Exploatation phase.
          const max = __.max(means)
          let candidates = []
          __.times(count, (i) => {
            if (means[i] == max) {
              candidates.push(i);
            }
          })
          return __.head(__.shuffle(candidates));
        }
      }
    }

    let updatedMeans = [
      ...groupMeans,
    ]

    __.times(MAX_SAMPLES, (x) => {
      // Pick the group
      const i = assign(groups_count, updatedMeans)
      // Put it where it is supposed to b
      const value = generated[groups[i]][x]
      // Increment number of elements picked.
      groupPicked[i] += 1
      groupMeans[i] += (value - groupMeans[i])/groupPicked[i]

      // Push to graph every 1K steps.
      if (x && x % 1000 == 0) {
        labels.push((x / 1000) + "K")
        __.times(groups_count, (i) => {
          datasets[i].data.push(Math.round(1000 * groupPicked[i] / x) / 1000)
        })
        // Update the means
        updatedMeans = [
          ...groupMeans,
        ]
      }
    })
    this.setState({
      chartData: {
        datasets,
        labels,
      },
    })
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

          {this.state.validSimulation ?
            <div>
            <div style={{
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'center',
                marginTop: 10,}}>
              Groups ratio
            </div>
            <LineChart
              ref="ratioChart"
              data={this.state.chartData}
              options={{
                legend: {
                  display: true,
                },
                title: {
                  display: true,
                  text: "Groups Ratio"
                },
              }}
              width="700"
              height="250"/>
            <ChartLegend datasets={this.state.chartData.datasets}/>
            </div>
            : <div></div>
          }

        </CardText>
      </Card>
    )
  }
}

export default OfflineSimulation
