package main

import (
	"github.com/vlad-doru/experimento/backend/data"
	"github.com/vlad-doru/experimento/backend/experimento"
	"github.com/vlad-doru/experimento/backend/assigners"
	"github.com/vlad-doru/experimento/backend/utils/service"

	"github.com/urfave/cli"
	"google.golang.org/grpc"
	"log"
	"os"
)

func start(serv data.ExperimentoServer, c *cli.Context) {
	s := grpc.NewServer()
	data.RegisterExperimentoServer(s, serv)
	service.Start(s, c)
}

func main() {
	app := service.NewApp()
	app.Name = "Experimento Repository"
	app.Usage = "holds information about experiments"
	app.Version = "v1.0"

	app.Commands = []cli.Command{
		{
			Name:    "start",
			Aliases: []string{"s"},
			Usage:   "start the main experimento service",
			Flags: []cli.Flag{
				cli.StringFlag{
					Name:  "store_addr",
					Value: "",
					Usage: "address of the store service",
					EnvVar: "STORE_ADDR",
				},
				cli.StringFlag{
					Name:  "repository_addr",
					Value: "",
					Usage: "address of the repository service",
					EnvVar: "REPOSITORY_ADDR",
				},
			},
			Action: func(c *cli.Context) error {
				conn, err := grpc.Dial(c.String("store_addr"), grpc.WithInsecure())
				if err != nil {
					log.Fatalf("Fail to dial store: %v", err)
				}
				defer conn.Close()
				store := data.NewStoreClient(conn)
				conn, err = grpc.Dial(c.String("repository_addr"), grpc.WithInsecure())
				if err != nil {
					log.Fatalf("Fail to dial repository: %v", err)
				}
				defer conn.Close()
				repository := data.NewRepositoryClient(conn)
				assigner := assigners.NewBasicAB()
				s := experimento.NewExperimentoServer(store, repository, assigner)
				if err != nil {
					log.Fatalf("Fatal Error: %v", err)
				}
				start(s, c)
				return nil
			},
		},
	}

	app.Run(os.Args)
}
