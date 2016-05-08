package interfaces

import (
	"fmt"
	"sort"
	"time"
)

// ExperimentInfo holds general information about the experiment.
type ExperimentInfo struct {
	ID      string
	Started time.Time
	Seed    uint64
	Size    float64
}

// ExperimentVariables specifies values for variables.
type ExperimentVariables map[string]string

// VariableOptions specifies a list of options a variable can have.
type VariableOptions []string

// GroupDescription specifies the size of the group and the value for the experiment variables.
type GroupDescription struct {
	// StartSize tells us what is the size of the group in a typical A/B testing setup.
	StartSize float64
	Variables ExperimentVariables
}

type ExperimentDescription struct {
	// Info encapsulates general data about the experiment like ID and start time.
	ExperimentInfo
	// VariablesInfo represents the map of allowed variables with their possible options.
	VariablesInfo map[string]VariableOptions
	// Group maps a group name to its corresponding description.
	Groups map[string]GroupDescription
	// Whitelist maps an entity id to a specific group ID.
	Whitelist map[string]string

	// We should use this random number generator for this experiment.
	// We allow to have the group ids sorted since it will probably be often used.
	SortedGroupIDs []string
	// We allow auxiliary information to be carried by the description.
	AuxiliaryInfo map[string]interface{}
}

func NewExperimentDescription(
	info ExperimentInfo,
	varsInfo map[string]VariableOptions,
	groups map[string]GroupDescription,
	whitelist map[string]string,
) (ExperimentDescription, error) {
	desc := ExperimentDescription{
		ExperimentInfo: info,
		VariablesInfo:  varsInfo,
		Groups:         groups,
		Whitelist:      whitelist}
	// Validate the experiment description.
	err := desc.Validate()
	if err != nil {
		return desc, err
	}
	// Sort the group ids.
	desc.SortedGroupIDs = make([]string, 0)
	for group_id, _ := range desc.Groups {
		desc.SortedGroupIDs = append(desc.SortedGroupIDs, group_id)
	}
	sort.Strings(desc.SortedGroupIDs)
	// Return the result.
	return desc, nil
}

// Validate checks if all the fields of an ExperimentInfo struct are correctly set.
func (info *ExperimentInfo) Validate() error {
	if info.ID == "" {
		return fmt.Errorf("Invalid experiment ID: '' (empty string).")
	}
	if info.Size < 0 {
		return fmt.Errorf("Invalid experiment size %f (<0).", info.Size)
	}
	if info.Size > 1 {
		return fmt.Errorf("Invalid experiment size %f (>1).", info.Size)
	}
	return nil
}

// Validate checks if all the fields of an ExperimentDescription struct are correctly set.
func (desc *ExperimentDescription) Validate() error {
	// Valdiate the ExperimentInfo
	var err error
	err = desc.ExperimentInfo.Validate()
	if err != nil {
		return err
	}
	// Validate the variables info.
	for variable, _ := range desc.VariablesInfo {
		if variable == "" {
			return fmt.Errorf("Invalid variable name: '' (empty string).")
		}
	}
	// Validate the group descriptions.
	totalSize := 0.0
	for group, description := range desc.Groups {
		if group == "" {
			return fmt.Errorf("Invalid group name: '' (empty string).")
		}
		if description.StartSize < 0 {
			return fmt.Errorf("Invalid size for group %s: %f (< 0)", group, description.StartSize)
		}
		if description.StartSize > 1 {
			return fmt.Errorf("Invalid size for group %s: %f (> 1)", group, description.StartSize)
		}
		totalSize += description.StartSize
		for variable, value := range description.Variables {
			err = desc.allowedVariableValue(variable, value)
			if err != nil {
				return err
			}
		}
	}
	if totalSize != 1 {
		return fmt.Errorf("Invalid group sizes as they add up to %f, not 1.", totalSize)
	}
	// Validate the whitelist.
	for entity_id, group_id := range desc.Whitelist {
		_, ok := desc.Groups[group_id]
		if ok == false {
			return fmt.Errorf("Invalid group: %s assigned to whitelisted entity id: %s.", group_id, entity_id)
		}
	}
	return nil
}

func (desc *ExperimentDescription) allowedVariableValue(variable, value string) error {
	allowedValues, ok := desc.VariablesInfo[variable]
	if ok == false {
		return fmt.Errorf("Non declared variable name: %s", variable)
	}
	for _, v := range allowedValues {
		if v == value {
			return nil
		}
	}
	return fmt.Errorf("Non declared value option for variable %s: %s", variable, value)
}
