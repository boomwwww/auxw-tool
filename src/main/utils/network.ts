import fs from 'fs-extra'
import https from 'https'
import { paths } from './paths'

/** 文件下载函数 */
export const downloadFile = (uri: string, savePath: string): Promise<void> => {
  console.log(`下载文件\n从 \n\t${uri} \n到 \n\t${savePath} \n`)
  return new Promise((resolve, reject) => {
    const request = https.get(uri)
    request.on('response', (response) => {
      const handleFileError = (err: Error, savePath: string): string => {
        console.error(`文件写入错误: ${err.message}`)
        fs.remove(savePath).catch((e) => {
          console.error(`文件删除错误: ${e.message}`)
          return e.message
        })
        return err.message
      }

      const handleResponseEnd = (file: ReturnType<typeof fs.createWriteStream>): void => {
        file.close(() => {
          console.log('下载完成')
          resolve()
        })
      }
      if (response.statusCode === 200) {
        fs.ensureDirSync(paths.join(savePath, '..'))
        const file = fs.createWriteStream(savePath)
        file.on('finish', () => {
          handleResponseEnd(file)
        })
        file.on('error', (err) => {
          reject(handleFileError(err, savePath))
        })
        response.pipe(file)
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location
        console.log(`下载地址重定向`)
        if (!redirectUrl) {
          reject(`未找到重定向地址`)
        }
        downloadFile(redirectUrl!, savePath)
          .then(() => resolve())
          .catch((e) => reject(e))
      } else {
        reject(`服务器响应状态码为 ${response.statusCode}: ${response.statusMessage}`)
      }
    })
    request.on('error', (error) => {
      console.error(`请求错误: ${error.message}`)
      fs.remove(savePath).catch((e) => {
        console.error(`文件删除错误: ${e.message}`)
      })
      reject(error.message)
    })
  })
}
