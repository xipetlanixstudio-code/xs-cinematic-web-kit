import test from 'node:test';
import assert from 'node:assert/strict';
import { scrollProgress } from '../src/scroll-progress.js';
test('viewport traversal', () => {
  assert.equal(scrollProgress(800, 400, 800), 0);
  assert.equal(scrollProgress(200, 400, 800), 0.5);
  assert.equal(scrollProgress(-400, 400, 800), 1);
});
test('clamping and invalid geometry', () => {
  assert.equal(scrollProgress(900, 400, 800), 0);
  assert.equal(scrollProgress(-500, 400, 800), 1);
  assert.throws(() => scrollProgress(0, 100, 0), RangeError);
});
