package repositories

import (
	"github.com/vlad-doru/experimento/experiment"

	"fmt"
)

// MemoryRepository is a local, in-memory experiment repository.
// It is implemented mainly for testing purposes.
type MemoryRepository struct {
	experiments map[string]experiment.Description
}

func (repository *MemoryRepository) CreateExperiment(experiment experiment.Description) {
	repository.experiments[experiment.ID] = experiment
}

func (repository *MemoryRepository) GetExperiment(exp_id string) (experiment.Description, error) {
	exp, ok := repository.experiments[exp_id]
	if ok == false {
		return experiment.Description{}, fmt.Errorf("The experiment with id %s does not exist.", exp_id)
	}
	return exp, nil
}

func (repository *MemoryRepository) DestroyExperiment(exp_id string) {
	delete(repository.experiments, exp_id)
}

// Implements the Repository interface.
func (repository *MemoryRepository) GetExperiments() (map[string]experiment.Description, error) {
	return repository.experiments, nil
}
