import inquirer from 'inquirer';
import chalk from 'chalk';

const TEMPLATES = [
  {
    name: 'Vanilla JavaScript',
    value: 'template-plain',
  }
];

export async function askForTemplateType() {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        message: 'Select project type',
        name: 'type',
        choices: [
          new inquirer.Separator(' ===== '),
          ...TEMPLATES,
        ],
        validate: function (answer) {
          if (answer.length === 1) {
            return 'You must choose a template.';
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
