'use strict';
/**
 * Like Python 2's `range` function: return an array from 0 to `n`.
 *
 * @param {number} n length of the array
 */
function range(n) { return Array.from(Array(n), (_, n) => n); }

/**
 * Find the indexes that sort an array.
 *
 * That is, for some input `v` and `i = getSortingIndex(v)`, the following will be deeply-equal:
 * - `v.sort((a, b) => a - b)` and
 * - `i.map(idx => v[idx])`.
 *
 * @param {Array<number>} v input array
 * @returns {Array<number>} indexes (integers between 0 and `v.length`) that sort `v`
 */
function getSortingIndex(v) {
  let n = range(v.length);
  n.sort((a, b) => v[a] - v[b]);
  return n;
}

module.exports = getSortingIndex;