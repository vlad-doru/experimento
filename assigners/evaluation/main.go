package main

import (
	"github.com/vlad-doru/experimento/aggregators"
	"github.com/vlad-doru/experimento/assigners"
	"github.com/vlad-doru/experimento/utils/test"

	"fmt"
	"log"
	"math/rand"
)

const experimentID = "experiment"

func main() {
	desc, err := test.GetDefaultExperimentDescription()
	if err != nil {
		log.Fatalf("Unexpected error: %v", err)
	}
	abAgg := aggregators.NewSingleMetricMemoryAggregator()
	ab := assigners.NewBasicAB()

	banditAgg := aggregators.NewSingleMetricMemoryAggregator()
	bandit, err := assigners.NewProbBandit(banditAgg, test.BanditHoldoutSize)
	if err != nil {
		log.Fatalf("Could not construct the bandit assigner: %v", err)
	}

	// Simulation variables.
	batches := 1000
	batchSize := 100
	metricMeans := map[string]float64{
		"control": 0.40,
		"test":    0.20,
	}
	test.ExpControlGroupSize = 0.5
	test.ExpTestGroupSize = 0.5
	fmt.Println("Batch, Algorithm, Group, Mean, Samples, Variance")
	// Start the simulation.
	for i := 0; i < batches; i++ {
		for j := 0; j < batchSize; j++ {
			randID := test.RandString(6, 10)
			abGroup, err := ab.AssignGroup(randID, desc)
			if err != nil {
				log.Fatalf("Unexpected error with the AB assigner: %v", err)
			}
			addToAggregator(metricMeans, abGroup, abAgg)
			banditGroup, err := bandit.AssignGroup(randID, desc)
			if err != nil {
				log.Fatalf("Unexpected error with the Bandit assigner: %v", err)
			}
			addToAggregator(metricMeans, banditGroup, banditAgg)
		}
		// After each batch we log the performance.
		for _, group := range []string{"control", "test"} {
			r := abAgg.GetExpResults(experimentID)[group]
			fmt.Printf("%d, %s, %s, %f, %d, %f\n", i, "Basic AB Testing", group, r.Mean, int(r.Samples), r.Variance)
			r = banditAgg.GetExpResults(experimentID)[group]
			fmt.Printf("%d, %s, %s, %f, %d, %f\n", i, "Probablistic Multiarm Bandit", group, r.Mean, int(r.Samples), r.Variance)
		}
	}
}

func addToAggregator(metricMeans map[string]float64, groupID string, aggregator *aggregators.SingleMetricMemoryAggregator) {
	mean, ok := metricMeans[groupID]
	if ok == false {
		log.Fatalf("Invalid group: %s", groupID)
	}
	r := rand.Float64()
	v := 0.0
	if r < mean {
		v = 1.0
	}
	aggregator.AddMetric(experimentID, groupID, v)
}
