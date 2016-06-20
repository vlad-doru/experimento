package repositories

import (
	"github.com/vlad-doru/experimento/backend/data"
	"golang.org/x/net/context"
)

type RedisRepository struct {
	experiments map[string]*data.Experiment
}

func NewRedisRepository() *RedisRepository {
	experiments := make(map[string]*data.Experiment)
	return &RedisRepository{experiments}
}

func (repository *RedisRepository) SaveExperiment(c context.Context, exp *data.Experiment) (*data.Response, error) {
	_, ok := repository.experiments[exp.Info.Id]
	if ok == true {
		return &data.Response{
			Ok:    false,
			Error: "There is already an experiment with the given id!",
		}, nil
	}
	repository.experiments[exp.Info.Id] = exp
	return &data.Response{
		Ok: true,
	}, nil
}

func (repository *RedisRepository) DropExperiment(c context.Context, info *data.ExperimentInfo) (*data.Response, error) {
	delete(repository.experiments, info.Id)
	return &data.Response{
		Ok: true,
	}, nil
}

func (repository *RedisRepository) GetExperiments(context.Context, *data.Void) (*data.Experiments, error) {
	result := &data.Experiments{Experiments: make(map[string]*data.Experiment)}
	for key, value := range repository.experiments {
		result.Experiments[key] = value
	}
	return result, nil
}
