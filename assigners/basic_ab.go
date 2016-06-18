package assigners

import (
	"github.com/vlad-doru/experimento/data"
	"github.com/vlad-doru/experimento/utils/hashing"

	"fmt"
)

// BasicAB assigner, used to distributed entity id's evenly, according to
// each group's description.
type BasicAB struct{}

// NewBasicAB returns a new BasicAB assigner.
func NewBasicAB() *BasicAB {
	return &BasicAB{}
}

// AssignGroup returns the group id that will be assigned to a new entity id.
func (assigner *BasicAB) AssignGroup(entityID string, exp data.Experiment) (string, error) {
	r := hashing.HashFloat(entityID, exp.Seed)

	// We use the previously generated random number to decide which group we map this id to.
	s := 0.0
	for _, groupID := range exp.SortedGroupIds {
		group := exp.GroupsInfo[groupID]
		s += group.InitialSize
		if r <= s {
			return groupID, nil
		}
	}

	return "", fmt.Errorf("Could not generate a valid group id. Please investigate the algorithm: %v", r)
}
