package interfaces

import (
	"fmt"
	"time"
)

// ExperimentInfo holds general information about the experiment.
type ExperimentInfo struct {
	ID      string
	Started time.Time
	Seed    int
	Size    float64
}

// ExperimentVariables specifies values for variables.
type ExperimentVariables map[string]string

// VariableOptions specifies a list of options a variable can have.
type VariableOptions []string

// GroupDescription specifies the size of the group and the value for the experiment variables.
type GroupDescription struct {
	Size      float64
	Variables ExperimentVariables
}

type ExperimentDescription struct {
	// Info encapsulates general data about the experiment like ID and start time.
	Info ExperimentInfo
	// VariablesInfo represents the map of allowed variables with their possible options.
	VariablesInfo map[string]VariableOptions
	// Group maps a group name to its corresponding description.
	Groups map[string]GroupDescription
	// Whitelist maps an entity id to a specific group ID.
	Whitelist map[string]string
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
	err = desc.Info.Validate()
	if err != nil {
		return err
	}
	for variable, _ := range desc.VariablesInfo {
		if variable == "" {
			return fmt.Errorf("Invalid variable name: '' (empty string).")
		}
	}
	totalSize := 0.0
	for group, description := range desc.Groups {
		if group == "" {
			return fmt.Errorf("Invalid group name: '' (empty string).")
		}
		if description.Size < 0 {
			return fmt.Errorf("Invalid size for group %s: %f (< 0)", group, description.Size)
		}
		if description.Size > 1 {
			return fmt.Errorf("Invalid size for group %s: %f (> 1)", group, description.Size)
		}
		totalSize += description.Size
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
