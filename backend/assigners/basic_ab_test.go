package assigners_test

import (
	"github.com/stretchr/testify/assert"
	"github.com/vlad-doru/experimento/backend/assigners"
	"github.com/vlad-doru/experimento/backend/utils/test"

	"testing"
)

func TestBasicABDeterminism(t *testing.T) {
	test.SetSeed(1)
	a := assigners.NewBasicAB()
	desc, err := test.GetDefaultExperimentDescription()
	assert.NotNil(t, a)
	assert.Nil(t, err)
	sampleSize := 1000
	checkSize := 1000
	for i := 0; i < sampleSize; i++ {
		randID := test.RandString(6, 10)
		expected, err := a.AssignGroup(randID, desc)
		assert.Nil(t, err)
		for j := 0; j < checkSize; j++ {
			actual, err := a.AssignGroup(randID, desc)
			assert.Nil(t, err)
			assert.Equal(t, expected, actual)
			if (actual != expected) || (err != nil) {
				assert.FailNow(t, "BasicAB assigner behaviour is non deterministic.")
			}
		}
	}
}

func TestBasicABDistribution(t *testing.T) {
	test.SetSeed(1)
	a := assigners.NewBasicAB()
	desc, err := test.GetDefaultExperimentDescription()
	assert.NotNil(t, a)
	assert.Nil(t, err)
	sampleSize := 100000
	count := map[string]int{}
	for i := 0; i < sampleSize; i++ {
		randID := test.RandString(6, 10)
		group, err := a.AssignGroup(randID, desc)
		count[group]++
		assert.Nil(t, err)
	}
	// Check if the distribution is correct.
	assert.InEpsilon(t, test.ExpControlGroupSize, float64(count["control"])/float64(sampleSize), 0.01)
	assert.InEpsilon(t, test.ExpTestGroupSize, float64(count["test"])/float64(sampleSize), 0.01)
	assert.Equal(t, count["control"]+count["test"], sampleSize, "There were other groups returned, other than test and control")
}
