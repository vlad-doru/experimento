package service_test

import (
	"github.com/stretchr/testify/assert"
	"github.com/vlad-doru/experimento/aggregators"
	"github.com/vlad-doru/experimento/utils/test"

	"math/rand"

	"testing"
)

func TestBasicABBasicExample(t *testing.T) {
	s, err := test.GetBasicABService(0)
	assert.Nil(t, err, "Error while getting the experimento service")

	v, err := s.GetAllVariables("vlad")

	assert.Nil(t, err, "Error while getting all variables %v", err)
	assert.NotNil(t, v, "Empty all variables map")
	assert.NotNil(t, v["experiment"], "Empty experiment variables")
	assert.Equal(t, "test", v["experiment"]["group"], "Wrong group in experiment")
	assert.Equal(t, "b", v["experiment"]["var"], "Wrong variable choice")
}

func TestBasicABIntegration(t *testing.T) {
	test.SetSeed(1) // set the seed so that we can easily replicate results
	s, err := test.GetBasicABService(0)
	assert.Nil(t, err, "Error while getting the experimento service")
	expSize := test.ExpTestSize
	// Generate 100K random strings and call the GetAllVariables method.
	// Count the result from each group.
	count := map[string]float64{}
	sampleSize := 100000
	for i := 0; i < sampleSize; i++ {
		randID := test.RandString(6, 10)
		v, err := s.GetAllVariables(randID)
		assert.Nil(t, err, "Could not get all the variables: %v", err)
		count[v["experiment"]["group"]]++
	}
	controlRatio := count["control"] / float64(expSize*float64(sampleSize))
	testRatio := count["test"] / float64(expSize*float64(sampleSize))
	noGroupRatio := count[""] / float64(sampleSize)
	assert.InEpsilon(t, test.ExpControlGroupSize, controlRatio, 0.01, "Invalid ratio difference for control group")
	assert.InEpsilon(t, test.ExpTestGroupSize, testRatio, 0.01, "Invalid ratio difference for test group")
	assert.InEpsilon(t, 1-expSize, noGroupRatio, 0.01, "Invalid ratio difference for non participating group")
}

func BenchmarkBasicABIntegration(b *testing.B) {
	// Stop the benchmark timer.
	b.StopTimer()
	test.SetSeed(1)                       // set the seed so that we can easily replicate results
	s, err := test.GetBasicABService(100) // get a service with 100 experiments
	if err != nil {
		b.Logf("Error while creating the service: %s", err)
		b.FailNow()
	}
	// Generate 1000 random ids.
	randIDs := []string{}
	const sampleSize int = 1000
	for i := 0; i < sampleSize; i++ {
		id := test.RandString(6, 10)
		randIDs = append(randIDs, id)
	}
	currentIndex := 0
	incrementIndex := func() {
		currentIndex++
		if currentIndex == sampleSize {
			currentIndex = 0
		}
	}
	// Restart the timer.
	b.StartTimer()
	for i := 0; i < b.N; i++ {
		id := randIDs[currentIndex]
		incrementIndex()
		_, err := s.GetAllVariables(id)
		if err != nil {
			b.Logf("What %v", err)
			b.FailNow()
		}
	}
}

func TestProbBanditIntegration(t *testing.T) {
	test.SetSeed(1) // set the seed so that we can easily replicate results
	agg := aggregators.NewSingleMetricMemoryAggregator()
	s, err := test.GetBanditTestingService(agg, 0)
	assert.Nil(t, err, "Error while getting the experimento service")
	groupASize := test.ExpControlGroupSize
	groupBSize := test.ExpTestGroupSize
	expSize := test.ExpTestSize
	// Generate 100K random strings and call the GetAllVariables method.
	// Count the result from each group.
	groupACount := 0.0
	groupBCount := 0.0
	noGroupCount := 0.0
	sampleSize := 200000

	groupAMetricMean := 0.40
	groupBMetricMean := 0.20

	expectedGroupARatio := test.BanditHoldoutSize*groupASize +
		(1.0-test.BanditHoldoutSize)*(groupAMetricMean/(groupAMetricMean+groupBMetricMean))
	expectedGroupBRatio := test.BanditHoldoutSize*groupBSize +
		(1.0-test.BanditHoldoutSize)*(groupBMetricMean/(groupAMetricMean+groupBMetricMean))

	for i := 0; i < sampleSize; i++ {
		randID := test.RandString(6, 10)
		v, err := s.GetAllVariables(randID)
		assert.Nil(t, err, "Could not get all the variables: %v", err)
		group := v["experiment"]["group"]

		// TODO: Increment the metric.
		switch group {
		case "control":
			groupACount++
			r := rand.Float64()
			v := 0.0
			if r < groupAMetricMean {
				v = 1.0
			}
			agg.AddMetric("experiment", "control", v)
			break
		case "test":
			r := rand.Float64()
			v := 0.0
			if r < groupBMetricMean {
				v = 1.0
			}
			agg.AddMetric("experiment", "test", v)
			groupBCount++
			break
		case "":
			noGroupCount++
			break
		default:
			assert.Fail(t, "Invalid group %s", group)
		}
	}
	groupARatio := groupACount / float64(expSize*float64(sampleSize))
	groupBRatio := groupBCount / float64(expSize*float64(sampleSize))
	noGroupRatio := noGroupCount / float64(sampleSize)
	assert.InEpsilon(t, expectedGroupARatio, groupARatio, 0.01, "Invalid ratio difference for control group")
	assert.InEpsilon(t, expectedGroupBRatio, groupBRatio, 0.01, "Invalid ratio difference for test group")
	assert.InEpsilon(t, 1-expSize, noGroupRatio, 0.01, "Invalid ratio difference for non participating group")

	// Check the metric mean.
	r := agg.GetExpResults("experiment")
	assert.InEpsilon(t, groupAMetricMean, r["control"].Mean, 0.01, "Incorrect metric for control group.")
	assert.InEpsilon(t, groupBMetricMean, r["test"].Mean, 0.01, "Incorrect metric for test group.")

}
