package interfaces

// ExperimentoRepository describes an interface for storing all the data about
// experiments, including group partitions and variables assignments.
type ExperimentoRepository interface {
	CreateExperiment(ExperimentDescription) error
	GetExperiment(string id) (ExperimentDescription, error)
	DestroyExperiment(string id) error

	// GetExperiments should return a map describing all the existing experiments.
	// We recommend aggresive caching at this level.
	GetExperiments() (error, map[string]ExperimentDescription)
}

type ExperimentoAssociationDB interface {
	SetExperimentGroup(entity_id, experiment_id, group string) error
	FetchExperimentGroup(entity_id, experiment_id string) (string, error)
}

type ExperimentoAssigner interface {
	AssignExperimentGroup(entity_id string, desc ExperimentDescription) (string, error)
}
