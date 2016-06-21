FROM golang:1.6

ADD . /go/src/github.com/vlad-doru/experimento/backend

WORKDIR /go/src/github.com/vlad-doru/experimento/backend

RUN go get github.com/tools/godep
RUN godep restore ./...

CMD go run ./repositories/service/main.go -- redis --addr="redis:6379"
