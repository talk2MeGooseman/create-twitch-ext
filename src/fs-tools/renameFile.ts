import path from 'path'
import fs from 'fs-extra'

export default function renameFile(appPath: string, oldFileName: string, newFileName: string) {
  const exists = fs.existsSync(path.join(appPath, newFileName))
  if (exists) {
    // Append if there's already a `.gitignore` file there
    const data = fs.readFileSync(path.join(appPath, oldFileName))
    fs.appendFileSync(path.join(appPath, newFileName), data)
    fs.unlinkSync(path.join(appPath, oldFileName))
  } else {
    fs.moveSync(path.join(appPath, oldFileName), path.join(appPath, newFileName))
  }
}
