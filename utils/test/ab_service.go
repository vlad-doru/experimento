package test

import (
	"github.com/vlad-doru/experimento/assigners"
	"github.com/vlad-doru/experimento/experiment"
	"github.com/vlad-doru/experimento/repositories"
	"github.com/vlad-doru/experimento/stores"

	"math/rand"

	"github.com/vlad-doru/experimento/service"
)

// ABExpTestSeed allows to change the seed of the test experiment.
var ABExpTestSeed = "experimento"

// ABExpTestSize allows to change the size of the test experiment.
var ABExpTestSize = 0.5

// ABExpTestGroupASize controls the size of the control group.
var ABExpTestGroupASize = 0.4

// ABExpTestGroupBSize controls the size of the test group.
var ABExpTestGroupBSize = 0.6

// GetABTestingService allows us to get an Experimento service using A/B testing
// that will be useful for testing.
func GetABTestingService() (*service.ExperimentoService, error) {
	return GetABTestingServiceN(0)
}

// GetABTestingServiceN allows us to get an Experimento service using A/B testing
// that will be useful for testing. This service will have n + 1 experiments
// associated with it.
func GetABTestingServiceN(n int) (*service.ExperimentoService, error) {
	repository := repositories.NewMemoryRepository()
	store := stores.NewMemoryStore()
	assigner := assigners.NewABTesting()

	// Set a specific random seed.
	info := experiment.Info{
		ID:        "experiment",
		SeedValue: ABExpTestSeed,
		Size:      ABExpTestSize,
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
	if err != nil {
		return nil, err
	}
	err = repository.CreateExperiment(desc)
	if err != nil {
		return nil, err
	}
	for i := 0; i < n; i++ {
		randInfo := experiment.Info{
			ID:        RandStringN(20),
			SeedValue: RandStringN(20),
			Size:      rand.Float64(),
		}
		randInfo.ID = RandStringN(20)
		controlSize := rand.Float64()
		randGroups := map[string]experiment.GroupDescription{
			"control": experiment.GroupDescription{
				StartSize: controlSize,
				Variables: experiment.Variables{
					"var": "a",
				},
			},
			"test": experiment.GroupDescription{
				StartSize: 1 - controlSize,
				Variables: experiment.Variables{
					"var": "b",
				},
			},
		}
		desc, err := experiment.NewDescription(randInfo, varsInfo, randGroups, nil)
		if err != nil {
			return nil, err
		}
		err = repository.CreateExperiment(desc)
		if err != nil {
			return nil, err
		}
	}
	return service.NewExperimentoService(repository, store, assigner), nil
}
