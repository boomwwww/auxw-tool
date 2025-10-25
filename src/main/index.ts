import { app, BrowserWindow, dialog } from 'electron'
import { optimizer } from '@electron-toolkit/utils'
import { createWindow } from '@main/windows/createWindow'
import { createDocsWindow } from './windows/createDocsWindow'
import { injectAppApi } from '@main/api/injectAppApi'
import { registerProtocol } from '@main/api/registerProtocol'
import { live2d } from '@main/utils/live2d'

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}

app.whenReady().then(() => {
  app.on('second-instance', () => {
    createWindow()
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerProtocol()

  live2d
    .ensureL2d()
    .then(() => {
      createWindow().catch((error) => {
        console.error(error)
        dialog.showMessageBox({
          type: 'error',
          title: '错误提示',
          message: `应用启动失败，错误码：“无趣的女孩子”\n${error}`,
          buttons: ['确定']
        })
      })
    })
    .catch((error) => {
      console.error(error)
      createDocsWindow().then(() => {
        setTimeout(() => {
          dialog.showMessageBox({
            type: 'error',
            title: '错误提示',
            message: `Live2d 相关脚本下载失败，请关闭程序，确保网络畅通后重试，或查阅说明文档\n${error}`,
            buttons: ['确定']
          })
        }, 1000)
      })
    })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

injectAppApi()
