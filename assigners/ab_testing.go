package assigners

import (
	"github.com/vlad-doru/experimento/experiment"
	"github.com/vlad-doru/experimento/utils/hashing"

	"fmt"
)

// ABTesting assigner, used to distributed entity id's evenly, according to
// each group's description.
type ABTesting struct{}

// NewABTesting returns a new ABTesting assigner.
func NewABTesting() *ABTesting {
	return &ABTesting{}
}

// AssignGroup returns the group id that will be assigned to a new entity id.
func (assigner *ABTesting) AssignGroup(entityID string, desc experiment.Description) (string, error) {
	r := hashing.HashFloat(entityID, desc.Seed)

	// We use the previously generated random number to decide which group we map this id to.
	s := 0.0
	for _, groupID := range desc.SortedGroupIDs {
		group := desc.Groups[groupID]
		s += group.StartSize
		if r <= s {
			return groupID, nil
		}
	}

	return "", fmt.Errorf("Could not generate a valid group id. Please investigate the algorithm: %v", r)
}