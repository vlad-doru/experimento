import ProtoBuf from "protobufjs";

import __ from 'lodash';

const builder = ProtoBuf.loadProtoFile("proto/messages.proto");
const data = builder.build('data');
const Experiment = data.Experiment;

export default function ConstructExperiment(info, vars, groups, whitelist) {
  const groupSize = 1 / Object.keys(groups).length;
  let temp = {
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
  let exp = new Experiment(temp);
  return exp;
}
