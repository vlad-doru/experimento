package service_test

import (
	"testing"

	"github.com/vlad-doru/experimento/assigners"
	"github.com/vlad-doru/experimento/experiment"
	"github.com/vlad-doru/experimento/repositories"
	"github.com/vlad-doru/experimento/stores"

	"github.com/vlad-doru/experimento/service"

	"github.com/stretchr/testify/assert"
)

func getTestExperimentoService(t *testing.T) service.ExperimentoService {

	repository := repositories.NewMemoryRepository()
	store := stores.NewMemoryStore()
	assigner := assigners.NewABTesting()

	// Set a specific random seed.
	info := experiment.Info{
		ID:   "experiment",
		Seed: 24,
		Size: 0.1,
	}
	varsInfo := map[string]experiment.VariableOptions{
		"var": []string{"a", "b"},
	}
	groups := map[string]experiment.GroupDescription{
		"control": experiment.GroupDescription{
			StartSize: 0.5,
			Variables: experiment.Variables{
				"var": "a",
			},
		},
		"test": experiment.GroupDescription{
			StartSize: 0.5,
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

func TestGetAllVariables(t *testing.T) {
	s := getTestExperimentoService(t)
	_, err := s.GetAllVariables("vlad")
	assert.Nil(t, err, "Getting all variables.")
}
