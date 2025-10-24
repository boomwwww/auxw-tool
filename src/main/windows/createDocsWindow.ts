import { shell, BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'
import express from 'express'
import { paths } from '@main/utils/paths'

let docsServer: ReturnType<ReturnType<typeof express>['listen']> | null = null
let docsWin: BrowserWindow | null = null

const startDocsServer = (): ReturnType<ReturnType<typeof express>['listen']> | null => {
  if (is.dev) return null
  if (docsServer !== null) return docsServer

  const docsServerApp = express()
  docsServerApp.use(express.static(paths.docs()))
  docsServer = docsServerApp.listen(0)
  return docsServer
}

export const createDocsWindow = (): Promise<BrowserWindow> => {
  return new Promise((resolve) => {
    if (docsWin !== null) {
      docsWin.show()
      docsWin.focus()
      return
    }

    docsWin = new BrowserWindow({
      show: false,
      icon: paths.icon(),
      width: 450,
      height: 800,
      minWidth: 400,
      minHeight: 300,
      autoHideMenuBar: true,
      webPreferences: {
        webSecurity: false
      }
    })

    docsWin.on('ready-to-show', () => {
      docsWin?.show()
      docsWin?.focus()
    })

    docsWin.on('close', () => {
      docsWin = null
    })

    docsWin.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    if (is.dev) {
      docsWin.loadURL(paths.docsDevUrl())
    } else {
      const server = startDocsServer()
      if (server === null) {
        docsWin.loadFile(paths.docsIndex())
      } else {
        server.on('listening', () => {
          const port = (() => {
            const address = server?.address()
            return address && typeof address === 'object' && address.port ? address.port : 0
          })()
          if (port !== 0) {
            docsWin?.loadURL(paths.docsUrl(port))
          } else {
            docsWin?.loadFile(paths.docsIndex())
          }
        })
      }
    }

    resolve(docsWin)
  })
}
