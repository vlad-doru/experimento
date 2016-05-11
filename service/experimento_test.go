package service_test

import (
	"github.com/stretchr/testify/assert"
	"github.com/vlad-doru/experimento/utils/test"
	"testing"
)

// TestGetAllVariablesBasic tests a simple usecase which should always yield the
// same value for an AB testing service.
func TestABTestingBasic(t *testing.T) {
	s := test.GetABTestingService(t)
	v, err := s.GetAllVariables("vlad")

	assert.Nil(t, err, "Error while getting all variables %v", err)
	assert.NotNil(t, v, "Empty all variables map")
	assert.NotNil(t, v["experiment"], "Empty experiment variables")
	assert.Equal(t, "test", v["experiment"]["group"], "Wrong group in experiment")
	assert.Equal(t, "b", v["experiment"]["var"], "Wrong variable choice")
}

func TestABTestingDeterminism(t *testing.T) {
	s := test.GetABTestingService(t)
	initialGroup := map[string]string{}
	// Generate 1000 random string and check that
	// if we call the function 1000 times for each we get the same group.
	for i := 0; i < 1000; i++ {
		randID := test.RandString(10)
		v, err := s.GetAllVariables(randID)
		assert.Nil(t, err, "Could not get all the variables: %v", err)
		group := v["experiment"]["group"]
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
