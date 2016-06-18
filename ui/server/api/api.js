var router = require('koa-router')();
var koaBody = require('koa-body')();
var grpc = require('grpc');

const PROTO_PATH = __dirname + 'proto/messages.proto';
var data = grpc.load(PROTO_PATH).data;
var client = new data.Repository('0.0.0.0:50051', grpc.credentials.createInsecure());

router.post('/api/create', koaBody, function *(next) {
    console.log(this.request.body);
    // Make the RPC request and see if we get it there.
    client.SaveExperiment({info: {id: "vlad"}}, function(err, response) {
        console.log('CALL', err, response);
    })
});

export default router;
