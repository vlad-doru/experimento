package main

import (
	"github.com/vlad-doru/experimento/backend/data"
	"github.com/vlad-doru/experimento/backend/repositories"

	"fmt"
	"google.golang.org/grpc"
	"log"
	"net"
)

const (
	port = ":50051"
)

func main() {
	// TODO: Have a cli interface to launch whatever service we receive as a
	// flag.
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	fmt.Println("Serving!")
	s := grpc.NewServer()
	data.RegisterRepositoryServer(s, repositories.NewImmutableRepository())
	s.Serve(lis)
}
