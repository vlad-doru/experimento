import React from 'react'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { Link } from 'react-router'
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import FileCloud from 'material-ui/svg-icons/file/cloud';
import ActionSearch from 'material-ui/svg-icons/action/search';
import * as Colors from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux'
import * as examplesActions from '../../redux/modules/examples';

import __ from 'lodash';

@connect(
  state => ({
    examples: state.examples.examples,
  }),
  examplesActions)
export class VariableInfo extends React.Component {
  constructor(props) {
    super();
  }

  componentWillReceiveProps(nextProps) {}

  render () {

    const info = this.props.data.info;
    const examples = this.props.examples[info.id];

    return (
      <div>
      <Card style={{marginBottom: 10}} initiallyExpanded={true}>
        <CardHeader
          title={"Query Online"}
          subtitle={"Test out the results for various entites"}
          avatar={
            <div style={{marginTop: 5, display: 'inline-block'}}>
              <ActionSearch color={Colors.lightBlack}/>
            </div>}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText expandable={true}>
          <TextField
            fullWidth={true}
            hintText="Enter multiple entities on multiple lines"
            floatingLabelText="Examples"
            multiLine={true}
            rows={1}
            rowsMax={10}
            value={examples}
            onChange={(e, input) => this.props.setExamples(info.id, input)}
            /><br />
        </CardText>
        <CardActions expandable={true}
            style={{height: 55}}>
          <RaisedButton
            label="Compute"
            backgroundColor={Colors.blue500}
            onMouseUp={() => this.props.queryExamples(examples, info.id)}
            labelColor={Colors.white}
            style={{
              float: 'right',
            }}
            icon={<FileCloud />}/>
        </CardActions>
      </Card>
      </div>
    )
  }
}

export default VariableInfo
