// Exercise real generated redirect code at root and under a GitHub Pages project path.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const routes = JSON.parse(fs.readFileSync(path.join(root, 'data/trips.json'), 'utf8')).legacyRoutes;
const code = fs.readFileSync(path.join(root, 'assets/js/legacy-routes.js'), 'utf8');
const fallback = fs.readFileSync(path.join(root, '404.html'), 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
let count = 0;
for (const prefix of ['', '/travel-project']) {
  for (const [source, destination] of Object.entries(routes)) {
    for (const suffix of ['', 'index.html']) {
      let actual;
      const location = { pathname: prefix + source + suffix, search: '?view=day', hash: '#d2', replace: value => { actual = value; } };
      vm.runInNewContext(code, { location });
      assert.equal(actual, prefix + destination + '?view=day#d2');
      let scriptPath;
      vm.runInNewContext(fallback, {
        location,
        document: { createElement: () => ({}), body: { appendChild: script => { scriptPath = script.src; } } }
      });
      assert.equal(scriptPath, prefix + '/assets/js/legacy-routes.js');
      count++;
    }
    let actual;
    vm.runInNewContext(code, { location: { pathname: prefix + source.slice(0, -1), search: '', hash: '', replace: value => { actual = value; } } });
    assert.equal(actual, prefix + destination);
    count++;
  }
}
vm.runInNewContext(code, { location: { pathname: '/unknown/', replace: () => assert.fail('Unknown path redirected') } });
console.log(`Checked ${count} legacy URL variants and unknown-path fallback.`);
