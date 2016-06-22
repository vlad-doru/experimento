FROM golang:1.6

ADD . /go/src/github.com/vlad-doru/experimento/backend

WORKDIR /go/src/github.com/vlad-doru/experimento/backend

RUN go get github.com/tools/godep
RUN godep restore ./...
RUN go build -o experimento_service ./experimento/service/main.go

EXPOSE 50051

CMD ./experimento_service -- start
