import chalk from 'chalk'
import { Command } from 'commander'
import path from 'path'
import fs from 'fs-extra'
import os from 'os'
import spawn from 'cross-spawn'
import packageJson from '../package.json'
import webpackTemplateJson from './webpack-template.json'
import ejs from 'ejs'
import validateProjectName from 'validate-npm-package-name'
import { askForTemplateType } from './prompts/askForTemplateTypes'
import { askForExtensionViews } from './prompts/askForExtensionViews'
import { copyFilesFromDir, isSafeToCreateProjectIn, renameFile } from './fs-tools'

interface JsonType {
  [key: string]: any
}
interface PromptAnswerType {
  type: any
}
interface ProjectAttributes {
  appPath: string
  appName: string
  originalDirectory: string
  templateName: string
  extensionViews: string[]
}

const program = new Command(packageJson.name)
let projectName

program
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action(function (dir) {
    projectName = dir
  })

program.parse(process.argv)

if (typeof projectName === 'undefined') {
  console.error('Please specify the project directory:')
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`)
  console.log()
  console.log('For example:')
  console.log(`  ${chalk.cyan(program.name())} ${chalk.green('my-twitch-extension')}`)
  console.log()
  console.log(`Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`)
  process.exit(1)
}

createExtension(projectName)

function createExtension(name: string) {
  const root = path.resolve(name)
  const appName = path.basename(root)

  checkAppName(appName)
  fs.ensureDirSync(appName)
  if (!isSafeToCreateProjectIn(root, appName)) {
    process.exit(1)
  }

  console.log()
  console.log(`Creating a new Twitch Extension in ${chalk.green(root)}`)
  console.log()

  const packageJson = {
    name: appName,
    version: '0.0.1',
    private: true,
  }
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson, null, 2) + os.EOL)

  const originalDirectory = process.cwd()
  process.chdir(root)

  run(root, appName, originalDirectory)
}

function checkAppName(appName: string) {
  const validationResult = validateProjectName(appName)
  if (!validationResult.validForNewPackages) {
    console.error(
      chalk.red(
        `Cannot create a extension project named ${chalk.green(
          `"${appName}"`,
        )} because of npm naming restrictions:\n`,
      ),
    )
      ;[...(validationResult.errors || []), ...(validationResult.warnings || [])].forEach((error) => {
        console.error(chalk.red(`  * ${error}`))
      })
    console.error(chalk.red('\nPlease choose a different project name.'))
    process.exit(1)
  }
}

function run(appPath: string, appName: string, originalDirectory: string) {
  let templateTypeAnswer: PromptAnswerType

  // Dependencies added to all projects
  const allDependencies = ['jsonwebtoken']

  install(allDependencies)
    .then(() => {
      return askForTemplateType()
    })
    .then((answer) => {
      templateTypeAnswer = answer
      return askForExtensionViews()
    })
    .then((answer) => {
      return generateExtensionProject({
        appPath,
        appName,
        originalDirectory,
        templateName: templateTypeAnswer.type,
        extensionViews: answer.type,
      })
    })
    .then(() => {
      displayCompleteMessage(appPath, appName)
    })
    .catch((reason) => {
      console.log()
      console.log('Aborting installation.')
      if (reason.command) {
        console.log(`  ${chalk.cyan(reason.command)} has failed.`)
      } else {
        console.log(chalk.red('Unexpected error. Please report it as a bug:'))
        console.log(reason)
      }
      console.log()

      // On 'exit' we will delete these files from target directory.
      const knownGeneratedFiles = ['package.json', 'package-lock.json', 'node_modules']
      const currentFiles = fs.readdirSync(path.join(appPath))
      currentFiles.forEach((file) => {
        knownGeneratedFiles.forEach((fileToMatch) => {
          // This removes all knownGeneratedFiles.
          if (file === fileToMatch) {
            console.log(`Deleting generated file... ${chalk.cyan(file)}`)
            fs.removeSync(path.join(appPath, file))
          }
        })
      })
      const remainingFiles = fs.readdirSync(path.join(appPath))
      if (!remainingFiles.length) {
        // Delete target folder if empty
        console.log(
          `Deleting ${chalk.cyan(`${appName}/`)} from ${chalk.cyan(path.resolve(appPath, '..'))}`,
        )
        process.chdir(path.resolve(appPath, '..'))
        fs.removeSync(path.join(appPath))
      }
      console.log('Done.')
      process.exit(1)
    })
}

function install(dependencies: string[]) {
  console.log('Installing packages. This might take a couple of minutes.')

  console.log(`Installing ${dependencies.map((dep) => chalk.cyan(dep)).join(', ')} ...`)
  console.log()
  return new Promise((resolve, reject) => {
    let command = 'npm'
    let args = ['install', '--save', '--save-exact', '--loglevel', 'error'].concat(dependencies)

    // if (verbose) {
    //   args.push('--verbose');
    // }

    const child = spawn(command, args, { stdio: 'inherit' })
    child.on('close', (code) => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`,
        })
        return
      }
      resolve()
    })
  })
}

async function generateExtensionProject({
  appPath,
  appName,
  originalDirectory,
  templateName,
  extensionViews,
}: ProjectAttributes) {
  const templatePackageToMerge = ['dependencies', 'scripts']
  const defaultExtensionViews = ['config']
  const cliPath = process.argv[1]

  const templatePath = path.join(cliPath, 'templates', templateName)
  const templateDir = path.join(templatePath, 'template')

  const appPackage = fs.readJsonSync(path.join(appPath, 'package.json'))
  const templateJson = fs.readJsonSync(path.join(templatePath, 'template.json'))
  const webpackCommonPath = path.join(appPath, 'webpack.common.ejs')

  // Copy the files from selected template into new project
  copyFilesFromDir(appPath, templateDir)

  // Configure package.json
  const templateScripts = templateJson.package.scripts || {}
  appPackage.scripts = Object.assign({}, templateScripts) // Include assign for future references

  const templateDevDeps = templateJson.package.devDependencies || {}
  appPackage.devDependencies = Object.assign({}, templateDevDeps) // Include assign for future references
  fs.writeFileSync(path.join(appPath, 'package.json'), JSON.stringify(appPackage, null, 2) + os.EOL)

  // Generate Webpack Common Config
  const appWebpackCommon = fs.readFileSync(webpackCommonPath, 'utf8')
  const webpackViews = extensionViews
    .concat(defaultExtensionViews)
    .map((view) => (webpackTemplateJson as JsonType).HtmlWebpackPlugin[view])
  const compiledWebpackCommon = ejs.render(appWebpackCommon, {
    views: webpackViews,
  })
  // Update webpack common config with HTML templates
  fs.writeFileSync(path.join(appPath, 'webpack.common.ejs'), compiledWebpackCommon)
  // Rename file for ejs to js
  renameFile(appPath, 'webpack.common.ejs', 'webpack.common.js')

  // Rename gitignore to .gitignore
  renameFile(appPath, 'gitignore', '.gitignore')
  // Run npm install again include any other regular dependencies from template
  await install(templateJson.package.dependencies)

  console.log('Completing project setup...')
  return await install([])
}

function displayCompleteMessage(appPath: string, appName: string) {
  console.log()
  console.log(`Success! Created ${appName} at ${appPath}`)
  console.log('Inside that directory, you can run several commands:')
  console.log()
  console.log(chalk.cyan('  npm start'))
  console.log('    Starts the development server.')
  console.log()
  console.log(chalk.cyan('  npm run build'))
  console.log('    Builds extension for production.')
  console.log()
  console.log(chalk.green('  To get started, begin by typing:'))
  console.log(chalk.cyan('    cd'), appName)
  console.log(`    ${chalk.cyan('npm start')}`)
}
