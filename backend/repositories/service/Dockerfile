FROM golang:1.6

ADD . /go/src/github.com/vlad-doru/experimento/backend

RUN go install github.com/golang/vlad-doru/experimento/backend

CMD go run /go/src/github.com/vlad-doru/experimento/backend/repositories/service/main.go -- redis --addr=":6367"
