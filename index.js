var memwatch = require('memwatch-next');
var microtime = require('microtime');

function range(n) {
  var result = new Array(n);
  for (var i = 0; i < n; i++) result[i] = i;
  return result;
}

/**
 * Runs a benchmark for time and memory
 *
 * @param func [Function] function to benchmark
 * @param opts [optional Object] options (setup, warmup, runs)
 * @return [number, number] Time in micros, memory in bytes
 */
module.exports = (func, opts) => {
  opts = opts || {};
  opts.setup = opts.setup || () => null;
  opts.warmup = opts.warmup || 1000;
  opts.runs = opts.runs || 1000;
  range(opts.warmup).map(() => {
    opts.setup();
    func();
  });
  var time = range(opts.runs)
    .map(() => {
      opts.setup();
      var start = microtime.now();
      func();
      return microtime.now() - start;
    })
    .reduce((sum, i) => sum + i, 0) / opts.runs;
  opts.setup();
  var hd = new memwatch.HeapDiff();
  var diff = hd.end();
  var base = diff.after.size_bytes - diff.before.size_bytes;
  diff = null;
  hd = new memwatch.HeapDiff();
  var res = func();
  diff = hd.end();
  return [time, diff.after.size_bytes - diff.before.size_bytes - base, res];
}
