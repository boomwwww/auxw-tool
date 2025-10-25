import fs from 'fs-extra'
import { paths } from '../utils/paths.mjs'

console.log('-'.padEnd(50, '-'), '\n\tpost commit\n', '-'.padEnd(50, '-'))

const logPath = paths.root('scripts', 'dev_scripts', 'pre_commit.log')
fs.unlink(logPath)

console.log('-'.padEnd(50, '-'), '\n\tpost commit done\n', '-'.padEnd(50, '-'))
