import { shell, BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'
import { paths } from '@main/utils/paths'
import { injectWindowApi } from '@main/api/injectWindowApi'
import { windows } from './windows'

export const createWindow = (idPath: string = ''): Promise<BrowserWindow> => {
  return new Promise<BrowserWindow>((resolve) => {
    if (windows.has(idPath)) {
      const win = windows.get(idPath)!
      win.show()
      win.focus()
      return
    }
    const newWin = new BrowserWindow({
      show: false,
      icon: paths.icon(),
      width: 800,
      height: 600,
      minWidth: 400,
      minHeight: 300,
      autoHideMenuBar: true,
      webPreferences: {
        preload: paths.preloadIndex(),
        contextIsolation: true,
        sandbox: true,
        webviewTag: true,
        nodeIntegration: false
      }
    })

    newWin.on('ready-to-show', () => {
      newWin.maximize()
      newWin.show()
      newWin.focus()
    })

    newWin.on('closed', () => {
      windows.forEach((win, idPath) => {
        if (win === newWin) {
          windows.delete(idPath)
        }
      })
    })

    newWin.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      newWin.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      newWin.loadFile(paths.rendererIndex())
    }

    injectWindowApi(idPath, newWin)

    windows.set(idPath, newWin)

    resolve(newWin)
  })
}
