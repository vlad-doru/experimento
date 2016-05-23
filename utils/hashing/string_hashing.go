package hashing

import (
	"hash/fnv"
)

const Units = ((1 << 20) - 1)
const Float64MaxUnits = float64(Units + 1)

// Hash applies a simpel FNV32 hash to our string.
func Hash(s string) uint64 {
	h := fnv.New64()
	h.Write([]byte(s))
	return h.Sum64()
}

// HashFloat gives a random float number, based on the given string.
// We always provide the same random number for the same string, seed pair.
func HashFloat(s string, seed uint64) float64 {
	// We get the hash based on the string given and xor it with the given seed.
	idSeed := Hash(s) ^ seed
	return float64(idSeed&Units) / Float64MaxUnits
}

// MapUint64ToFloat converts an uint64 into a [0, 1)
func MapUint64ToFloat(s, seed uint64) float64 {
	return float64((s^seed)%Units) / Float64MaxUnits
}
