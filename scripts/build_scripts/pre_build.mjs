import fs from 'fs-extra'
import { paths } from '../utils/paths.mjs'
import { getConfig } from '../utils/config.mjs'
import { logger } from '../utils/logger.mjs'

logger.run('pre build')

const config = getConfig()
const appVersion = config.package.version

logger.log('Cleaning folders...')

fs.removeSync(paths.root('out'))
fs.removeSync(paths.root('dist'))
fs.removeSync(paths.root('releases', `v${appVersion}`, 'win'))

logger.log('Copying resources...')

const docsResourcesPath = paths.root('src', 'docs', 'public', 'resources')
fs.removeSync(docsResourcesPath)
fs.ensureDirSync(paths.resolve(docsResourcesPath, '..'))
fs.copySync(paths.root('resources'), docsResourcesPath)

logger.done('pre build')
