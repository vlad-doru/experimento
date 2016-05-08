package service

import (
	"github.com/vlad-doru/experimento/interfaces"

	"fmt"
)

type ExperimentoService struct {
	repository interfaces.Repository
	store      interfaces.Store
	assigner   interfaces.Assigner
}

// Variables encapsulates the following association:
// 		experiment_id -> variable_name -> variable_value
type Variables map[string]map[string]string

func NewExperimentoService(
	repository interfaces.Repository,
	store interfaces.Store,
	assigner interfaces.Assigner) ExperimentoService {

	return ExperimentoService{repository, store, assigner}
}

// We only expose this function so that we encourage calling this function only once.
// Had we exposed a GetExperimentVariables(experiment_id) people would have proabably
// chosen to call that multiple times, which would hurt the performance.
func (service *ExperimentoService) GetAllVariables(entity_id string) (Variables, error) {
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

	c := make(chan expVar)
	for id, desc := range experiments {
		go func(id string, desc interfaces.ExperimentDescription) {
			// Get the variable then send it through the channel.
			vars, err := service.GetVariables(entity_id, desc)
			c <- expVar{id, vars, err}
		}(id, desc)
	}

	result := Variables{}
	// Collect the variables from all the experiments.
	for _, _ = range experiments {
		exp := <-c
		if exp.err != nil {
			return nil, exp.err
		}
		result[exp.id] = exp.vars
	}

	return result, nil
}

func (service *ExperimentoService) GetVariables(entity_id string, experiment interfaces.ExperimentDescription) (map[string]string, error) {
	group_id, err := service.store.GetExperimentGroup(entity_id, experiment.ID)
	if err != nil {
		// If there was no group set for this id we do not return with an error.
		switch err.(type) {
		case interfaces.NoGroupSet:
			// First we check if the id is whitelisted.
			group_id, ok := experiment.Whitelist[entity_id]
			if ok == true {
				break
			}
			// Get the group from the assigner
			group_id, err = service.assigner.AssignGroup(entity_id, experiment)
			if err != nil {
				return nil, err
			}
			// Store the group.
			err = service.store.SetExperimentGroup(entity_id, experiment.ID, group_id)
			if err != nil {
				return nil, err
			}
			break
		default:
			return nil, err
		}
	}

	group, ok := experiment.Groups[group_id]
	if ok == false {
		return nil, fmt.Errorf("Group with id %s does not exist!", group_id)
	}

	return group.Variables, nil
}
