package stores

import (
	"github.com/vlad-doru/experimento/interfaces"
	"sync"
)

type expGroups struct {
	mapping map[string]string
	mutex   sync.RWMutex
}

// MemoryStore implements the Store interface defined by the experimento project
// by holding all the necessary data in memory, in a map.
type MemoryStore struct {
	// Maps entity_id -> exp_id -> group
	mapping map[string]*expGroups
	mutex   sync.RWMutex
}

// NewMemoryStore returns a new, empty MemoryStore.
func NewMemoryStore() *MemoryStore {
	mapping := make(map[string]*expGroups)
	return &MemoryStore{mapping, sync.RWMutex{}}
}

// SetExperimentGroup sets the experiment group for a particular entity and
// experiment, by saving the group id in memory.
func (store *MemoryStore) SetExperimentGroup(entityID, expID, group string) error {
	store.mutex.RLock()
	m, ok := store.mapping[entityID]
	store.mutex.RUnlock()
	if ok == false {
		m = &expGroups{map[string]string{}, sync.RWMutex{}}
		store.mutex.Lock()
		store.mapping[entityID] = m
		store.mutex.Unlock()
	}
	m.mutex.Lock()
	m.mapping[expID] = group
	m.mutex.Unlock()
	return nil
}

// GetExperimentGroup returns the id of the group in which a specific entity id
// finds itself, in a specific experiment.
func (store *MemoryStore) GetExperimentGroup(entityID, expID string) (string, error) {
	store.mutex.RLock()
	m, ok := store.mapping[entityID]
	store.mutex.RUnlock()
	if ok == false {
		return "", interfaces.NoGroupSet{EntityID: entityID, ExperimentID: expID}
	}
	m.mutex.RLock()
	groupID, ok := m.mapping[expID]
	m.mutex.RUnlock()
	if ok == false {
		return "", interfaces.NoGroupSet{EntityID: entityID, ExperimentID: expID}
	}
	return groupID, nil
}
