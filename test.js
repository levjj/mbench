var bench = require('./index.js');

console.log();
for (var i = 0; i < 10000; i += 1000) {
  var t = bench(() => {
    var s = 0;
    for (var j = 0; j < i; j++) {
      s++;
    }
    return s;
  });
  console.log(`i = ${i}, time = ${t[0]}, memory = ${t[1]}`);
}

console.log();
for (var i = 0; i < 10000; i += 1000) {
  var t = bench(() => {
    var s = [];
    for (var j = 0; j < i; j++) {
      s.push(0);
    }
    return s;
  });
  console.log(`i = ${i}, time = ${t[0]}, memory = ${t[1]}`);
}
