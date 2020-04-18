import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';

// If project only contains files generated by GH, it’s safe.
// Also, if project contains remnant error logs from a previous
// installation, lets remove them now.
export default function isSafeToCreateProjectIn(root: string, name: string) {
  const validFiles = [
    '.DS_Store',
    '.git',
    '.gitattributes',
    '.gitignore',
    '.gitlab-ci.yml',
    '.hg',
    '.hgcheck',
    '.hgignore',
    '.idea',
    '.npmignore',
    '.travis.yml',
    'docs',
    'LICENSE',
    'README.md',
    'mkdocs.yml',
    'Thumbs.db',
  ];
  // These files should be allowed to remain on a failed install, but then
  // silently removed during the next create.
  const errorLogFilePatterns = ['npm-debug.log'];
  const isErrorLog = (file: string) => {
    return errorLogFilePatterns.some((pattern) => file.startsWith(pattern));
  };
  const conflicts = fs
    .readdirSync(root)
    .filter((file) => !validFiles.includes(file))
    // Don't treat log files from previous installation as conflicts
    .filter((file) => !isErrorLog(file));
  if (conflicts.length > 0) {
    console.log(`The directory ${chalk.green(name)} contains files that could conflict:`);
    console.log();
    for (const file of conflicts) {
      try {
        const stats = fs.lstatSync(path.join(root, file));
        if (stats.isDirectory()) {
          console.log(`  ${chalk.blue(`${file}/`)}`);
        }
        else {
          console.log(`  ${file}`);
        }
      }
      catch (e) {
        console.log(`  ${file}`);
      }
    }
    console.log();
    console.log('Either try using a new directory name, or remove the files listed above.');
    return false;
  }
  // Remove any log files from a previous installation.
  fs.readdirSync(root).forEach((file) => {
    if (isErrorLog(file)) {
      fs.removeSync(path.join(root, file));
    }
  });
  return true;
}
