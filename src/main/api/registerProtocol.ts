import { protocol } from 'electron'
import fs from 'fs-extra'
import { paths } from '@main/utils/paths'

export const registerProtocol = (): void => {
  protocol.handle('auxw', (request) => {
    const uriContent = request.url.replace('auxw://', '')
    const filePath = (() => {
      if (uriContent.startsWith('data/')) {
        const _filePath = uriContent.replace('data/', '')
        const _filePathArray = _filePath.replaceAll('\\', '/').split('/').filter(Boolean)
        const filePathArray = _filePathArray.map(decodeURIComponent)
        return paths.auxw_data(...filePathArray)
      } else if (uriContent.startsWith('file/')) {
        const _filePath = uriContent.replace('file/', '')
        const _filePathArray = _filePath.replaceAll('\\', '/').split('/').filter(Boolean)
        const filePathArray = _filePathArray.map(decodeURIComponent)
        const _prefix = (() => {
          if (filePathArray[0].length === 2 && filePathArray[0][1] === ':') {
            return filePathArray.shift()!
          } else {
            return '/'
          }
        })()
        return paths.resolve(_prefix, ...filePathArray)
      } else {
        return ''
      }
    })()
    const fileContent = fs.readFileSync(filePath)
    const contentType = filePath.endsWith('.js')
      ? 'application/javascript'
      : 'application/octet-stream'
    return new Response(fileContent, {
      headers: { 'Content-Type': contentType }
    })
  })
}
