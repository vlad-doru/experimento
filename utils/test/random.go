package test

import (
	"math/rand"
	"time"
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

// SetSeed sets the seed for the random number generator.
func SetSeed(seed int64) {
	rand.Seed(seed)
}

// RandStringN is used to generate a random string of length n.
func RandStringN(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}

// RandString is used to generate a random string of length n.
func RandString(minSize, maxSize int) string {
	size := minSize + rand.Intn(maxSize-minSize)
	return RandStringN(size)
}
