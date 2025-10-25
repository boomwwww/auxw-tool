import fs from 'fs-extra'
import { paths } from '../utils/paths.mjs'
import { logger } from '../utils/logger.mjs'

logger.run('post install')

if (!fs.existsSync(paths.root('auxw_data', 'config.json'))) {
  logger.log('File auxw_data/config.json not found, copying...')

  fs.copySync(paths.root('extra', 'auxw_data'), paths.root('auxw_data'))
  fs.writeFileSync(paths.root('auxw_data', '.gitkeep'), '')
}

logger.log('Copying resources...')

const docsResourcesPath = paths.root('src', 'docs', 'public', 'resources')
fs.ensureDirSync(paths.resolve(docsResourcesPath, '..'))
fs.removeSync(docsResourcesPath)
fs.copySync(paths.root('resources'), docsResourcesPath)

logger.done('post install')
