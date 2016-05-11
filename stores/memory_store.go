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
func (store *MemoryStore) SetExperimentGroup(entity_id, exp_id, group string) error {
	m, ok := store.mapping[entity_id]
	if ok == false {
		m = map[string]string{}
		store.mapping[entity_id] = m
	}
	m[exp_id] = group
	return nil
}

func (store *MemoryStore) GetExperimentGroup(entity_id, exp_id string) (string, error) {
	m, ok := store.mapping[entity_id]
	if ok == false {
		return "", interfaces.NoGroupSet{EntityID: entity_id, ExperimentID: exp_id}
	}
	group_id, ok := m[exp_id]
	if ok == false {
		return "", interfaces.NoGroupSet{EntityID: entity_id, ExperimentID: exp_id}
	}
	return group_id, nil
}
