# Experimento

This projects aims at designing an experimentation service, which will then be used to perform various tests in any kind of application.  

## Concepts

Experimento was designed to be highly extensible and customizable. We want to have everything decoupled in such a way that will allow us to easily swap components. This application follows an architecture based on microservices, while communicating through gRPC.

## Installation

dockker-compose up

## Usage

We include a UI component that can be accessed at localhost:3000.
The API for communication is described in backend/data/messages.proto

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Deploying

We recomend that you deploy this service through Kubernetes. Controllers and services files will be coming soon.

## Credits

Main Developer: [Vlad-Doru Ion](http://github.com/vlad-doru)

## License

Apache License 2.0
