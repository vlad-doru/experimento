package experiment

import (
	"fmt"
	"sort"
	"time"
)

// Info holds general information about the experiment.
type Info struct {
	ID   string
	Seed uint64
	Size float64
}

// Variables specifies values for variables.
type Variables map[string]string

// VariableOptions specifies a list of options a variable can have.
type VariableOptions []string

// GroupDescription specifies the size of the group and the value for the experiment variables.
type GroupDescription struct {
	// StartSize tells us what is the size of the group in a typical A/B testing setup.
	StartSize float64
	Variables Variables
}

// Description holds all the necessary information we need to know about an experiment.
type Description struct {
	// Info encapsulates general data about the experiment like ID and start time.
	Info
	// Started tells us when we strted the experiment.
	Started time.Time
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

// NewDescription returns a new, initialized, Description object.
func NewDescription(
	info Info,
	varsInfo map[string]VariableOptions,
	groups map[string]GroupDescription,
	whitelist map[string]string,
) (Description, error) {
	desc := Description{
		Info:          info,
		Started:       time.Now(),
		VariablesInfo: varsInfo,
		Groups:        groups,
		Whitelist:     whitelist}
	// Validate the experiment description.
	err := desc.Validate()
	if err != nil {
		return desc, err
	}
	// Sort the group ids.
	desc.SortedGroupIDs = make([]string, 0)
	for groupID := range desc.Groups {
		desc.SortedGroupIDs = append(desc.SortedGroupIDs, groupID)
	}
	sort.Strings(desc.SortedGroupIDs)
	// Return the result.
	return desc, nil
}

// Validate checks if all the fields of an ExperimentInfo struct are correctly set.
func (info *Info) Validate() error {
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
func (desc *Description) Validate() error {
	// Valdiate the ExperimentInfo
	var err error
	err = desc.Info.Validate()
	if err != nil {
		return err
	}
	// Validate the variables info.
	for variable := range desc.VariablesInfo {
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
	for entityID, groupID := range desc.Whitelist {
		_, ok := desc.Groups[groupID]
		if ok == false {
			return fmt.Errorf("Invalid group: %s assigned to whitelisted entity id: %s.", groupID, entityID)
		}
	}
	return nil
}

func (desc *Description) allowedVariableValue(variable, value string) error {
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
