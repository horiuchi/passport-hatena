var vows = require('vows');
var assert = require('assert');
var util = require('util');
var hatena = require('passport-hatena');

vows.describe('passport-hatena').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(hatena.version);
    },
  },
  
}).export(module);
