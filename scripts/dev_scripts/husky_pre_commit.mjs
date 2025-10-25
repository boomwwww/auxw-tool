import fs from 'fs-extra'
import { paths } from '../utils/paths.mjs'
import { logger } from '../utils/logger.mjs'

logger.run('husky pre commit')

const logPath = paths.root('scripts', 'dev_scripts', 'pre_commit.log')
if (!fs.existsSync(logPath)) {
  logger.error(`Please use 'npm run commit' or 'pnpm commit', not 'git commit'`)
}

logger.done('husky pre commit')
