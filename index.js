'use strict';
const getSortingIndex = require('./getSortingIndex');
/**
 * Compare the ranking or sorting order imposed by a function and its approximation
 *
 * @param {Array<T>} x array of arguments to sort
 * @param {T -> number} f the ideal (potentially expensive) function to sort by
 * @param {T -> number} f2 the approximation to `f` that you'd like to test
 * @returns {Array<number>} the distance between indexes that `x` sorts to under `f` vs `f2`
 */
function compare(x, f, f2) {
  let y = x.map(x => f(x));
  let y2 = x.map(x => f2(x));

  let s = getSortingIndex(getSortingIndex(y));
  let s2 = getSortingIndex(getSortingIndex(y2));
  return s.map((s, i) => s - s2[i]);
}
module.exports = compare;