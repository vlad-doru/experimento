package assigners_test

import (
	"github.com/stretchr/testify/assert"
	"github.com/vlad-doru/experimento/assigners"
	"github.com/vlad-doru/experimento/utils/test"

	"testing"
)

func TestBasicABDistribution(t *testing.T) {
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
}
