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

const MAX_SAMPLES = 8000 + 1;

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
    let ratioDatasets = [];
    let meansDatasets = [];
    let newDataset = (i, label) => {
      return {
        data:[],
        label: label || groups[i],
        fillColor: "transparent",
        strokeColor: colors[i],
        pointColor: colors[i],
      }
    };
    __.times(groups_count, (i) => {
      groupPicked[i] = 0;
      groupMeans[i] = 1;
      ratioDatasets.push(newDataset(i))
      meansDatasets.push(newDataset(i))
    })
    // Push for aggregate.
    meansDatasets.push(newDataset(groups_count, "Aggregate"))

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

    let aggregateMean = 0

    __.times(MAX_SAMPLES, (x) => {
      // Pick the group
      const i = assign(groups_count, updatedMeans)
      // Put it where it is supposed to b
      const value = generated[groups[i]][x]
      // Increment number of elements picked.
      groupPicked[i] += 1
      groupMeans[i] += (value - groupMeans[i])/groupPicked[i]
      aggregateMean += (value - aggregateMean)/(x + 1)

      // Push to graph every 1K steps.
      if (x && x % 500 == 0) {
        labels.push((x / 1000) + "K")
        __.times(groups_count, (i) => {
          ratioDatasets[i].data.push(Math.round(1000 * groupPicked[i] / x) / 1000)
        })
        __.times(groups_count, (i) => {
          meansDatasets[i].data.push(groupMeans[i])
        })
        meansDatasets[groups_count].data.push(aggregateMean)
        // Update the means
        updatedMeans = [
          ...groupMeans,
        ]
      }
    })
    this.setState({
      ratioData: {
        datasets: ratioDatasets,
        labels,
      },
      meansData: {
        datasets: meansDatasets,
        labels: [...labels, "Aggregate"],
      },
    })
  }

  _validSimulation = (simulation, data) => {
    const distribution = simulation.distribution;
    let validation
    let generation

    if (distribution == "bernoulli") {
      validation = (name) => Boolean(simulation[data.info.id + "_" + name + "_bernoulli"])
      generation = (name) => {
        const prob = simulation[data.info.id + "_" + name + "_bernoulli"];
        return Number(Math.random() < prob)
      }
    } else if (distribution == "normal") {
      validation = (name) => {
          return Boolean(simulation[data.info.id + "_" + name + "_normalMean"]) &&
                 Boolean(simulation[data.info.id + "_" + name + "_normalSD"]);
      }
      generation = (name) => {
        const mu = simulation[data.info.id + "_" + name + "_normalMean"];
        const sigma = simulation[data.info.id + "_" + name + "_normalSD"];
        const u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
        const v = 1 - Math.random();
        const std_normal = Math.sqrt( -2.0 * Math.log( u ) ) *
                           Math.cos( 2.0 * Math.PI * v );
        return std_normal * Number(sigma) + Number(mu)
      }
    } else {
      return false
    }

    // Validation + generation.
    let valid =  __
      .chain(data.groups_info)
      .map((_, name) => validation(name))
      .min()
      .value();
    if (valid) {
      let generated = __.mapValues(data.groups_info,
        (_, name) => {
          return __.times(MAX_SAMPLES, () => generation(name))
        }
      )
      this._constructData(simulation, generated)
    }
    return valid
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
              data={this.state.ratioData}
              width="700"
              height="250"/>
            <ChartLegend datasets={this.state.ratioData.datasets}/>
            </div>
            : <div></div>
          }

          {this.state.validSimulation ?
            <div>
            <div style={{
                fontWeight: 'bold',
                fontSize: 16,
                textAlign: 'center',
                marginTop: 10,}}>
              Aggregate Metric
            </div>
            <LineChart
              data={this.state.meansData}
              width="700"
              height="250"/>
            <ChartLegend datasets={this.state.meansData.datasets}/>
            </div>
            : <div></div>
          }
        </CardText>
      </Card>
    )
  }
}

export default OfflineSimulation
