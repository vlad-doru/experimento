
package stores

import (
	"github.com/vlad-doru/experimento/backend/data"
	"golang.org/x/net/context"
	"gopkg.in/redis.v3"
)

type RedisStore struct {
	client *redis.Client
}

func NewRedisStore(addr, password string) (*RedisStore, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       0, // use default DB
	})

	_, err := client.Ping().Result()
	if err != nil {
		return nil, err
	}
	return &RedisStore{client}, nil
}

func (store *RedisStore) SetExperimentGroup(c context.Context, m *data.StoreMessage) (*data.Response, error) {
	err := store.client.HSet(m.EntityId, m.ExperimentId, m.GroupId).Err()
  // TODO: Add an expire maybe.
	if err != nil {
		return nil, err
	}
	return &data.Response{
		Ok: true,
	}, nil
}

func (store *RedisStore) GetExperimentGroup(c context.Context, m *data.StoreMessage) (*data.StoreMessage, error) {
  result, err := store.client.HGet(m.EntityId, m.ExperimentId).Result()
  if err != nil {
    return nil, err
  }
  m.GroupId = result
  return m, nil
}
