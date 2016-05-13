package test

import (
	"github.com/vlad-doru/experimento/assigners"
	"github.com/vlad-doru/experimento/experiment"
	"github.com/vlad-doru/experimento/interfaces"
	"github.com/vlad-doru/experimento/repositories"
	"github.com/vlad-doru/experimento/stores"

	"math/rand"

	"github.com/vlad-doru/experimento/service"
)

// ExpTestSeed allows to change the seed of the test experiment.
var ExpTestSeed = "experimento"

// ExpTestSize allows to change the size of the test experiment.
var ExpTestSize = 0.5

// ExpTestGroupASize controls the size of the control group.
var ExpTestGroupASize = 0.4

// ExpTestGroupBSize controls the size of the test group.
var ExpTestGroupBSize = 0.6

// BanditHoldoutSize controls the holdout size in multiarm bandit method.
var BanditHoldoutSize = 0.1

// GetABTestingService allows us to get an Experimento service using A/B testing
// that will be useful for testing. GetABTestingService(0) has just the simple
// configuration, without any other random experiment configured.
func GetABTestingService(n int) (*service.ExperimentoService, error) {
	return GetTestingService(assigners.NewABTesting(), n)
}

// GetBanditTestingService allows us to get an Experimento service using
// a multi arm bandit assigner, using the aggregator specified in the argument.
func GetBanditTestingService(agg interfaces.Aggregator, n int) (*service.ExperimentoService, error) {
	bandit, err := assigners.NewProbBandit(agg, BanditHoldoutSize)
	if err != nil {
		return nil, err
	}
	return GetTestingService(bandit, n)
}

// GetTestingService allows us to get an experimento service for testing, using
// the specified assigner.
func GetTestingService(assigner interfaces.Assigner, n int) (*service.ExperimentoService, error) {
	repository := repositories.NewMemoryRepository()
	store := stores.NewMemoryStore()

	// Set a specific random seed.
	info := experiment.Info{
		ID:        "experiment",
		SeedValue: ExpTestSeed,
		Size:      ExpTestSize,
	}
	varsInfo := map[string]experiment.VariableOptions{
		"var": []string{"a", "b"},
	}
	groups := map[string]experiment.GroupDescription{
		"control": experiment.GroupDescription{
			StartSize: ExpTestGroupASize,
			Variables: experiment.Variables{
				"var": "a",
			},
		},
		"test": experiment.GroupDescription{
			StartSize: ExpTestGroupBSize,
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
