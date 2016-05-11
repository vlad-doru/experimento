package stores

import (
	"github.com/vlad-doru/experimento/interfaces"
)

// MemoryStore implements the Store interface defined by the experimento project
// by holding all the necessary data in memory, in a map.
type MemoryStore struct {
	// Maps entity_id -> exp_id -> group
	mapping map[string]map[string]string
}

// NewMemoryStore returns a new, empty MemoryStore.
func NewMemoryStore() *MemoryStore {
	mapping := make(map[string]map[string]string)
	return &MemoryStore{mapping}
}

// SetExperimentGroup sets the experiment group for a particular entity and
// experiment, by saving the group id in memory.
func (store *MemoryStore) SetExperimentGroup(entityID, expID, group string) error {
	m, ok := store.mapping[entityID]
	if ok == false {
		m = map[string]string{}
		store.mapping[entityID] = m
	}
	m[expID] = group
	return nil
}

// GetExperimentGroup returns the id of the group in which a specific entity id
// finds itself, in a specific experiment.
func (store *MemoryStore) GetExperimentGroup(entityID, expID string) (string, error) {
	m, ok := store.mapping[entityID]
	if ok == false {
		return "", interfaces.NoGroupSet{EntityID: entityID, ExperimentID: expID}
	}
	groupID, ok := m[expID]
	if ok == false {
		return "", interfaces.NoGroupSet{EntityID: entityID, ExperimentID: expID}
	}
	return groupID, nil
}
