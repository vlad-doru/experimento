package stores

import (
	"github.com/dropbox/godropbox/container/concurrent"
	"github.com/vlad-doru/experimento/backend/interfaces"
)

// MemoryStore implements the Store interface defined by the experimento project
// by holding all the necessary data in memory, in a map.
type MemoryStore struct {
	// Maps entity_id -> exp_id -> group
	mapping concurrent.Map
}

// NewMemoryStore returns a new, empty MemoryStore.
func NewMemoryStore() *MemoryStore {
	mapping := concurrent.NewMap()
	return &MemoryStore{mapping}
}

// SetExperimentGroup sets the experiment group for a particular entity and
// experiment, by saving the group id in memory.
func (store *MemoryStore) SetExperimentGroup(entityID, expID, group string) error {
	m, ok := store.mapping.Get(entityID)
	if ok == false {
		m = concurrent.NewMap()
		store.mapping.Set(entityID, m)
	}
	m.(concurrent.Map).Set(expID, group)
	return nil
}

// GetExperimentGroup returns the id of the group in which a specific entity id
// finds itself, in a specific experiment.
func (store *MemoryStore) GetExperimentGroup(entityID, expID string) (string, error) {
	m, ok := store.mapping.Get(entityID)
	if ok == false {
		return "", interfaces.NoGroupSet{EntityID: entityID, ExperimentID: expID}
	}
	groupID, ok := m.(concurrent.Map).Get(expID)
	if ok == false {
		return "", interfaces.NoGroupSet{EntityID: entityID, ExperimentID: expID}
	}
	return groupID.(string), nil
}
