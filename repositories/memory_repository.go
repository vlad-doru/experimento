package repositories

import (
	"github.com/vlad-doru/experimento/interfaces"

	"fmt"
)

// MemoryRepository is a local, in-memory experiment repository.
// It is implemented mainly for testing purposes.
type MemoryRepository struct {
	experiments map[string]interfaces.ExperimentDescription
}

func (repository *MemoryRepository) CreateExperiment(experiment interfaces.ExperimentDescription) error {
	repository.experiments[experiment.ID] = experiment
	return nil
}

func (repository *MemoryRepository) GetExperiment(experiment_id string) (interfaces.ExperimentDescription, error) {
	experiment, ok := repository.experiments[experiment_id]
	if ok == false {
		return interfaces.ExperimentDescription{}, fmt.Errorf("The experiment with id %s does not exist.", experiment_id)
	}
	return experiment, nil
}

func (repository *MemoryRepository) DestroyExperiment(experiment_id string) error {
	delete(repository.experiments, experiment_id)
	return nil
}

func (repository *MemoryRepository) GetExperiments() (map[string]interfaces.ExperimentDescription, error) {
	return repository.experiments, nil
}
