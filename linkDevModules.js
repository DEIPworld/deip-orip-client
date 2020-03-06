const { argv } = require('yargs');
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const symlinkDir = require('symlink-dir');
const rimraf = require('rimraf');

const globModules = glob.sync(
  path.join(__dirname, '..', 'deip-client-modules', 'packages', '*', '*'),
  {
    ignore: path.join(__dirname, '..', 'deip-client-modules', 'packages', 'components', '*')
  },
);

const linkModules = argv._.length ? argv._ : globModules;

for (const module of linkModules) {
  const name = JSON.parse(fs.readFileSync(path.join(module, 'package.json'), 'utf8')).name.split('/')[1];
  const dest = path.join(__dirname, 'node_modules', '@deip', name);

  symlinkDir(module, dest)
    .then(() => {
      rimraf(path.join(__dirname, 'node_modules', '@deip', `.ignored_${name}`), {}, () => {
        console.info(`@deip/${name} linked`);
      });
    })
    .catch((err) => console.error(err));
}
