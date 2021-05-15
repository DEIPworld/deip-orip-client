const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const symlinkDir = require('symlink-dir');
const rimraf = require('rimraf');
const inquirer = require('inquirer');

const prompt = inquirer.createPromptModule();

const globModules = glob.sync(
  path.join(__dirname, '..', '..', 'deip-modules', 'packages', '*', '*')
);

const modulesToRemove = ['vue', 'vuetify'];
const modulesToRemoveNamesGlob = `+(${modulesToRemove.join('|')})`;

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
    const linkModulesPromises = answer.modules.map((module) => {
      const name = JSON.parse(fs.readFileSync(path.join(module, 'package.json'), 'utf8'))
        .name
        .split('/')[1];
      const dest = path.join(__dirname, '..', 'node_modules', '@deip', name);

      return symlinkDir(module, dest)
        .then(() => {
          rimraf(path.join(__dirname, '..', 'node_modules', '@deip', `.ignored_${name}`), {}, () => {
            console.info(`@deip/${name} linked`);

            const modulesToRemoveGlob = path.join(__dirname, '..', 'node_modules', '@deip', name, 'node_modules', modulesToRemoveNamesGlob);
            if (glob.sync(modulesToRemoveGlob).length) {
              rimraf(modulesToRemoveGlob, {}, () => {
                console.info(`${modulesToRemove} removed from @deip/${name}`);
              });
            }
          });
        });
    });

    return Promise.all(linkModulesPromises);
  })
  .then(() => {
    const globalPath = path.join(__dirname, '..', '..', 'deip-modules', 'node_modules', modulesToRemoveNamesGlob);
    rimraf(globalPath, {}, () => {
      console.info(`${modulesToRemove} removed from @deip`);
    });
  })
  .catch((err) => console.error(err));
