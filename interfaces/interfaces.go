package interfaces

import (
	"github.com/vlad-doru/experimento/data"

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
	// This method should be thread safe.
	GetExperiments() (map[string]data.InternalExperiment, error)
}

// Store describes an interface for storing and querying the
// group of an entity, given an experiment id.
// We recommend using a high performance, in-memory, key-value database.
type Store interface {
	// This method should be thread safe
	SetExperimentGroup(entityID, expID, group string) error
	// This method should be thread safe
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
	// This method should be thread safe.
	AssignGroup(entityID string, desc data.InternalExperiment) (string, error)
}

// Aggregator is an interface that is responsible for providing a
// value for an experiment, representing the efficiency. The greater this value,
// then the most successful the experiment was. If the experiment is interested
// in multiple metrics, then it is the implementation's responsability to
// correctly aggregate them into one single value.
//
// The aggregator interface is not used anywhere in the Experimento service,
// but is useful as an interface, since a multi arm bandit approach for ids
// assignation may query an aggregator for partial results.
type Aggregator interface {
	// This method should be thread safe.
	// Maps group_id -> efficiency
	Efficiency(expID string) (map[string]float64, error)
}
