package interfaces

import (
	"fmt"
)

// Repository describes an interface for storing all the data about
// experiments, including group partitions and variables assignments.
// It is the implementation's responsability to call Validate() on the
// ExperimentDescription.
type Repository interface {
	// GetExperiments should return a map describing all the existing experiments.
	// We recommend storing all the experiments locally, as this function is going to be
	// called for every query of the experimento system, and subscribing to changes
	// to the repository made by other parties.
	GetExperiments() (map[string]ExperimentDescription, error)
}

// Store describes an interface for storing and querying the
// group of an entity, given an experiment id.
// We recommend using a high performance, in-memory, key-value database.
type Store interface {
	SetExperimentGroup(entity_id, experiment_id, group string) error
	GetExperimentGroup(entity_id, experiment_id string) (string, error)
}

type NoGroupSet struct {
	EntityID     string
	ExperimentID string
}

func (e NoGroupSet) Error() string {
	return fmt.Sprintf("There is no group set for entity id: %s and experiment: %s", e.EntityID, e.ExperimentID)
}

// Assigner describes an interface for deciding which group a specific entity
// will be mapped to.
type Assigner interface {
	AssignGroup(entity_id string, desc ExperimentDescription) (string, error)
}
