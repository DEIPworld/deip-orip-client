const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const symlinkDir = require('symlink-dir');
const rimraf = require('rimraf');
const inquirer = require('inquirer');

const prompt = inquirer.createPromptModule();

const globModules = glob.sync(
  path.join(__dirname, '..', 'deip-client-modules', 'packages', '*', '*'),
  {
    ignore: path.join(__dirname, '..', 'deip-client-modules', 'packages', 'components', '*')
  }
);

const promptModules = globModules.reduce((a, pth) => {
  a.push({
    value: pth,
    name: pth.split(path.sep).slice(-2).join('/')
  });
  return a;
}, []);

prompt([{
  type: 'list',
  name: 'select',
  message: 'Link modules',
  default: ['all'],
  choices: [
    {
      value: 'all',
      name: 'All'
    },
    {
      value: 'select',
      name: 'Select'
    }
  ]
}])
  .then((answer) => {
    if (answer.select === 'all') {
      return { modules: [...globModules] };
    }

    return inquirer.prompt([{
      type: 'checkbox',
      name: 'modules',
      message: 'Select modules for linking',
      default: ['all'],
      pageSize: 10,
      choices: [
        ...promptModules
      ]
    }]);
  })
  .then((answer) => {
    for (const module of answer.modules) {
      const name = JSON.parse(fs.readFileSync(path.join(module, 'package.json'), 'utf8'))
        .name
        .split('/')[1];
      const dest = path.join(__dirname, 'node_modules', '@deip', name);

      symlinkDir(module, dest)
        .then(() => {
          rimraf(path.join(__dirname, 'node_modules', '@deip', `.ignored_${name}`), {}, () => {
            console.info(`@deip/${name} linked`);
          });
        })
        .catch((err) => console.error(err));
    }
  });
