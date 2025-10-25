import fs from 'fs-extra'
import { paths } from '../utils/paths.mjs'
import { logger } from '../utils/logger.mjs'

logger.run('clear')

fs.removeSync(paths.root('dist'))
fs.removeSync(paths.root('node_modules'))
fs.removeSync(paths.root('out'))
fs.removeSync(paths.root('releases'))
fs.removeSync(paths.root('.eslintcache'))

logger.log(`Cleared node_modules, artifacts and cache`)

logger.done('clear')
