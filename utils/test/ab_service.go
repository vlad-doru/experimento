package test

import (
	"testing"

	"github.com/vlad-doru/experimento/assigners"
	"github.com/vlad-doru/experimento/experiment"
	"github.com/vlad-doru/experimento/repositories"
	"github.com/vlad-doru/experimento/stores"

	"github.com/vlad-doru/experimento/service"

	"github.com/stretchr/testify/assert"
)

// ABExpTestSeed allows to change the seed of the test experiment.
var ABExpTestSeed uint64 = 24

// ABExpTestSize allows to change the size of the test experiment.
var ABExpTestSize = 0.1

// ABExpTestGroupASize controls the size of the control group.
var ABExpTestGroupASize = 0.4

// ABExpTestGroupBSize controls the size of the test group.
var ABExpTestGroupBSize = 0.6

// GetABTestingService allows us to get an Experimento service using A/B testing
// that will be useful for testing.
func GetABTestingService(t *testing.T) service.ExperimentoService {

	repository := repositories.NewMemoryRepository()
	store := stores.NewMemoryStore()
	assigner := assigners.NewABTesting()

	// Set a specific random seed.
	info := experiment.Info{
		ID:   "experiment",
		Seed: ABExpTestSeed,
		Size: ABExpTestSize,
	}
	varsInfo := map[string]experiment.VariableOptions{
		"var": []string{"a", "b"},
	}
	groups := map[string]experiment.GroupDescription{
		"control": experiment.GroupDescription{
			StartSize: ABExpTestGroupASize,
			Variables: experiment.Variables{
				"var": "a",
			},
		},
		"test": experiment.GroupDescription{
			StartSize: ABExpTestGroupBSize,
			Variables: experiment.Variables{
				"var": "b",
			},
		},
	}
	// Create a new description with the info described above.
	desc, err := experiment.NewDescription(info, varsInfo, groups, nil)
	assert.Nil(t, err, "Creating a new description")
	err = repository.CreateExperiment(desc)
	assert.Nil(t, err, "Creating an experiment")
	return service.NewExperimentoService(repository, store, assigner)
}
