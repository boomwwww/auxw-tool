import fs from 'fs-extra'
import { paths } from '../utils/paths.mjs'

fs.removeSync(paths.root('dist'))
fs.removeSync(paths.root('node_modules'))
fs.removeSync(paths.root('out'))
fs.removeSync(paths.root('releases'))
fs.removeSync(paths.root('.eslintcache'))

console.log(`Cleared node_modules, artifacts and cache`)
