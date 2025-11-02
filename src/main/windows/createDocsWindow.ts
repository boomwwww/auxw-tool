import { shell, BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'
import express from 'express'
import { paths } from '@main/utils/paths'

let docsServer: ReturnType<ReturnType<typeof express>['listen']> | null = null
let docsWin: BrowserWindow | null = null

const startDocsServer = async (): Promise<typeof docsServer> => {
  if (is.dev) return null
  if (docsServer !== null) return docsServer

  const docsServerApp = express()
  docsServerApp.use(express.static(paths.docs()))
  docsServer = docsServerApp.listen(0)
  return docsServer
}

const loadDocs = async (win: BrowserWindow, server: typeof docsServer): Promise<void> => {
  if (is.dev) {
    win.loadURL(paths.docsDevUrl())
  } else {
    if (server === null) {
      win.loadFile(paths.docsIndex())
    } else {
      server.on('listening', () => {
        const port = (() => {
          const address = server.address()
          return address && typeof address === 'object' && address.port ? address.port : 0
        })()
        if (port !== 0) {
          win.loadURL(paths.docsUrl(port))
        } else {
          win.loadFile(paths.docsIndex())
        }
      })
    }
  }
}

export const createDocsWindow = async (): Promise<BrowserWindow> => {
  if (docsWin !== null) {
    docsWin.show()
    docsWin.focus()
    return docsWin
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

  const server = await startDocsServer()

  await loadDocs(docsWin, server)

  return docsWin
}
