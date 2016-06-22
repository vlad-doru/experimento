package experimento

import (
	"github.com/vlad-doru/experimento/backend/data"
	"github.com/vlad-doru/experimento/backend/utils/hashing"
	"golang.org/x/net/context"
	"github.com/vlad-doru/experimento/backend/interfaces"

  "fmt"
)

type ExperimentoServer struct {
	store data.StoreClient
  repository data.RepositoryClient
	assigner   interfaces.Assigner
}

func NewExperimentoServer(store data.StoreClient, repository data.RepositoryClient, assigner interfaces.Assigner) *ExperimentoServer {
  return &ExperimentoServer{
    store,
    repository,
    assigner,
  }
}

func (service *ExperimentoServer) GetAllVariables(ctx context.Context, query *data.QueryAll) (*data.AllVariables, error) {
	// First we get all the existing experiments.
	response, err := service.repository.GetExperiments(context.Background(), &data.Void{})
	if err != nil {
		return nil, err
	}
  experiments := response.Experiments

	// Used for communication on the channel so that we reconstruct the final map.
	type expVar struct {
		id   string
		vars *data.Variables
		err  error
	}

	c := make(chan *expVar, len(experiments)) // buffered so we don't wait on write
	validExperiments := 0
	entityIDHash := hashing.Hash(query.EntityId)
	for id, exp := range experiments {
		// First we check if the entity is whitelisted.
		_, isWhitelisted := exp.Whitelist[query.EntityId]
		if isWhitelisted == false {
			// Check if this entity's id falls in the experiment size.
			if hashing.MapUint64ToFloat(entityIDHash, exp.InternalSeed) >= exp.Info.Size {
				// This entity does not participate
				continue
			}
		}
		// If it is whitelisted or in the experiment we go on and get the Variables
		// in parallel.
		validExperiments++
		go func(id string, desc *data.Experiment) {
			// Get the variable then send it through the channel.
			vars, err := service.getVariables(query.EntityId, desc)
			c <- &expVar{id, vars, err}
		}(id, exp)
	}

	result := &data.AllVariables{}
	result.ExpVariables = make(map[string]*data.Variables)
	// Collect the variables from all the experiments.
	for i := 0; i < validExperiments; i++ {
		exp := <-c
		// Check if we had an error
		if exp.err != nil {
			return nil, exp.err
		}
		result.ExpVariables[exp.id] = exp.vars
	}
	return result, nil
}

func (service *ExperimentoServer) GetVariables(ctx context.Context, query *data.QueryExperiment) (*data.Variables, error) {
  // First we get all the existing experiments.
  exp, err := service.repository.GetExperiment(context.Background(), query.Info)
  if err != nil {
    return nil, err
  }

	entityIDHash := hashing.Hash(query.EntityId)
  // First we check if the entity is whitelisted.
  _, isWhitelisted := exp.Whitelist[query.EntityId]
  if isWhitelisted == false {
    // Check if this entity's id falls in the experiment size.
    if hashing.MapUint64ToFloat(entityIDHash, exp.InternalSeed) >= exp.Info.Size {
      // This entity does not participate
      return &data.Variables{}, nil
    }
  }
  return service.getVariables(query.EntityId, exp)
}

func (service *ExperimentoServer) getVariables(entityID string, exp *data.Experiment) (*data.Variables, error) {
  var groupID string
	response, err := service.store.GetExperimentGroup(
    context.Background(), &data.StoreMessage{ })
  if (err != nil || response.GroupId == "") {
    _, isWhitelisted := exp.Whitelist[entityID]
    if isWhitelisted == true {
      groupID = exp.Whitelist[entityID]
    } else {
      // Get the group from the assigner
      groupID, err = service.assigner.AssignGroup(entityID, *exp)
      if err != nil {
        return nil, err
      }
      // Store the group.
      _, err = service.store.SetExperimentGroup(context.Background(),
          &data.StoreMessage {
            EntityId: entityID,
            ExperimentId: exp.Info.Id,
            GroupId: groupID })
      if err != nil {
        return nil, err
      }
    }
  } else {
    groupID = response.GroupId
  }

	group, ok := exp.GroupsInfo[groupID]
	if ok == false {
		return nil, fmt.Errorf("Group with id %s does not exist!", groupID)
	}
  return &data.Variables{group.Variables}, nil

}
