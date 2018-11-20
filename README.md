# rank-compare-approximations

## Rationale

Assume you have an expensive function `f` that, given something, returns a number. You don't particularly care about the output of `f`; you actually care about how it sorts (or ranks) some collection of inputs, that is, you care about `results` in the following:
```js
var inputs; // initialized to an array of something that `f` consumes
let results = inputs.map(f);
results.sort((a, b) => a - b);
```
(If you're confused by the argument to `sort`, welcome to one of JavaScript's [most surreal pitfalls](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Description).)

Now. You've come up with a clever approximation to `f`, called `f2`, that won't give exactly the same outputs as `f` but might be much faster to compute. `f2` might not even sort a collection of inputs in the same way as `f`.

***How good of an approximation is `f2` of `f`?***

This little dependency-free library quickly lets you answer this question.

## Installation
This library is intended to be installed in Node.js (and potentially bundled for browsers via Browserify, etc.). Therefore, assuming you have [Node.js](https://nodejs.org) installed and an npm project initialized, run the following in the same directory as your npm project:
```
$ npm install --save rank-compare-approximations
```
(Consider replacing `--save` with `--save-dev` if this library will only be used to develop your npm project.)

Import the library into your JavaScript source or a Node terminal via:
```js
var compare = require('rank-compare-approximations');
```

## API

### `var result = compare(args, f, f2);`
Given
- `args: Array<T>`, that is, an array of some type `T`, and functions
- `f: T -> number` and
- `f2: T -> number`, that is, functions that, given some object of type `T` and returning a number,

the resulting `result: Array<number>` will be an array of numbers, the same length as `args`, whose elements tell you how many indexes away each element of `args` sorted according to `f` vs `f2`.

If `f2` is a great approximation to `f`, this will be an array of 0: 0 is good, it means "zero sort (or rank) error". If `f2` occasionally mis-sorts (relative to `f`), some elements of the result will be non-zero, but most should be 0. If `f2` is a bad approximation of `f`, then few elements of the result will be zero.

Notionally:
```js
var y = args.map(f);
var y2 = args.map(f2);
var ySort = y.slice().sort((a, b) => a - b);
var y2Sort = y2.slice().sort((a, b) => a - b);
var result = args.map((_, i) => ySort.findIndex(arg => arg === y[i]) - y2Sort.findIndex(arg => arg === y2[i]));
```
The above is actually one way that this library is tested. It's slow because repeatedly calling `findIndex` like this is needlessly quadratic. The performance-minded reader will notice that we could create a `Map` to store the reverse-indexes, which is the other way that this library is tested. See [tests.js](tests.js).

The library actually implements something a little bit more clever than this: it sorts the sort indexes of `y` and `y2` above—there is no typo in this sentence. Thus, the runtime cost of the library (aside from the cost of invoking `f` and `f2`) is *four* sorts.

(This is "clever" in the algorithmic sense: it might not be immediately obvious why finding the sort indexes of the sort indexes of the mapping under `f` versus `f2` can be compared via subtraction, but some doodling with pen and paper will show you why it works. This implementation might be slower than something more straightforward using `Map`s as hinted above and implemented in the tests. My casual benchmarking showed that the library, using four sorts, was within 15% of the straightforward implementation.)
