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

// NewMemoryRepository returns a new MemoryRepository object.
func NewMemoryRepository() *MemoryRepository {
	experiments := make(map[string]experiment.Description)
	return &MemoryRepository{experiments}
}

// CreateExperiment saves an experiment with the given description in the repository.
func (repository *MemoryRepository) CreateExperiment(experiment experiment.Description) error {
	_, ok := repository.experiments[experiment.ID]
	if ok == true {
		return fmt.Errorf("There is already an experiment with the given id: %s", experiment.ID)
	}
	repository.experiments[experiment.ID] = experiment
	return nil
}

// GetExperiment returns the experiment description of the experiment with the
// specified experiment id.
func (repository *MemoryRepository) GetExperiment(expID string) (experiment.Description, error) {
	exp, ok := repository.experiments[expID]
	if ok == false {
		return experiment.Description{}, fmt.Errorf("The experiment with id %s does not exist.", expID)
	}
	return exp, nil
}

// DestroyExperiment removes the experiment with the given id from the repository.
func (repository *MemoryRepository) DestroyExperiment(expID string) {
	delete(repository.experiments, expID)
}

// GetExperiments returns all the current experiments form the memory.
func (repository *MemoryRepository) GetExperiments() (map[string]experiment.Description, error) {
	return repository.experiments, nil
}
