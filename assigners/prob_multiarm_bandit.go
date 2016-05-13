package assigners

import (
	"github.com/vlad-doru/experimento/experiment"
	"github.com/vlad-doru/experimento/interfaces"
	"github.com/vlad-doru/experimento/utils/hashing"

	"fmt"
	"math/rand"
)

// ProbBandit assigner, uses a combination of the multi armed bandit
// method and classical
type ProbBandit struct {
	aggregator  interfaces.Aggregator
	holdoutSize float64
}

// NewProbBandit returns a new ProbBandit, initialized structure.
func NewProbBandit(aggregator interfaces.Aggregator, holdoutSize float64) (*ProbBandit, error) {
	if holdoutSize < 0 {
		return nil, fmt.Errorf("The holdout size specified to the ProbBandit class should be > 0, actual value: %f", holdoutSize)
	}
	if holdoutSize > 1 {
		return nil, fmt.Errorf("The holdout size specified to the ProbBandit class should be < 1, actual value: %f", holdoutSize)
	}
	return &ProbBandit{aggregator, holdoutSize}, nil
}

// AssignGroup returns the group id that will be assigned to a new entity id.
func (assigner *ProbBandit) AssignGroup(entityID string, desc experiment.Description) (string, error) {
	entityHash := hashing.Hash(entityID)
	// internalR := hashing.MapUint64ToFloat(entityHash, desc.InternalSeed^desc.Seed)
	internalR := rand.Float64()
	r := hashing.MapUint64ToFloat(entityHash, desc.Seed)

	if internalR < assigner.holdoutSize {
		// If in the holdout take a classical A/B testing approach.
		return assigner.abChoice(r, desc)
	}

	// If not in holdout, use the smarter approach.
	efficiencies, err := assigner.aggregator.Efficiency(desc.ID)
	// If we don't have efficiency results yet, or an error occured, use the
	// classical A/B testing method.
	if (err != nil) || (efficiencies == nil) || (len(efficiencies) < len(desc.SortedGroupIDs)) {
		return assigner.abChoice(r, desc)
	}

	totalEfficiency := 0.0
	for _, groupID := range desc.SortedGroupIDs {
		efficiency := efficiencies[groupID]
		totalEfficiency += efficiency
	}
	if totalEfficiency == 0 {
		return assigner.abChoice(r, desc)
	}
	// TODO: Count for how many we use the bandit methdod.
	s := 0.0
	for _, groupID := range desc.SortedGroupIDs {
		efficiency := efficiencies[groupID]
		s += efficiency / totalEfficiency
		if r <= s {
			return groupID, nil
		}
	}

	return "", fmt.Errorf("Could not generate a valid group id. Please investigate the algorithm: %v %v", r, s)
}

func (assigner *ProbBandit) abChoice(r float64, desc experiment.Description) (string, error) {
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
