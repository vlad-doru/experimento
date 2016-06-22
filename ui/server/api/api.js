var router = require('koa-router')();
var koaBody = require('koa-body')();
var grpc = require('grpc');
var util = require('util');
var thunkify = require('thunkify');
var Promise = require('bluebird')

import config from '../../config';

import __ from 'lodash';

const PROTO_PATH = __dirname + '/proto/messages.proto';
var data = grpc.load(PROTO_PATH).data;
var client = new data.Repository(config.repository, grpc.credentials.createInsecure());
Promise.promisifyAll(client);
var experimento = new data.Experimento(config.experimento, grpc.credentials.createInsecure());
Promise.promisifyAll(experimento);

function ConstructExperiment(body) {
  const info = body.info;
  const vars = body.variables;
  const groups = body.groups;
  const whitelist = body.whitelist;
  const groupSize = 1 / Object.keys(groups || {}).length;
  return {
    info: {
      id: info.id,
      seed_value: info.seed,
      size: info.size,
      started: Date.now(),
    },
    variables_info: __.mapValues(vars,
      (opts) => {return {options: opts}}),
    groups_info: __.mapValues(groups,
      (vars) => {return {
        initial_size: groupSize,
        variables: vars,
      }}
    ),
    whitelist: whitelist,
  }
}

router.post('/api/create', koaBody, function *(next) {
    const exp = ConstructExperiment(this.request.body);
    var response = yield client.saveExperimentAsync(exp)
    this.body = response;
});

router.post('/api/drop', koaBody, function *(next) {
    var response = yield client.dropExperimentAsync(this.request.body.info)
    this.body = response;
});

router.get('/api/list', koaBody, function *(next) {
    var response = yield client.getExperimentsAsync(this.request.body.info)
    this.body = response;
});

router.post('/api/query', koaBody, function *(next) {
    const entities = this.request.body.entities
    const id = this.request.body.id
    let promises = __.chain(entities)
      .map((entity) =>
        experimento.getVariablesAsync({
          entity_id: entity,
          info: {
            id: id,
          }
        })
      )
      .value()
    let results = yield Promise.all(promises);
    this.body = __.zipObject(entities, results);
});

export default router;
