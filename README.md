# Create Twitch Ext(ension)

A node.js CLI tool to generate a Twitch Extension project for you. If your familiar tools like `create-react-app`, that was our inspiration for this tool!

## What can it do?

`create-twitch-ext` was created to take take the guess work out of making a Twitch Extension. Run the command `npx create-twitch-ext`, answer a few questions, and have it generate a baseline Twitch Extension so you can get to developing right away.

Right now it has support for generating a very simple Twitch Extension project using Vanilla JavaScript template. But in the near future the hope is to provide options to generate a Twitch Extension project for all major UI libraries like ReactJS, Vue.js, Angular and more.

## How do I use it?

I tried to make this CLI tool as easy to use as possible and I hope you agree.

Minimum Requirements: Node > 8

Getting Started:

```bash
npx create-twitch-ext <project-name>
```

You will then be asked a couple of questions.

- Which project template you would like? (Only Vanilla JavaScript Template Supported)
- Select which type(s) you are creating

Boom your done! Your project should be created and your ready to getting coding.

## Contributing a template

Want to contribute a template for `create-twitch-ext`? Awesome! Couple things like to go over before you get started.

Philosophies:

- Templates should be minimal base for getting a user starting developing.
- Try not to be overlay opinionated about how the template is configured. You should provide the foundation to get started with out handcuffing them or confusing the coder with fancy implementations.
- Existing templates are not opinionated by design, don't try making pull request to add X or Y library

If you have a cool Twitch Extension project that uses ReactJS with the latest state management hotness and other cool bell and whistles? The add it as a template!

### How do I add my template?

1. Fork the repository
1. Create a folder for your new template inside `template` folder. Name it after
1. Inside your template folder create a `template.json` file and create a folder called `template`
1. The `template.json` will contain the template dependencies. It will contain 3 main things.

   - Regular project dependencies `dependencies`
   - Development dependencies `devDependencies`
   - npm scripts to run the resulting projects

   If you look at the `template-plain` project you will notice that the `devDependencies` declares the dependencies and desired version. This by design to lock all our development dependencies because those usually are more brittle and breaking on version updates for things like Webpack and associated plugins.

1. The `template` folder will house the code for your new template. There should be a few things in your `template` folder to complete things.

   - `webpack-template.json`. This houses HTML template the various Twitch Extension views will use when selected by the user and generated. Take a look at `templates/template-plain/webpack-template.json` to see how this is setup. You should only have to modify the template attributed if your have custom HTML templates for the various views.
   - `webpack.common.ejs`. I recommend copying over the one inside `template-plain` and adjusting it so that you have all the webpack plugins for your template to run. CLI tool will use the `webpack.common.ejs` and inject the the users selected HTML views they want to generate and then output it as `webpack.common.js`.
   - `webpack.dev.js` configuration for development mode
   - `webpack.prod.js` configuration for product build to upload to Twitch Dev
   - `src` folder containing your template code.
   - `gitignore`, yes not `.gitignore`, this will be renamed when the user project is created
   - A `README.md` so the user know how to use the generated project from your template

   You will notice there is now `package.json` file. This will be generated based off the dependencies and scripts you specified in `template.json` file.

1. Update `src/prompts/askForTemplateTypes.ts` and add your news template to the array of templates.
1. After all that is done, create a Pull Request to `talk2megooseman/create-twitch-ext` to get your new template reviewed and merged!
