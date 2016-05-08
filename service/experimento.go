package service

import (
	"github.com/vlad-doru/experimento/interfaces"
)

type ExperimentoService struct {
	repository interfaces.Repository
	store      interfaces.Store
	assigner   interfaces.Assigner
}

type Variables map[string]string

func NewExperimentoService(
	repository interfaces.Repository,
	store interfaces.Store,
	assigner interfaces.Assigner) ExperimentoService {

	return ExperimentoService{repository, store, assigner}
}

func (service *ExperimentoService) GetExperimentVariables(experiment_id string) Variables {
	return map[string]string{}
}
