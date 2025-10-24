import { BrowserWindow } from 'electron'
import type { OnType } from '@preload/index'

export const injectWindowApi = (idPath: string, win: BrowserWindow): void => {
  const send = <K extends keyof OnType>(channel: K, ...args: Parameters<OnType[K]>): void => {
    win.webContents.send(channel, ...args)
  }

  win.once('ready-to-show', () => {
    send('on-window-created', idPath)
  })

  win.on('enter-full-screen', () => {
    send('on-window-full-screen-changed', true)
  })
  win.on('leave-full-screen', () => {
    send('on-window-full-screen-changed', false)
  })
}
