package aggregators

import (
	"sync"
)

type tuple struct {
	e string
	g string
	v float64
}

type expGroupMetric map[string]map[string]float64

type SingleMetricMemoryAggregator struct {
	// experiment_id -> group_id -> value
	metricsSum   expGroupMetric
	metricsCount expGroupMetric
	c            chan tuple
	mutex        sync.RWMutex
}

const batchSize = (1 << 10) - 1

func NewSingleMetricMemoryAggregator() *SingleMetricMemoryAggregator {
	agg := &SingleMetricMemoryAggregator{
		expGroupMetric{},
		expGroupMetric{},
		make(chan tuple, batchSize), // buffer size of 1000 metrics
		sync.RWMutex{},
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

func (agg *SingleMetricMemoryAggregator) Efficiency(expID string) (map[string]float64, error) {
	result := map[string]float64{}
	agg.mutex.RLock()
	if len(agg.metricsSum[expID]) == 0 {
		return nil, nil
	}
	for g := range agg.metricsSum[expID] {
		result[g] = agg.metricsSum[expID][g] / agg.metricsCount[expID][g]
	}
	agg.mutex.RUnlock()
	return result, nil
}
