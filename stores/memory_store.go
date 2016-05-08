package stores

import (
	"github.com/vlad-doru/experimento/interfaces"
)

type MemoryStore struct {
	// Maps entity_id -> experiment_id -> group
	mapping map[string]map[string]string
}

func (store *MemoryStore) SetExperimentGroup(entity_id, experiment_id, group string) error {
	m, ok := store.mapping[entity_id]
	if ok == false {
		m = map[string]string{}
		store.mapping[entity_id] = m
	}
	m[experiment_id] = group
	return nil
}

func (store *MemoryStore) GetExperimentGroup(entity_id, experiment_id string) (string, error) {
	m, ok := store.mapping[entity_id]
	if ok == false {
		return "", interfaces.NoGroupSet{entity_id, experiment_id}
	}
	group_id, ok := m[experiment_id]
	if ok == false {
		return "", interfaces.NoGroupSet{entity_id, experiment_id}
	}
	return group_id, nil
}
