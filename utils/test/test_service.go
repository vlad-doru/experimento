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
const ExpTestSeed = "experimento"

// ExpTestSize allows to change the size of the test experiment.
const ExpTestSize = 0.5

// ExpControlGroupSize controls the size of the control group.
const ExpControlGroupSize = 0.4

// ExpTestGroupSize controls the size of the test group.
const ExpTestGroupSize = 0.6

// BanditHoldoutSize controls the holdout size in multiarm bandit method.
const BanditHoldoutSize = 0.1

var varsInfo = map[string]experiment.VariableOptions{
	"var": []string{"a", "b"},
}

// GetDefaultExperimentDescription returns a classical experiment setup,
// decribing a control group and a test group.
func GetDefaultExperimentDescription() (experiment.Description, error) {
	// Set a specific random seed.
	info := experiment.Info{
		ID:        "experiment",
		SeedValue: ExpTestSeed,
		Size:      ExpTestSize,
	}
	groups := map[string]experiment.GroupDescription{
		"control": experiment.GroupDescription{
			StartSize: ExpControlGroupSize,
			Variables: experiment.Variables{
				"var": "a",
			},
		},
		"test": experiment.GroupDescription{
			StartSize: ExpTestGroupSize,
			Variables: experiment.Variables{
				"var": "b",
			},
		},
	}
	whitelist := map[string]string{}
	// Create a new description with the info described above.
	return experiment.NewDescription(info, varsInfo, groups, whitelist)
}

// GetBasicABService allows us to get an Experimento service using A/B testing
// that will be useful for testing. GetBasicABService(0) has just the simple
// configuration, without any other random experiment configured.
func GetBasicABService(n int) (*service.ExperimentoService, error) {
	return GetTestingService(assigners.NewBasicAB(), n)
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
	desc, err := GetDefaultExperimentDescription()

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
