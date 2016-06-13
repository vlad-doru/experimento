package aggregators

// TODO: Enable concurrency in this package.

type tuple struct {
	e string
	g string
	v float64
}

type metricMap map[string]map[string]float64

// SingleMetricMemoryAggregator represents a very simple and basic
// implementation of the aggregator interface.
//
// Note: This implementation is not designed for concurrent use.
type SingleMetricMemoryAggregator struct {
	// experiment_id -> group_id -> value
	mean  metricMap // mean of the metric
	count metricMap // number of values recorder
	m2    metricMap // used for computing the variance online
	c     chan tuple
}

const batchSize = (1 << 10) - 1

// NewSingleMetricMemoryAggregator returns a new object of the type
// SingleMetricMemoryAggregator which is designed mainly for testing.
func NewSingleMetricMemoryAggregator() *SingleMetricMemoryAggregator {
	agg := &SingleMetricMemoryAggregator{
		metricMap{},
		metricMap{},
		metricMap{},
		make(chan tuple, batchSize), // buffer size of 1000 metrics
	}
	return agg
}

// AddMetric adds the specificed value to the metric of the specificed groupID.
func (agg *SingleMetricMemoryAggregator) AddMetric(expID, groupID string, value float64) {
	_, ok := agg.mean[expID]
	if ok == false {
		agg.mean[expID] = map[string]float64{groupID: value}
		agg.count[expID] = map[string]float64{groupID: 1}
		agg.m2[expID] = map[string]float64{groupID: value * value}
		return
	}
	n := agg.count[expID][groupID]
	mean := agg.mean[expID][groupID]
	m2 := agg.m2[expID][groupID]
	delta := value - mean
	n++
	mean += delta / n
	m2 += delta * (value - mean)
	agg.count[expID][groupID] = n
	agg.mean[expID][groupID] = mean
	agg.m2[expID][groupID] = m2
}

// Efficiency gets efficiencies for all groups, for a certain experiment id.
func (agg *SingleMetricMemoryAggregator) Efficiency(expID string) (map[string]float64, error) {
	result := map[string]float64{}
	if len(agg.mean[expID]) == 0 {
		return nil, nil
	}
	for g, v := range agg.mean[expID] {
		result[g] = v
	}
	return result, nil
}

// Results encapsulates data about a group in an experiment
type Results struct {
	Mean     float64
	Variance float64
	Samples  float64
}

// GetExpResults returns a mapping from a group id to a results structure
// for the selected experiment.
func (agg *SingleMetricMemoryAggregator) GetExpResults(expID string) map[string]Results {
	r := map[string]Results{}
	for groupID, mean := range agg.mean[expID] {
		samples := agg.count[expID][groupID]
		variance := 0.0
		if samples > 1 {
			variance = agg.m2[expID][groupID] / (samples - 1)
		}
		r[groupID] = Results{
			Mean:     mean,
			Variance: variance,
			Samples:  samples,
		}
	}
	return r
}
