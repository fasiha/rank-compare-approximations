'use strict';
var test = require('tape');
var compare = require('./index');

test('sort index test', t => {
  var getSortingIndexes = require('./getSortingIndex');

  var randoms = Array.from(Array(100), _ => Math.random());
  var sorted = randoms.slice().sort((a, b) => a - b);

  var sortIdx = getSortingIndexes(randoms);
  var reconstructed = sortIdx.map(i => randoms[i]);

  t.notDeepEqual(randoms, sorted); // make sure the input isn't sorted!
  t.deepEqual(reconstructed, sorted);
  t.end();
});

test('rank-compare', t => {
  var f = x => Math.sin(2 * Math.PI * 3 * x) * 0.06 + x;
  var f2 = x => x;
  var randoms = Array.from(Array(1000), _ => Math.random());

  var actual = compare(randoms, f, f2);

  var x = randoms.slice().sort((a, b) => f(a) - f(b));
  var x2 = randoms.slice().sort((a, b) => f2(a) - f2(b));
  var xToIdx = new Map(x.map((x, i) => [x, i]));
  var x2ToIdx = new Map(x2.map((x, i) => [x, i]));
  var expected = [];
  for (var r of randoms) {
    if (!(xToIdx.has(r) && x2ToIdx.has(r))) { throw new Error('element not found'); }
    expected.push(xToIdx.get(r) - x2ToIdx.get(r));
  }

  t.deepEqual(actual, expected);
  t.notEqual(expected.reduce((prev, curr) => prev + Math.abs(curr), 0), 0, 'result should not be uniformly zero');

  // alternative formulation
  var y = randoms.map(f);
  var y2 = randoms.map(f2);
  var ySort = y.slice().sort((a, b) => a - b);
  var y2Sort = y2.slice().sort((a, b) => a - b);
  var expected2 = randoms.map((_, i) => ySort.findIndex(arg => arg === y[i]) - y2Sort.findIndex(arg => arg === y2[i]));

  t.deepEqual(actual, expected2);
  t.end();
})
