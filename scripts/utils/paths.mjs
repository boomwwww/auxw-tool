import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const paths = {
  join(...args) {
    return path.join(...args)
  },
  resolve(...args) {
    return path.resolve(...args)
  },
  root(...args) {
    return this.resolve(__dirname, '..', '..', ...args)
  }
}
