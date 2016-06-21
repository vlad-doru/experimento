package data

import (
	"fmt"
	"sort"

	"github.com/vlad-doru/experimento/backend/utils/hashing"
)

// GroupVariable is a special variable name, reserved by the framework.
const GroupVariable string = "group"

// NewExperiment returns a new, initialized, Experiment object.
func NewExperiment(
	info *ExperimentInfo,
	varsInfo map[string]*VariableInfo,
	groups map[string]*GroupInfo,
	whitelist map[string]string,
) (Experiment, error) {
	exp := Experiment{
		Info:          info,
		VariablesInfo: varsInfo,
		GroupsInfo:    groups,
		Whitelist:     whitelist}
	// Validate the experiment description.
	err := exp.Validate()
	if err != nil {
		return exp, err
	}
	// Set the internal seed based on the hash of the experiment name.
	exp.InternalSeed = hashing.Hash(exp.Info.Id)
	// Se the exeternal seed based on the hash of the given seed.
	exp.Seed = hashing.Hash(exp.Info.SeedValue)
	// Sort the group ids.
	exp.SortedGroupIds = make([]string, 0)
	for groupID, groupInfo := range exp.GroupsInfo {
		exp.SortedGroupIds = append(exp.SortedGroupIds, groupID)
		// Set the special variable name, GroupVariable, for indicating the group.
		groupInfo.Variables[GroupVariable] = groupID
	}
	sort.Strings(exp.SortedGroupIds)
	// Return the result.
	return exp, nil
}

// Validate checks if all the fields of an ExperimentInfo struct are correctly set.
func (info *ExperimentInfo) Validate() error {
	if info.Id == "" {
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
func (exp *Experiment) Validate() error {
	// Valdiate the ExperimentInfo
	var err error
	err = exp.Info.Validate()
	if err != nil {
		return err
	}
	// Validate the variables info.
	for variable := range exp.VariablesInfo {
		if variable == "" {
			return fmt.Errorf("Invalid variable name: '' (empty string).")
		}
		if variable == GroupVariable {
			return fmt.Errorf("Invalid variable name: %s. It is a reserved variable name!", variable)
		}
	}
	// Validate the group descriptions.
	totalSize := 0.0
	for groupID, groupInfo := range exp.GroupsInfo {
		if groupID == "" {
			return fmt.Errorf("Invalid group name: '' (empty string).")
		}
		if groupInfo.InitialSize < 0 {
			return fmt.Errorf("Invalid size for group %s: %f (< 0)", groupID, groupInfo.InitialSize)
		}
		if groupInfo.InitialSize > 1 {
			return fmt.Errorf("Invalid size for group %s: %f (> 1)", groupID, groupInfo.InitialSize)
		}
		totalSize += groupInfo.InitialSize
		for variable, value := range groupInfo.Variables {
			err = exp.allowedVariableValue(variable, value)
			if err != nil {
				return err
			}
		}
	}
	if totalSize != 1 {
		return fmt.Errorf("Invalid group sizes as they add up to %f, not 1.", totalSize)
	}
	// Validate the whitelist.
	for entityID, groupID := range exp.Whitelist {
		_, ok := exp.GroupsInfo[groupID]
		if ok == false {
			return fmt.Errorf("Invalid group: %s assigned to whitelisted entity id: %s.", groupID, entityID)
		}
	}
	return nil
}

func (exp *Experiment) allowedVariableValue(variable, value string) error {
	variableInfo, ok := exp.VariablesInfo[variable]
	if ok == false {
		return fmt.Errorf("Non declared variable name: %s", variable)
	}
	for _, v := range variableInfo.Options {
		if v == value {
			return nil
		}
	}
	return fmt.Errorf("Non declared value option for variable %s: %s", variable, value)
}
