package service_test

import (
	"github.com/stretchr/testify/assert"
	"github.com/vlad-doru/experimento/utils/test"
	"testing"
)

// TestGetAllVariablesBasic tests a simple usecase which should always yield the
// same value for an AB testing service.
func TestABTestingBasic(t *testing.T) {
	s, err := test.GetABTestingService(0)
	assert.Nil(t, err, "Error while getting the experimento service")

	v, err := s.GetAllVariables("doru")

	assert.Nil(t, err, "Error while getting all variables %v", err)
	assert.NotNil(t, v, "Empty all variables map")
	assert.NotNil(t, v["experiment"], "Empty experiment variables")
	assert.Equal(t, "test", v["experiment"]["group"], "Wrong group in experiment")
	assert.Equal(t, "b", v["experiment"]["var"], "Wrong variable choice")
}

func TestABTestingDeterminism(t *testing.T) {
	test.SetSeed(1) // set the seed so that we can easily replicate results
	s, err := test.GetABTestingService(0)
	assert.Nil(t, err, "Error while getting the experimento service")
	initialGroup := map[string]string{}
	// Generate 1000 random string and check that
	// if we call the function 1000 times for each we get the same group.
	for i := 0; i < 100; i++ {
		randID := test.RandString(6, 10)
		v, err := s.GetAllVariables(randID)
		assert.Nil(t, err, "Could not get all the variables: %v", err)
		group := v["experiment"]["group"]
		if group == "" {
			// Not participating
			continue
		}
		assert.True(t,
			group == "control" || group == "test",
			"Invalid group variable value %v", group)
		initialGroup[randID] = group
	}
	// Check for determinism.
	for i := 0; i < 1000; i++ {
		for randID, expectedGroup := range initialGroup {
			v, err := s.GetAllVariables(randID)
			assert.Nil(t, err, "Could not get all the variables: %v", err)
			group := v["experiment"]["group"]
			assert.Equal(t, expectedGroup, group, "Non deterministic behaviour of A/B testing for id", randID)
		}
	}
}

func TestABTestingDistribution(t *testing.T) {
	test.SetSeed(1) // set the seed so that we can easily replicate results
	s, err := test.GetABTestingService(0)
	assert.Nil(t, err, "Error while getting the experimento service")
	groupASize := test.ExpTestGroupASize
	groupBSize := test.ExpTestGroupBSize
	expSize := test.ExpTestSize
	// Generate 100K random strings and call the GetAllVariables method.
	// Count the result from each group.
	groupACount := 0.0
	groupBCount := 0.0
	noGroupCount := 0.0
	sampleSize := 100000
	for i := 0; i < sampleSize; i++ {
		randID := test.RandString(6, 10)
		v, err := s.GetAllVariables(randID)
		assert.Nil(t, err, "Could not get all the variables: %v", err)
		group := v["experiment"]["group"]
		switch group {
		case "control":
			groupACount++
			break
		case "test":
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
	assert.InEpsilon(t, groupASize, groupARatio, 0.01, "Invalid ratio difference for control group")
	assert.InEpsilon(t, groupBSize, groupBRatio, 0.01, "Invalid ratio difference for test group")
	assert.InEpsilon(t, 1-expSize, noGroupRatio, 0.01, "Invalid ratio difference for non participating group")
}

func BenchmarkABTesting(b *testing.B) {
	// Stop the benchmark timer.
	b.StopTimer()
	test.SetSeed(1)                         // set the seed so that we can easily replicate results
	s, err := test.GetABTestingService(100) // get a service with 100 experiments
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

func TestProbMultiArmBanditDistribution(t *testing.T) {
	test.SetSeed(2) // set the seed so that we can easily replicate results
	s, err := test.GetBanditTestingService(0)
	assert.Nil(t, err, "Error while getting the experimento service")
	groupASize := test.ExpTestGroupASize
	groupBSize := test.ExpTestGroupBSize
	expSize := test.ExpTestSize
	// Generate 100K random strings and call the GetAllVariables method.
	// Count the result from each group.
	groupACount := 0.0
	groupBCount := 0.0
	noGroupCount := 0.0
	sampleSize := 100000
	for i := 0; i < sampleSize; i++ {
		randID := test.RandString(6, 10)
		v, err := s.GetAllVariables(randID)
		assert.Nil(t, err, "Could not get all the variables: %v", err)
		group := v["experiment"]["group"]

		// TODO: Increment the metric.
		switch group {
		case "control":
			groupACount++
			break
		case "test":
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
	assert.InEpsilon(t, groupASize, groupARatio, 0.01, "Invalid ratio difference for control group")
	assert.InEpsilon(t, groupBSize, groupBRatio, 0.01, "Invalid ratio difference for test group")
	assert.InEpsilon(t, 1-expSize, noGroupRatio, 0.01, "Invalid ratio difference for non participating group")
}
