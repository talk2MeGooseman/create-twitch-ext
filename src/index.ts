import inquirer from 'inquirer'
import chalk from 'chalk'
import { Command } from 'commander'
import packageJson from '../package.json'
const validateProjectName = require("validate-npm-package-name")

const program = new Command(packageJson.name)
let projectName;

program
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)

program.parse(process.argv)
  .action(function (dir) {
    projectName = dir
  })

if (typeof projectName === 'undefined') {
  console.error('Please specify the project directory:');
  console.log(
    `  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
  );
  console.log();
  console.log('For example:');
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-twitch-extension')}`);
  console.log();
  console.log(
    `Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
  );
  process.exit(1);
}

function createExtension() {
  inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Select you extension type(s)',
        name: 'type',
        choices: [
          new inquirer.Separator(' = The Meats = '),
          {
            name: 'Video Overlay',
          },
          {
            name: 'Video Component',
          },
          {
            name: 'Panel',
          },
          {
            name: 'Mobile',
          },
        ],
        validate: function (answer) {
          if (answer.length < 1) {
            return 'You must choose at least one type.'
          }

          return true
        },
      },
    ])
    .then((answers) => {
      console.log(answers)
      // Use user feedback for... whatever!!
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else when wrong
      }
    })
}
