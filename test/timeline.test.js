import test from 'node:test';
import assert from 'node:assert/strict';
import { clamp01, sceneProgress, sampleTimeline } from '../src/timeline.js';
test('scene progress clamps and interpolates',()=>{
  assert.equal(sceneProgress(100,2000,1000),0);
  assert.equal(sceneProgress(-500,2000,1000),.5);
  assert.equal(sceneProgress(-1200,2000,1000),1);
});
test('rejects invalid scene dimensions',()=>{
  assert.throws(()=>sceneProgress(0,500,500),RangeError);
  assert.throws(()=>sceneProgress(NaN,1000,500),RangeError);
});
test('piecewise timeline',()=>{
  const frames=[{at:0,value:0},{at:.5,value:20},{at:1,value:10}];
  assert.equal(sampleTimeline(frames,.25),10);
  assert.equal(sampleTimeline(frames,.75),15);
  assert.equal(sampleTimeline(frames,2),10);
});
test('timeline validation and clamping',()=>{
  assert.throws(()=>sampleTimeline([],0),RangeError);
  assert.throws(()=>sampleTimeline([{at:.5,value:1},{at:.5,value:2}],0),RangeError);
  assert.throws(()=>clamp01(Infinity),RangeError);
  assert.equal(clamp01(-1),0);
});
