package hashing_test

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/vlad-doru/experimento/utils/hashing"
	"github.com/vlad-doru/experimento/utils/test"
)

func TestHashFloat(t *testing.T) {
	seed := hashing.Hash("experimento")
	test.SetSeed(1) // set the seed so that we can easily replicate test results
	// Check the HashFloat function for 100K random ids.
	for i := 0; i < 100000; i++ {
		id := test.RandString(6, 10)
		f := hashing.HashFloat(id, seed)
		assert.True(t, (f >= 0) && (f < 1),
			"Invariant violation of the hash function for id %s: %v", id, f)
	}
}

func BenchmarkHash(b *testing.B) {
	for i := 0; i < b.N; i++ {
		hashing.Hash("experimento")
	}
}

func BenchmarkHashFloat(b *testing.B) {
	seed := hashing.Hash("experimento")
	for i := 0; i < b.N; i++ {
		hashing.HashFloat("hashing_id", seed)
	}
}
