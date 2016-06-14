/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

goog.provide('proto.data.Experiment');
goog.provide('proto.data.Experiment.GroupsInfoEntry');
goog.provide('proto.data.Experiment.VariablesInfoEntry');
goog.provide('proto.data.Experiment.WhitelistEntry');

goog.require('jspb.Message');
goog.require('proto.data.ExperimentInfo');
goog.require('proto.data.GroupInfo');
goog.require('proto.data.VariableInfo');
goog.require('proto.google.protobuf.Any');


/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.data.Experiment = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.data.Experiment.repeatedFields_, null);
};
goog.inherits(proto.data.Experiment, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.data.Experiment.displayName = 'proto.data.Experiment';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.data.Experiment.repeatedFields_ = [2,3,4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.data.Experiment.prototype.toObject = function(opt_includeInstance) {
  return proto.data.Experiment.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.data.Experiment} msg The msg instance to transform.
 * @return {!Object}
 */
proto.data.Experiment.toObject = function(includeInstance, msg) {
  var f, obj = {
    info: (f = msg.getInfo()) && proto.data.ExperimentInfo.toObject(includeInstance, f),
    variablesInfoList: jspb.Message.toObjectList(msg.getVariablesInfoList(),
    proto.data.Experiment.VariablesInfoEntry.toObject, includeInstance),
    groupsInfoList: jspb.Message.toObjectList(msg.getGroupsInfoList(),
    proto.data.Experiment.GroupsInfoEntry.toObject, includeInstance),
    whitelistList: jspb.Message.toObjectList(msg.getWhitelistList(),
    proto.data.Experiment.WhitelistEntry.toObject, includeInstance),
    details: (f = msg.getDetails()) && proto.google.protobuf.Any.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.data.Experiment} The clone.
 */
proto.data.Experiment.prototype.cloneMessage = function() {
  return /** @type {!proto.data.Experiment} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional ExperimentInfo info = 1;
 * @return {proto.data.ExperimentInfo}
 */
proto.data.Experiment.prototype.getInfo = function() {
  return /** @type{proto.data.ExperimentInfo} */ (
    jspb.Message.getWrapperField(this, proto.data.ExperimentInfo, 1));
};


/** @param {proto.data.ExperimentInfo|undefined} value  */
proto.data.Experiment.prototype.setInfo = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.data.Experiment.prototype.clearInfo = function() {
  this.setInfo(undefined);
};


/**
 * repeated VariablesInfoEntry variables_info = 2;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.data.Experiment.VariablesInfoEntry>}
 */
proto.data.Experiment.prototype.getVariablesInfoList = function() {
  return /** @type{!Array.<!proto.data.Experiment.VariablesInfoEntry>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.data.Experiment.VariablesInfoEntry, 2));
};


/** @param {Array.<!proto.data.Experiment.VariablesInfoEntry>|undefined} value  */
proto.data.Experiment.prototype.setVariablesInfoList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 2, value);
};


proto.data.Experiment.prototype.clearVariablesInfoList = function() {
  this.setVariablesInfoList([]);
};


/**
 * repeated GroupsInfoEntry groups_info = 3;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.data.Experiment.GroupsInfoEntry>}
 */
proto.data.Experiment.prototype.getGroupsInfoList = function() {
  return /** @type{!Array.<!proto.data.Experiment.GroupsInfoEntry>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.data.Experiment.GroupsInfoEntry, 3));
};


/** @param {Array.<!proto.data.Experiment.GroupsInfoEntry>|undefined} value  */
proto.data.Experiment.prototype.setGroupsInfoList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 3, value);
};


proto.data.Experiment.prototype.clearGroupsInfoList = function() {
  this.setGroupsInfoList([]);
};


/**
 * repeated WhitelistEntry whitelist = 4;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.data.Experiment.WhitelistEntry>}
 */
proto.data.Experiment.prototype.getWhitelistList = function() {
  return /** @type{!Array.<!proto.data.Experiment.WhitelistEntry>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.data.Experiment.WhitelistEntry, 4));
};


/** @param {Array.<!proto.data.Experiment.WhitelistEntry>|undefined} value  */
proto.data.Experiment.prototype.setWhitelistList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 4, value);
};


proto.data.Experiment.prototype.clearWhitelistList = function() {
  this.setWhitelistList([]);
};


/**
 * optional google.protobuf.Any details = 100;
 * @return {proto.google.protobuf.Any}
 */
proto.data.Experiment.prototype.getDetails = function() {
  return /** @type{proto.google.protobuf.Any} */ (
    jspb.Message.getWrapperField(this, proto.google.protobuf.Any, 100));
};


/** @param {proto.google.protobuf.Any|undefined} value  */
proto.data.Experiment.prototype.setDetails = function(value) {
  jspb.Message.setWrapperField(this, 100, value);
};


proto.data.Experiment.prototype.clearDetails = function() {
  this.setDetails(undefined);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.data.Experiment.VariablesInfoEntry = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.data.Experiment.VariablesInfoEntry, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.data.Experiment.VariablesInfoEntry.displayName = 'proto.data.Experiment.VariablesInfoEntry';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.data.Experiment.VariablesInfoEntry.prototype.toObject = function(opt_includeInstance) {
  return proto.data.Experiment.VariablesInfoEntry.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.data.Experiment.VariablesInfoEntry} msg The msg instance to transform.
 * @return {!Object}
 */
proto.data.Experiment.VariablesInfoEntry.toObject = function(includeInstance, msg) {
  var f, obj = {
    key: msg.getKey(),
    value: (f = msg.getValue()) && proto.data.VariableInfo.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.data.Experiment.VariablesInfoEntry} The clone.
 */
proto.data.Experiment.VariablesInfoEntry.prototype.cloneMessage = function() {
  return /** @type {!proto.data.Experiment.VariablesInfoEntry} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string key = 1;
 * @return {string}
 */
proto.data.Experiment.VariablesInfoEntry.prototype.getKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.data.Experiment.VariablesInfoEntry.prototype.setKey = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional VariableInfo value = 2;
 * @return {proto.data.VariableInfo}
 */
proto.data.Experiment.VariablesInfoEntry.prototype.getValue = function() {
  return /** @type{proto.data.VariableInfo} */ (
    jspb.Message.getWrapperField(this, proto.data.VariableInfo, 2));
};


/** @param {proto.data.VariableInfo|undefined} value  */
proto.data.Experiment.VariablesInfoEntry.prototype.setValue = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.data.Experiment.VariablesInfoEntry.prototype.clearValue = function() {
  this.setValue(undefined);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.data.Experiment.GroupsInfoEntry = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.data.Experiment.GroupsInfoEntry, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.data.Experiment.GroupsInfoEntry.displayName = 'proto.data.Experiment.GroupsInfoEntry';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.data.Experiment.GroupsInfoEntry.prototype.toObject = function(opt_includeInstance) {
  return proto.data.Experiment.GroupsInfoEntry.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.data.Experiment.GroupsInfoEntry} msg The msg instance to transform.
 * @return {!Object}
 */
proto.data.Experiment.GroupsInfoEntry.toObject = function(includeInstance, msg) {
  var f, obj = {
    key: msg.getKey(),
    value: (f = msg.getValue()) && proto.data.GroupInfo.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.data.Experiment.GroupsInfoEntry} The clone.
 */
proto.data.Experiment.GroupsInfoEntry.prototype.cloneMessage = function() {
  return /** @type {!proto.data.Experiment.GroupsInfoEntry} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string key = 1;
 * @return {string}
 */
proto.data.Experiment.GroupsInfoEntry.prototype.getKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.data.Experiment.GroupsInfoEntry.prototype.setKey = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional GroupInfo value = 2;
 * @return {proto.data.GroupInfo}
 */
proto.data.Experiment.GroupsInfoEntry.prototype.getValue = function() {
  return /** @type{proto.data.GroupInfo} */ (
    jspb.Message.getWrapperField(this, proto.data.GroupInfo, 2));
};


/** @param {proto.data.GroupInfo|undefined} value  */
proto.data.Experiment.GroupsInfoEntry.prototype.setValue = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.data.Experiment.GroupsInfoEntry.prototype.clearValue = function() {
  this.setValue(undefined);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.data.Experiment.WhitelistEntry = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.data.Experiment.WhitelistEntry, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.data.Experiment.WhitelistEntry.displayName = 'proto.data.Experiment.WhitelistEntry';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.data.Experiment.WhitelistEntry.prototype.toObject = function(opt_includeInstance) {
  return proto.data.Experiment.WhitelistEntry.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.data.Experiment.WhitelistEntry} msg The msg instance to transform.
 * @return {!Object}
 */
proto.data.Experiment.WhitelistEntry.toObject = function(includeInstance, msg) {
  var f, obj = {
    key: msg.getKey(),
    value: msg.getValue()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.data.Experiment.WhitelistEntry} The clone.
 */
proto.data.Experiment.WhitelistEntry.prototype.cloneMessage = function() {
  return /** @type {!proto.data.Experiment.WhitelistEntry} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string key = 1;
 * @return {string}
 */
proto.data.Experiment.WhitelistEntry.prototype.getKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.data.Experiment.WhitelistEntry.prototype.setKey = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string value = 2;
 * @return {string}
 */
proto.data.Experiment.WhitelistEntry.prototype.getValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.data.Experiment.WhitelistEntry.prototype.setValue = function(value) {
  jspb.Message.setField(this, 2, value);
};

