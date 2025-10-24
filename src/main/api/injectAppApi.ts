import { ipcMain, dialog } from 'electron'
import type { SendType, InvokeType } from '@preload/index'
import fs from 'fs-extra'
import { paths } from '@main/utils/paths'
import { windows } from '@main/windows/windows'
import { createWindow } from '@main/windows/createWindow'
import { createDocsWindow } from '@main/windows/createDocsWindow'

export const injectAppApi = (): void => {
  const on = <K extends keyof SendType>(
    channel: K,
    listener: (event: Electron.IpcMainEvent, ...args: Parameters<SendType[K]>) => void
  ): Electron.IpcMain => {
    return ipcMain.on(channel, listener)
  }

  const handle = <K extends keyof InvokeType>(
    channel: K,
    listener: (
      event: Electron.IpcMainInvokeEvent,
      ...args: Parameters<InvokeType[K]>
    ) => ReturnType<InvokeType[K]>
  ): void => {
    ipcMain.handle(channel, listener)
  }

  on('create-new-window', (_event, _idPath, newIdPath) => {
    createWindow(newIdPath)
  })
  on('create-docs-window', () => {
    createDocsWindow()
  })
  on('set-window-full-screen', (_event, idPath, shouldFullscreen) => {
    if (shouldFullscreen) {
      windows.get(idPath)?.setFullScreen(true)
    } else {
      windows.get(idPath)?.setFullScreen(false)
    }
  })
  on('set-window-full-screen-toggle', (_event, idPath) => {
    windows.get(idPath)?.setFullScreen(!windows.get(idPath)?.isFullScreen())
  })
  on('set-config', () => {
    fs.ensureDirSync(paths.auxw_data())
    fs.writeFileSync(paths.auxw_data('x.txt'), '666')
  })

  handle('set-window-id-path', (_event, idPath, newIdPath) => {
    let isSuccess = false
    try {
      if (windows.has(idPath)) {
        if (windows.has(newIdPath.data)) {
          const win = windows.get(newIdPath.data)!
          win.show()
          win.focus()
        } else {
          const win = windows.get(idPath)!
          windows.delete(idPath)
          windows.set(newIdPath.data, win)
          isSuccess = true
        }
      } else {
        dialog.showErrorBox('切换工作路径失败', `事件触发源路径异常: ${idPath}`)
      }
    } catch (error) {
      dialog.showErrorBox('切换工作路径失败', error ? String(error) : '未知错误')
    }
    return {
      id: newIdPath.id,
      data: isSuccess
    }
  })
  handle('get-window-state', (_event, idPath, id) => {
    const win = windows.get(idPath)!
    return {
      id: id.id,
      data: {
        isMinimized: win.isMinimized(),
        isMaximized: win.isMaximized(),
        isFullScreen: win.isFullScreen(),
        isVisible: win.isVisible(),
        isFocused: win.isFocused(),
        size: win.getSize(),
        position: win.getPosition()
      }
    }
  })
  handle('get-os', (_event, _idPath, id) => {
    return {
      id: id.id,
      data: process.platform
    }
  })
  handle('get-auxw-data-path-file-uri', (_event, _idPath, id) => {
    return {
      id: id.id,
      data: paths.auxw_data()
    }
  })
  handle('get-auxw-data-uri', (_event, _idPath, args) => {
    return {
      id: args.id,
      data: `auxw://data/${paths.join(...args.data)}` // todo 改进 转义
    }
  })
  handle('get-auxw-file-uri', (_event, _idPath, args) => {
    return {
      id: args.id,
      data: `auxw://file/${paths.resolve(...args.data)}`
    }
  })
  handle('get-info', (_event, _idPath, args) => {
    return {
      id: args.id,
      data: { a: 0 }
    }
  })
}
