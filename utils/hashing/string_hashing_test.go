package hashing_test

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/vlad-doru/experimento/utils/hashing"
)

func TestHashFloat(t *testing.T) {
	seed := hashing.Hash("experimento")
	f := hashing.HashFloat("hash", seed)
	assert.True(t, (f >= 0) && (f < 1), "Invariant violation of the hash function")
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
