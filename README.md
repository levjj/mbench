mbench
======

This is a library to explore micro benchmarks.  It reports both the time as
well as the memory.

Example usage:

```javascript
import mbench from 'mbench';

var i = 100;

var t = mbench(() => {
  var s = [];
  for (var j = 0; j < i; j++) {
    s.push(0);
  }
  return s;
});
console.log(`i = ${i}, time = ${t[0]}, memory = ${t[1]}`);
```
