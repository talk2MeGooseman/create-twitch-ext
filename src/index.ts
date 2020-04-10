import inquirer from 'inquirer';

inquirer
  .prompt([
    {
      type: 'checkbox',
      message: 'Select you extension type(s)',
      name: 'type',
      choices: [
        new inquirer.Separator(' = The Meats = '),
        {
          name: 'Video Overlay'
        },
        {
          name: 'Video Component'
        },
        {
          name: 'Panel'
        },
        {
          name: 'Mobile'
        },
      ],
      validate: function (answer) {
        if (answer.length < 1) {
          return 'You must choose at least one type.';
        }

        return true;
      }
    }
  ])
  .then(answers => {
    // Use user feedback for... whatever!!
  })
  .catch(error => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else when wrong
    }
  });
