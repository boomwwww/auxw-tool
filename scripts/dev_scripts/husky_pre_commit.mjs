import fs from 'fs-extra'
import { paths } from '../utils/paths.mjs'

console.log('-'.padEnd(50, '-'), '\n\thusky pre commit\n', '-'.padEnd(50, '-'))

const logPath = paths.root('scripts', 'dev_scripts', 'pre_commit.log')
if (!fs.existsSync(logPath)) {
  throw new Error(`Please use 'npm run commit' or 'pnpm commit', not 'git commit'`)
}

console.log('-'.padEnd(50, '-'), '\n\thusky pre commit done\n', '-'.padEnd(50, '-'))
