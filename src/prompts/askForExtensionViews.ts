import inquirer from 'inquirer';
import chalk from 'chalk';

const EXTENSION_TYPES = [
  {
    name: 'Video Overlay',
    value: 'overlay',
  },
  {
    name: 'Video Component',
    value: 'component',
  },
  {
    name: 'Panel',
    value: 'panel',
  },
  {
    name: 'Mobile',
    value: 'mobile',
  },
  new inquirer.Separator(' = Additional Views = '),
  {
    name: 'Live Configuration View (Shows on Broadcaster Dashboard)',
    value: 'live_config',
  },
]

export async function askForExtensionViews() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        message: 'Select your extension type(s)',
        name: 'type',
        choices: [
          new inquirer.Separator(' = Extension Type = '),
          ...EXTENSION_TYPES,
        ],
        validate: function (answer_1) {
          if (answer_1.length < 1) {
            return 'You must choose at least one type.';
          }
          return true;
        },
      },
    ]);
    return answers;
  }
  catch (error) {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
      console.error(chalk.red("\nPrompt couldn't be rendered in the current environment."));
    }
    else {
      // Something else when wrong
      console.error(chalk.red('\nOpps, something went wrong with prompts.'));
    }
    process.exit(1);
  }
}
