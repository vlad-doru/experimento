package hashing

import (
	"hash/fnv"
	"math/rand"
)

// Hash applies a simpel FNV32 hash to our string.
func Hash(s string) uint64 {
	h := fnv.New64()
	h.Write([]byte(s))
	return h.Sum64()
}

const modFactor = (1 << 10) - 1

// HashFloat gives a random float number, based on the given string.
// We always provide the same random number for the same string, seed pair.
func HashFloat(s string, seed uint64) float64 {
	// We get the hash based on the string given and xor it with the given seed.
	idSeed := Hash(s) ^ seed
	// We use this idSeed to generate a random number in [0, 1) interval.
	generator := rand.New(rand.NewSource(int64(idSeed)))
	return generator.Float64()
}
