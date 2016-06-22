package repositories

import (
	"github.com/golang/protobuf/proto"
	"github.com/vlad-doru/experimento/backend/data"
	"golang.org/x/net/context"
	"gopkg.in/redis.v3"
)

const HKEY = "REPOSITORY"

type RedisRepository struct {
	client *redis.Client
}

func NewRedisRepository(addr, password string) (*RedisRepository, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       0, // use default DB
	})

	_, err := client.Ping().Result()
	if err != nil {
		return nil, err
	}
	return &RedisRepository{client}, nil
}

func (repository *RedisRepository) SaveExperiment(c context.Context, exp *data.Experiment) (*data.Response, error) {
	marshalled, err := proto.Marshal(exp)
	serialized := string(marshalled[:])
	if err != nil {
		return nil, err
	}
	err = repository.client.HSet(HKEY, exp.Info.Id, serialized).Err()
	if err != nil {
		return nil, err
	}
	return &data.Response{
		Ok: true,
	}, nil
}

func (repository *RedisRepository) DropExperiment(c context.Context, info *data.ExperimentInfo) (*data.Response, error) {
	err := repository.client.HDel(HKEY, info.Id).Err()
	if err != nil {
		return nil, err
	}
	return &data.Response{
		Ok: true,
	}, nil
}

func (repository *RedisRepository) GetExperiments(c context.Context, v *data.Void) (*data.Experiments, error) {
	result := &data.Experiments{
		Experiments: make(map[string]*data.Experiment),
	}
	query, err := repository.client.HGetAll(HKEY).Result()
	if err != nil {
		return nil, err
	}
	for i := 0; i < len(query)/2; i++ {
		key := query[2*i]
		serialized := query[2*i+1]
		exp := &data.Experiment{}
		proto.Unmarshal([]byte(serialized), exp)
		result.Experiments[key] = exp
	}
	return result, nil
}

func (repository *RedisRepository) GetExperiment(c context.Context, info *data.ExperimentInfo) (*data.Experiment, error) {
	serialized, err := repository.client.HGet(HKEY, info.Id).Result()
	if err != nil {
		return nil, err
	}
	exp := &data.Experiment{}
	proto.Unmarshal([]byte(serialized), exp)
	return exp, nil
}
