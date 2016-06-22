package service

import (
	"fmt"
	"github.com/urfave/cli"
	"google.golang.org/grpc"
	"log"
	"net"
)

func NewApp() *cli.App {
	app := cli.NewApp()

	app.Flags = []cli.Flag{
		cli.IntFlag{
			Name:  "port",
			Value: 50051,
			Usage: "port of the service",
			EnvVar: "SERVICE_PORT",
		},
	}
	return app
}

// Start is a utility function that allows us to avoid a lot of the
// duplicate work necessary to have a server up and running.
func Start(s *grpc.Server, c *cli.Context) {
	port := c.GlobalInt("port")
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	log.Printf("Started the microservice: %s\n", c.App.Name)
	s.Serve(lis)
}
