package aggregators

// TODO: Enable concurrency in this package.

type tuple struct {
	e string
	g string
	v float64
}

type expGroupMetric map[string]map[string]float64

// SingleMetricMemoryAggregator represents a very simple and basic
// implementation of the aggregator interface.
//
// Note: This implementation is not designed for concurrent use.
type SingleMetricMemoryAggregator struct {
	// experiment_id -> group_id -> value
	metricsSum   expGroupMetric
	metricsCount expGroupMetric
	c            chan tuple
}

const batchSize = (1 << 10) - 1

// NewSingleMetricMemoryAggregator returns a new object of the type
// SingleMetricMemoryAggregator which is designed mainly for testing.
func NewSingleMetricMemoryAggregator() *SingleMetricMemoryAggregator {
	agg := &SingleMetricMemoryAggregator{
		expGroupMetric{},
		expGroupMetric{},
		make(chan tuple, batchSize), // buffer size of 1000 metrics
	}
	return agg
}

// AddMetric adds the specificed value to the metric of the specificed groupID.
func (agg *SingleMetricMemoryAggregator) AddMetric(expID, groupID string, value float64) {
	_, ok := agg.metricsSum[expID]
	if ok == false {
		agg.metricsSum[expID] = make(map[string]float64)
		agg.metricsCount[expID] = make(map[string]float64)
	}
	agg.metricsSum[expID][groupID] += value
	agg.metricsCount[expID][groupID]++
}

// Efficiency gets efficiencies for all groups, for a certain experiment id.
func (agg *SingleMetricMemoryAggregator) Efficiency(expID string) (map[string]float64, error) {
	result := map[string]float64{}
	if len(agg.metricsSum[expID]) == 0 {
		return nil, nil
	}
	for g := range agg.metricsSum[expID] {
		result[g] = agg.metricsSum[expID][g] / agg.metricsCount[expID][g]
	}
	return result, nil
}
