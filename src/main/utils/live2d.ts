import fs from 'fs-extra'
import { paths } from './paths'
import { downloadFile } from './network'

// live2dCubismCoreLegacyPath
const l2dlPath = paths.auxw_data('lib', 'live2d.min.js')
// live2dCubismCorePath
const l2dPath = paths.auxw_data('lib', 'live2dcubismcore.min.js')

const l2dlUri = 'https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js'
const l2dUri = 'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js'

export const live2d = {
  async downloadL2dl(): Promise<void> {
    fs.ensureFileSync(l2dlPath)
    await downloadFile(l2dlUri, l2dlPath)
  },
  async downloadL2d(): Promise<void> {
    fs.ensureFileSync(l2dPath)
    await downloadFile(l2dUri, l2dPath)
  },
  async ensureL2d(): Promise<void> {
    if (!fs.pathExistsSync(l2dlPath)) await this.downloadL2dl()
    if (!fs.pathExistsSync(l2dPath)) await this.downloadL2d()
    console.log('live2d ensure')
  }
}
