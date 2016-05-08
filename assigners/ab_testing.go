package assigners

import (
	"github.com/vlad-doru/experimento/interfaces"

	"fmt"
	"hash/fnv"
	"math/rand"
)

func hash(s string) uint64 {
	h := fnv.New64()
	h.Write([]byte(s))
	return h.Sum64()
}

type ABTesting struct{}

func (assigner *ABTesting) AssignGroup(entity_id string, desc interfaces.ExperimentDescription) (string, error) {
	// We get the hash based on the entity_id and xor it with the experiment seed.
	id_seed := hash(entity_id) ^ desc.Seed
	// We use this id_seed to generate a random number in [0, 1) interval.
	generator := rand.New(rand.NewSource(int64(id_seed)))
	r := generator.Float64()

	// We use the previously generated random number to decide which group we map this id to.
	s := 0.0
	for _, group_id := range desc.SortedGroupIDs {
		group := desc.Groups[group_id]
		s += group.StartSize
		if r < s {
			return group_id, nil
		}
	}

	return "", fmt.Errorf("Could not generate a valid group id. Please investigate the algorithm.")
}
