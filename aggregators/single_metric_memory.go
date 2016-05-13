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
	// Launch a gorutine that will handle the aggregation part.
	go func() {
		i := 0
		localMetricsSum := expGroupMetric{}
		localMetricsCount := expGroupMetric{}
		for true {
			tv := <-agg.c
			localMetricsSum[tv.e][tv.g] += tv.v
			localMetricsCount[tv.e][tv.g]++
			i++
			// Update the global memory aggregator tables on batchSize.
			if i&batchSize == 0 {
				agg.mutex.Lock()
				for e, m := range localMetricsSum {
					for g := range m {
						agg.metricsSum[e][g] += localMetricsSum[e][g]
						agg.metricsCount[e][g] += localMetricsCount[e][g]
					}
				}
				agg.mutex.Unlock()
			}
		}
	}()
	return agg
}

// AddMetric adds the specificed value to the metric of the specificed groupID.
func (agg *SingleMetricMemoryAggregator) AddMetric(expID, groupID string, value float64) {
	agg.c <- tuple{
		e: expID,
		g: groupID,
		v: value,
	}
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
