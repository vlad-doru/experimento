package main

import (
	"github.com/vlad-doru/experimento/backend/data"
	"github.com/vlad-doru/experimento/backend/repositories"
	"github.com/vlad-doru/experimento/backend/utils/service"

	"github.com/urfave/cli"
	"google.golang.org/grpc"
	"log"
	"os"
)

func start(r data.RepositoryServer, c *cli.Context) {
	s := grpc.NewServer()
	data.RegisterRepositoryServer(s, r)
	service.Start(s, c)
}

func main() {
	app := service.NewApp()
	app.Name = "Experimento Repository"
	app.Usage = "holds information about experiments"
	app.Version = "v1.0"

	app.Commands = []cli.Command{
		{
			Name:    "redis",
			Aliases: []string{"r"},
			Usage:   "start a redis based repository service",
			Flags: []cli.Flag{
				cli.StringFlag{
					Name:  "addr",
					Value: "",
					Usage: "address of the redis server",
				},
				cli.StringFlag{
					Name:  "password",
					Value: "",
					Usage: "password of the redis server",
				},
			},
			Action: func(c *cli.Context) error {
				r, err := repositories.NewRedisRepository(c.String("addr"), c.String("password"))
				if err != nil {
					log.Fatalf("Fatal Error: %v", err)
				}
				start(r, c)
				return nil
			},
		},
	}

	app.Run(os.Args)
}
