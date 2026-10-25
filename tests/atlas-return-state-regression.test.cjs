const assert = require('node:assert/strict');
const state = require('../atlas-return-state.js');
assert.equal(state.decode('atlas=earth').zoom, null, 'missing zoom must not be zero');
assert.equal(state.decode('atlas=earth').x, null, 'missing x must not be zero');
assert.equal(state.decode('atlas=earth').y, null, 'missing y must not be zero');
assert.equal(state.decode('atlas=earth&zoom=0').zoom, 0, 'explicit zero is valid');
console.log('Atlas return state checks passed');
