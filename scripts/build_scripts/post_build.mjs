import fs from 'fs-extra'
import { paths } from '../utils/paths.mjs'
import { getConfig } from '../utils/config.mjs'
import { zipUtils } from '../utils/zip.mjs'
import { logger } from '../utils/logger.mjs'

logger.run('post build')

const config = getConfig()
const appName = config.electronBuilder.win.executableName
const appVersion = config.package.version
const exeName = `${appName} ${appVersion}`
const exePath = paths.root('dist', `${exeName}.exe`)

logger.log('Create release folder')

const releaseDir = paths.root('releases', `v${appVersion}`, 'win')
const releasePath = paths.resolve(releaseDir, 'release')
const releaseZipPath = paths.resolve(releaseDir, `${exeName}.zip`)
fs.ensureDirSync(paths.resolve(releaseDir, '..'))
fs.copySync(paths.root('extra'), releasePath)

logger.log('Copy executable to release_windows folder')

fs.copySync(exePath, paths.resolve(releasePath, `${appName}.exe`))

logger.log('Create zip file')

zipUtils.zip(releasePath, releaseZipPath)

logger.info(`Done! you can find the release in 'releases/v${appVersion}/win/'`)

logger.done('post build')
