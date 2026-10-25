const assert = require('node:assert/strict');
const state = require('../atlas-return-state.js');

for (const key of ['x', 'y', 'zoom']) {
  assert.equal(state.decode('atlas=earth')[key], null, `absent ${key} must stay null`);
  assert.equal(state.decode(`atlas=earth&${key}=0`)[key], 0, `explicit zero ${key} must survive`);
  assert.equal(state.decode(`atlas=earth&${key}=invalid`)[key], null, `invalid ${key} must stay null`);
}
const original = { atlas: 'earth', mode: 'view', camera: { x: 0, y: -12, zoom: 0 }, selectedId: 'test' };
const decoded = state.decode(state.encode(original));
assert.deepEqual(
  { atlas: decoded.atlas, mode: decoded.mode, x: decoded.x, y: decoded.y, zoom: decoded.zoom, selectedId: decoded.selectedId },
  { atlas: 'earth', mode: 'view', x: 0, y: -12, zoom: 0, selectedId: 'test' },
  'camera URL state must round-trip'
);
console.log('Atlas return-state regression checks passed');
