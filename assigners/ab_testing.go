package assigners

import (
	"github.com/vlad-doru/experimento/experiment"

	"fmt"
	"hash/fnv"
	"math/rand"
)

func hash(s string) uint64 {
	h := fnv.New64()
	h.Write([]byte(s))
	return h.Sum64()
}

// ABTesting assigner, used to distributed entity id's evenly, according to
// each group's description.
type ABTesting struct{}

// NewABTesting returns a new ABTesting assigner.
func NewABTesting() *ABTesting {
	return &ABTesting{}
}

// AssignGroup returns the group id that will be assigned to a new entity id.
func (assigner *ABTesting) AssignGroup(entityID string, desc experiment.Description) (string, error) {
	// We get the hash based on the entity_id and xor it with the experiment seed.
	id_seed := hash(entityID) ^ desc.Seed
	// We use this id_seed to generate a random number in [0, 1) interval.
	generator := rand.New(rand.NewSource(int64(id_seed)))
	r := generator.Float64()

	// We use the previously generated random number to decide which group we map this id to.
	s := 0.0
	for _, groupID := range desc.SortedGroupIDs {
		group := desc.Groups[groupID]
		s += group.StartSize
		if r < s {
			return groupID, nil
		}
	}

	return "", fmt.Errorf("Could not generate a valid group id. Please investigate the algorithm.")
}
