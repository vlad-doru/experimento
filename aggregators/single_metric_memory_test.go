package aggregators_test

import (
	"github.com/stretchr/testify/assert"
	"github.com/vlad-doru/experimento/aggregators"

	"math/rand"
	"testing"
)

func TestMemoryAggregatorUnif(t *testing.T) {
	agg := aggregators.NewSingleMetricMemoryAggregator()
	const experiment = "experiment"
	const group = "group"

	const ratio = 0.4
	const testSize = 10000
	for i := 0; i < testSize; i++ {
		r := rand.Float64()
		if r < ratio {
			agg.AddMetric(experiment, group, 1.0)
		} else {
			agg.AddMetric(experiment, group, 0.0)
		}
	}
	r := agg.GetExpResults(experiment)
	assert.InEpsilon(t, ratio, r[group].Mean, 0.01, "Incorrect computed mean.")
	assert.InEpsilon(t, ratio*(1-ratio), r[group].Variance, 0.01, "Incorrect computed variance.")
	assert.Equal(t, float64(testSize), r[group].Samples, "Incorrect number of smaples.")
}

func TestMemoryAggregatorNorm(t *testing.T) {
	agg := aggregators.NewSingleMetricMemoryAggregator()
	const experiment = "experiment"
	const group = "group"

	const testSize = 100000
	for i := 0; i < testSize; i++ {
		r := rand.NormFloat64()
		agg.AddMetric(experiment, group, r)
	}
	r := agg.GetExpResults(experiment)
	assert.InDelta(t, 0, r[group].Mean, 0.01, "Incorrect computed mean.")
	assert.InEpsilon(t, 1, r[group].Variance, 0.01, "Incorrect computed variance.")
	assert.Equal(t, float64(testSize), r[group].Samples, "Incorrect number of smaples.")
}
