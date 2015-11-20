var memwatch = require('memwatch-next');
var microtime = require('microtime');

function range(n) {
  var result = new Array(n);
  for (var i = 0; i < n; i++) result[i] = i;
  return result;
}

function warmup(func, opts) {
  var start = microtime.now();
  do {
    opts.setup();
    func();
    end = microtime.now();
  } while(end - start < opts.warmup);
}

function benchTime(func, opts) {
  var start = microtime.now();
  var setups = 0;
  do {
    opts.setup();
    setups++;
    end = microtime.now();
  } while(end - start < opts.runtime || setups < 3);
  var timeForSetUps = (end - start) / setups;
  start = microtime.now();
  var runs = 0;
  do {
    opts.setup();
    func();
    runs++;
    end = microtime.now();
  } while(end - start < opts.runtime || runs < 10);
  return (end - start) / runs - timeForSetUps;
}

function benchMemory(func, opts) {
  opts.setup();
  global.gc();
  var hd = new memwatch.HeapDiff();
  var res = func();
  global.gc();
  var diff = hd.end();
  return [diff.after.size_bytes - diff.before.size_bytes + 25000, res];
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
  opts.warmup = opts.warmup || 100000;
  opts.runtime = opts.runtime || 1000000;
  warmup(func, opts);
  var time = benchTime(func, opts);
  var memory = benchMemory(func, opts)[0];
  return [Math.max(0, time), Math.max(0, memory)];
}
