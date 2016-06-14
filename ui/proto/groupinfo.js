/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

goog.provide('proto.data.GroupInfo');
goog.provide('proto.data.GroupInfo.VariablesEntry');

goog.require('jspb.Message');


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
proto.data.GroupInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.data.GroupInfo.repeatedFields_, null);
};
goog.inherits(proto.data.GroupInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.data.GroupInfo.displayName = 'proto.data.GroupInfo';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.data.GroupInfo.repeatedFields_ = [2];



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
proto.data.GroupInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.data.GroupInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.data.GroupInfo} msg The msg instance to transform.
 * @return {!Object}
 */
proto.data.GroupInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    initialSize: msg.getInitialSize(),
    variablesList: jspb.Message.toObjectList(msg.getVariablesList(),
    proto.data.GroupInfo.VariablesEntry.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Creates a deep clone of this proto. No data is shared with the original.
 * @return {!proto.data.GroupInfo} The clone.
 */
proto.data.GroupInfo.prototype.cloneMessage = function() {
  return /** @type {!proto.data.GroupInfo} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional double initial_size = 1;
 * @return {number}
 */
proto.data.GroupInfo.prototype.getInitialSize = function() {
  return /** @type {number} */ (jspb.Message.getFieldProto3(this, 1, 0));
};


/** @param {number} value  */
proto.data.GroupInfo.prototype.setInitialSize = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * repeated VariablesEntry variables = 2;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.data.GroupInfo.VariablesEntry>}
 */
proto.data.GroupInfo.prototype.getVariablesList = function() {
  return /** @type{!Array.<!proto.data.GroupInfo.VariablesEntry>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.data.GroupInfo.VariablesEntry, 2));
};


/** @param {Array.<!proto.data.GroupInfo.VariablesEntry>|undefined} value  */
proto.data.GroupInfo.prototype.setVariablesList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 2, value);
};


proto.data.GroupInfo.prototype.clearVariablesList = function() {
  this.setVariablesList([]);
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
proto.data.GroupInfo.VariablesEntry = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.data.GroupInfo.VariablesEntry, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.data.GroupInfo.VariablesEntry.displayName = 'proto.data.GroupInfo.VariablesEntry';
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
proto.data.GroupInfo.VariablesEntry.prototype.toObject = function(opt_includeInstance) {
  return proto.data.GroupInfo.VariablesEntry.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.data.GroupInfo.VariablesEntry} msg The msg instance to transform.
 * @return {!Object}
 */
proto.data.GroupInfo.VariablesEntry.toObject = function(includeInstance, msg) {
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
 * @return {!proto.data.GroupInfo.VariablesEntry} The clone.
 */
proto.data.GroupInfo.VariablesEntry.prototype.cloneMessage = function() {
  return /** @type {!proto.data.GroupInfo.VariablesEntry} */ (jspb.Message.cloneMessage(this));
};


/**
 * optional string key = 1;
 * @return {string}
 */
proto.data.GroupInfo.VariablesEntry.prototype.getKey = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 1, ""));
};


/** @param {string} value  */
proto.data.GroupInfo.VariablesEntry.prototype.setKey = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional string value = 2;
 * @return {string}
 */
proto.data.GroupInfo.VariablesEntry.prototype.getValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldProto3(this, 2, ""));
};


/** @param {string} value  */
proto.data.GroupInfo.VariablesEntry.prototype.setValue = function(value) {
  jspb.Message.setField(this, 2, value);
};


