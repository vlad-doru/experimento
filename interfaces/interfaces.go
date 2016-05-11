package interfaces

import (
	"github.com/vlad-doru/experimento/experiment"

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
	GetExperiments() (map[string]experiment.Description, error)
}

// Store describes an interface for storing and querying the
// group of an entity, given an experiment id.
// We recommend using a high performance, in-memory, key-value database.
type Store interface {
	SetExperimentGroup(entityID, expID, group string) error
	GetExperimentGroup(entityID, expID string) (string, error)
}

// NoGroupSet is a specific type of error which should be returned when an
// entity id does not belong to any group.
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
	AssignGroup(entityID string, desc experiment.Description) (string, error)
}
