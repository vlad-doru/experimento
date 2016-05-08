package stores

import (
	"github.com/vlad-doru/experimento/interfaces"
)

type MemoryStore struct {
	// Maps entity_id -> exp_id -> group
	mapping map[string]map[string]string
}

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
		return "", interfaces.NoGroupSet{entity_id, exp_id}
	}
	group_id, ok := m[exp_id]
	if ok == false {
		return "", interfaces.NoGroupSet{entity_id, exp_id}
	}
	return group_id, nil
}
