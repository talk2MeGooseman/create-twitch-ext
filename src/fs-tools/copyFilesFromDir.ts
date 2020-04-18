import chalk from 'chalk';
import fs from 'fs-extra';

export default function copyFilesFromDir(appPath: string, templateDir: string) {
  // Copy the files for the user
  if (fs.existsSync(templateDir)) {
    fs.copySync(templateDir, appPath);
  }
  else {
    console.error(`Could not locate supplied template: ${chalk.green(templateDir)}`);
    return;
  }
}
