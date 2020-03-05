const { exec } = require('child_process');
const { argv } = require('yargs');
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');


const modules = glob.sync(
  path.join(__dirname, '..', 'deip-client-modules', 'packages', '*', '*'),
  {
    ignore: path.join(__dirname, '..', 'deip-client-modules', 'packages', 'components', '*'),
  },
);

for (const module of modules) {
  const name = JSON.parse(fs.readFileSync(path.join(module, 'package.json'), 'utf8')).name.split('/')[1];
  const dest = path.join(__dirname, 'node_modules', '@deip', name);

  exec(`rm -rf ${dest} && ln -sf ${module} ${dest}`, (err, stdout, stderr) => {
    if (err) console.error(err);
  });

  console.info(`@deip/${name} linked`);
}
