import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const html=readFileSync(new URL('../lab/index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../lab/lab.js',import.meta.url),'utf8');
test('lab has unique IDs and valid label targets',()=>{
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length);
  for(const [,id] of html.matchAll(/\bfor="([^"]+)"/g))assert.ok(ids.includes(id),id);
});
test('lab script element references exist',()=>{
  for(const [,id] of js.matchAll(/\$\('([^']+)'\)/g))assert.ok(html.includes('id="'+id+'"'),id);
  for(const [,id] of html.matchAll(/data-copy="([^"]+)"/g))assert.ok(html.includes('id="'+id+'"'),id);
});
test('lab links and version are consistent',()=>{
  for(const path of ['../lab/lab.js','../lab/lab.css','../src/motion.css'])assert.ok(existsSync(new URL(path,import.meta.url)));
  const pkg=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
  assert.ok(html.includes(pkg.version));
  assert.ok(readFileSync(new URL('../index.html',import.meta.url),'utf8').includes('href="./lab/"'));
});
