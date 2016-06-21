import React from 'react';

import __ from 'lodash';

var ChartLegend = React.createClass({
  propTypes: {
    datasets: React.PropTypes.array.isRequired
  },

  render: function () {
    var datasets = __.map(this.props.datasets, (ds) =>
        <div style={{
          fontWeight: 'bold',
          textAlign: 'center',
          color: ds.strokeColor,
          width: (100 / this.props.datasets.length) + "%",
          display: 'inline-block',
        }}>
          { ds.label }
        </div>
    );

    return (
      <div style={{marginTop: 10}}>
        { datasets }
      </div>
    );
  }
});

export default ChartLegend;
