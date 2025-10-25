import fs from 'fs-extra'
import { paths } from '../utils/paths.mjs'
import { logger } from '../utils/logger.mjs'

logger.run('post commit')

const logPath = paths.root('scripts', 'dev_scripts', 'pre_commit.log')
fs.unlink(logPath)

logger.done('post commit')
