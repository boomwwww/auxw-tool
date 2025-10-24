import fs from 'fs-extra'
import { paths } from '../utils/paths.mjs'

console.log('-'.padEnd(50, '-'), '\n\tpre:dev\n', '-'.padEnd(50, '-'))

console.log('Cleaning directory...')

fs.removeSync(paths.root('src', 'renderer', 'src', 'types', 'auto'))
fs.removeSync(paths.root('out'))

if (!fs.existsSync(paths.root('auxw_data', 'config.json'))) {
  console.log('File auxw_data/config.json not found, copying...')

  fs.copySync(paths.root('extra', 'auxw_data'), paths.root('auxw_data'))
  fs.writeFileSync(paths.root('auxw_data', '.gitkeep'), '')
}

console.log('Copying resources...')

const docsResourcesPath = paths.root('src', 'docs', 'public', 'resources')
fs.removeSync(docsResourcesPath)
fs.ensureDirSync(paths.resolve(docsResourcesPath, '..'))
fs.copySync(paths.root('resources'), docsResourcesPath)

console.log('-'.padEnd(50, '-'), '\n\tpre:dev done\n', '-'.padEnd(50, '-'))
