package repositories

import (
	"github.com/vlad-doru/experimento/data"

	"fmt"
)

// MemoryRepository is a local, in-memory experiment repository.
// It is implemented mainly for testing purposes.
type MemoryRepository struct {
	experiments map[string]data.InternalExperiment
}

// NewMemoryRepository returns a new MemoryRepository object.
func NewMemoryRepository() *MemoryRepository {
	experiments := make(map[string]data.InternalExperiment)
	return &MemoryRepository{experiments}
}

// CreateExperiment saves an experiment with the given description in the repository.
func (repository *MemoryRepository) CreateExperiment(exp data.InternalExperiment) error {
	_, ok := repository.experiments[exp.Info.Id]
	if ok == true {
		return fmt.Errorf("There is already an experiment with the given id: %s", exp.Info.Id)
	}
	repository.experiments[exp.Info.Id] = exp
	return nil
}

// GetExperiment returns the experiment description of the experiment with the
// specified experiment id.
func (repository *MemoryRepository) GetExperiment(expID string) (data.InternalExperiment, error) {
	exp, ok := repository.experiments[expID]
	if ok == false {
		return data.InternalExperiment{}, fmt.Errorf("The experiment with id %s does not exist.", expID)
	}
	return exp, nil
}

// DestroyExperiment removes the experiment with the given id from the repository.
func (repository *MemoryRepository) DestroyExperiment(expID string) {
	delete(repository.experiments, expID)
}

// GetExperiments returns all the current experiments form the memory.
func (repository *MemoryRepository) GetExperiments() (map[string]data.InternalExperiment, error) {
	return repository.experiments, nil
}
