package main

import (
	"github.com/vlad-doru/experimento/assigners"
	"github.com/vlad-doru/experimento/experiment"
	"github.com/vlad-doru/experimento/repositories"
	"github.com/vlad-doru/experimento/service"
	"github.com/vlad-doru/experimento/stores"

	"fmt"
)

func main() {
	repository := repositories.NewMemoryRepository()
	store := stores.NewMemoryStore()
	assigner := assigners.NewABTesting()

	info := experiment.Info{
		ID:   "experiment",
		Seed: 24,
		Size: 0.1,
	}
	varsInfo := map[string]experiment.VariableOptions{
		"var": experiment.VariableOptions{"a", "b"},
	}
	groups := map[string]experiment.GroupDescription{
		"control": experiment.GroupDescription{
			StartSize: 0.5,
			Variables: experiment.Variables{
				"var": "a",
			},
		},
		"test": experiment.GroupDescription{
			StartSize: 0.5,
			Variables: experiment.Variables{
				"var": "b",
			},
		},
	}
	whitelist := map[string]string{}
	desc, err := experiment.NewDescription(info, varsInfo, groups, whitelist)
	if err != nil {
		fmt.Printf("Eroare fatala: %v", err)
		return
	}
	err = repository.CreateExperiment(desc)
	if err != nil {
		fmt.Printf("Eroare fatal: %v", err)
		return
	}

	s := service.NewExperimentoService(repository, store, assigner)
	v, err := s.GetAllVariables("vlad")
	if err != nil {
		fmt.Printf("Eroare la get: %v", err)
		return
	}
	fmt.Printf("Variabile: %+v", v)
}
