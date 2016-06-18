package test

import (
	"github.com/vlad-doru/experimento/backend/assigners"
	"github.com/vlad-doru/experimento/backend/data"
	"github.com/vlad-doru/experimento/backend/interfaces"
	"github.com/vlad-doru/experimento/backend/repositories"
	"github.com/vlad-doru/experimento/backend/stores"

	"math/rand"

	"github.com/vlad-doru/experimento/backend/service"
)

// ExpTestSeed allows to change the seed of the test experiment.
var ExpTestSeed = "experimento"

// ExpTestSize allows to change the size of the test experiment.
var ExpTestSize = 0.5

// ExpControlGroupSize controls the size of the control group.
var ExpControlGroupSize = 0.4

// ExpTestGroupSize controls the size of the test group.
var ExpTestGroupSize = 0.6

// BanditHoldoutSize controls the holdout size in multiarm bandit method.
var BanditHoldoutSize = 0.1

var varsInfo = map[string]*data.VariableInfo{
	"var": &data.VariableInfo{
		Options: []string{"a", "b"},
	},
}

// GetDefaultExperimentDescription returns a classical experiment setup,
// decribing a control group and a test group.
func GetDefaultExperimentDescription() (data.Experiment, error) {
	// Set a specific random seed.
	info := &data.ExperimentInfo{
		Id:        "experiment",
		SeedValue: ExpTestSeed,
		Size:      ExpTestSize,
	}
	groups := map[string]*data.GroupInfo{
		"control": &data.GroupInfo{
			InitialSize: ExpControlGroupSize,
			Variables: map[string]string{
				"var": "a",
			},
		},
		"test": &data.GroupInfo{
			InitialSize: ExpTestGroupSize,
			Variables: map[string]string{
				"var": "b",
			},
		},
	}
	whitelist := map[string]string{}
	// Create a new description with the info described above.
	return data.NewExperiment(info, varsInfo, groups, whitelist)
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
		randInfo := &data.ExperimentInfo{
			Id:        RandStringN(20),
			SeedValue: RandStringN(20),
			Size:      rand.Float64(),
		}
		// randInfo.Id = RandStringN(20)
		controlSize := rand.Float64()
		randGroups := map[string]*data.GroupInfo{
			"control": &data.GroupInfo{
				InitialSize: controlSize,
				Variables: map[string]string{
					"var": "a",
				},
			},
			"test": &data.GroupInfo{
				InitialSize: 1 - controlSize,
				Variables: map[string]string{
					"var": "b",
				},
			},
		}
		desc, err := data.NewExperiment(randInfo, varsInfo, randGroups, nil)
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
