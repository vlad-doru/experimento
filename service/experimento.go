package service

import (
	"github.com/vlad-doru/experimento/experiment"
	"github.com/vlad-doru/experimento/interfaces"
	"github.com/vlad-doru/experimento/utils/hashing"

	"fmt"
)

// ExperimentoService is the main service exposed by our library.
type ExperimentoService struct {
	repository interfaces.Repository
	store      interfaces.Store
	assigner   interfaces.Assigner
}

// Variables encapsulates the following association:
// 		exp_id -> variable_name -> variable_value
type Variables map[string]map[string]string

// NewExperimentoService return a new, ready to query, ExperimentoService object.
func NewExperimentoService(
	repository interfaces.Repository,
	store interfaces.Store,
	assigner interfaces.Assigner) *ExperimentoService {

	return &ExperimentoService{repository, store, assigner}
}

// GetAllVariables returns all the variables associated to an entity_id.
// We only expose this function so that we encourage calling this function only once.
// Had we exposed a GetExperimentVariables(exp_id) people would have proabably
// chosen to call that multiple times, which would hurt the performance.
func (service *ExperimentoService) GetAllVariables(entityID string) (Variables, error) {
	// First we get all the existing experiments.
	experiments, err := service.repository.GetExperiments()
	if err != nil {
		return nil, err
	}

	// Used for communication on the channel so that we reconstruct the final map.
	type expVar struct {
		id   string
		vars map[string]string
		err  error
	}

	c := make(chan *expVar, len(experiments)) // buffered so we don't wait on write
	validExperiments := 0
	entityIDHash := hashing.Hash(entityID)
	for id, desc := range experiments {
		// First we check if the entity is whitelisted.
		_, isWhitelisted := desc.Whitelist[entityID]
		if isWhitelisted == false {
			// Check if this entity's id falls in the experiment size.
			if hashing.MapUint64ToFloat(entityIDHash, desc.InternalSeed) >= desc.Size {
				// This entity does not participate
				continue
			}
		}
		// If it is whitelisted or in the experiment we go on and get the Variables
		// in parallel.
		validExperiments++
		go func(id string, desc experiment.Description) {
			// Get the variable then send it through the channel.
			vars, err := service.getVariables(entityID, desc)
			c <- &expVar{id, vars, err}
		}(id, desc)
	}

	result := Variables{}
	// Collect the variables from all the experiments.
	for i := 0; i < validExperiments; i++ {
		exp := <-c
		// Check if we had an error
		if exp.err != nil {
			return nil, exp.err
		}
		result[exp.id] = exp.vars
	}
	return result, nil
}

func (service *ExperimentoService) getVariables(entityID string, exp experiment.Description) (map[string]string, error) {
	var groupID string
	var err error
	groupID, err = service.store.GetExperimentGroup(entityID, exp.ID)
	if err != nil {
		// If there was no group set for this id we do not return with an error.
		switch err.(type) {
		case interfaces.NoGroupSet:
			// First we check if the id is whitelisted.
			_, isWhitelisted := exp.Whitelist[entityID]
			if isWhitelisted == true {
				groupID = exp.Whitelist[entityID]
				break
			}
			// Get the group from the assigner
			groupID, err = service.assigner.AssignGroup(entityID, exp)
			if err != nil {
				return nil, err
			}
			// Store the group.
			err = service.store.SetExperimentGroup(entityID, exp.ID, groupID)
			if err != nil {
				return nil, err
			}
			break
		default:
			return nil, err
		}
	}

	group, ok := exp.Groups[groupID]
	if ok == false {
		return nil, fmt.Errorf("Group with id %s does not exist!", groupID)
	}

	return group.Variables, nil
}
