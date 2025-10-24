import fs from 'fs-extra'
import { paths } from '../utils/paths.mjs'
import { getConfig } from '../utils/config.mjs'
import { zipUtils } from '../utils/zip.mjs'

console.log('-'.padEnd(50, '-'), '\n\tpost:build\n', '-'.padEnd(50, '-'))

const config = getConfig()
const appName = config.electronBuilder.win.executableName
const appVersion = config.package.version
const exeName = `${appName} ${appVersion}`
const exePath = paths.root('dist', `${exeName}.exe`)

console.log('Create release folder')

const releaseDir = paths.root('releases', `v${appVersion}`, 'win')
const releasePath = paths.resolve(releaseDir, 'release')
const releaseZipPath = paths.resolve(releaseDir, `${exeName}.zip`)
fs.ensureDirSync(paths.resolve(releaseDir, '..'))
fs.copySync(paths.root('extra'), releasePath)

console.log('Copy executable to release_windows folder')

fs.copySync(exePath, paths.resolve(releasePath, `${appName}.exe`))

console.log('Create zip file')

zipUtils.zip(releasePath, releaseZipPath)

console.log(
  '-'.padEnd(50, '-'),
  `\nDone! you can find the release in 'releases/v${appVersion}/win/'`
)

console.log('-'.padEnd(50, '-'), '\n\tpost:build done\n', '-'.padEnd(50, '-'))
