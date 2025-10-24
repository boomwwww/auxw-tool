import fs from 'fs-extra'
import { paths } from '../utils/paths.mjs'
import { getConfig } from '../utils/config.mjs'

console.log('-'.padEnd(50, '-'), '\n\tpre:build\n', '-'.padEnd(50, '-'))

const config = getConfig()
const appVersion = config.package.version

console.log('Cleaning folders...')

fs.removeSync(paths.root('out'))
fs.removeSync(paths.root('dist'))
fs.removeSync(paths.root('releases', `v${appVersion}`, 'win'))

console.log('Copying resources...')

const docsResourcesPath = paths.root('src', 'docs', 'public', 'resources')
fs.removeSync(docsResourcesPath)
fs.ensureDirSync(paths.resolve(docsResourcesPath, '..'))
fs.copySync(paths.root('resources'), docsResourcesPath)

console.log('-'.padEnd(50, '-'), '\n\tpre:build done\n', '-'.padEnd(50, '-'))
