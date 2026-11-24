import test from 'node:test';
import assert from 'node:assert/strict';
import { wrapOffset } from '../src/infinite.js';
import { crossfade,transitionProgress } from '../src/transitions.js';
test('continuous wrapping in both directions',()=>{
  assert.equal(wrapOffset(100,100),0);
  assert.equal(wrapOffset(-10,100),90);
  assert.equal(wrapOffset(245,100),45);
});
test('invalid cycle rejects',()=>{
  assert.throws(()=>wrapOffset(1,0),RangeError);
  assert.throws(()=>wrapOffset(Infinity,10),RangeError);
});
test('crossfade endpoints and midpoint',()=>{
  assert.deepEqual(crossfade(0,.2,.8),{outgoing:1,incoming:0});
  assert.deepEqual(crossfade(1,.2,.8),{outgoing:0,incoming:1});
  assert.ok(Math.abs(crossfade(.5,.2,.8).incoming-.5)<1e-12);
});
test('easing is monotonic and rejects invalid interval',()=>{
  assert.ok(transitionProgress(.25)<transitionProgress(.75));
  assert.throws(()=>transitionProgress(.5,.8,.2),RangeError);
});
