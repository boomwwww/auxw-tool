import { contextBridge, ipcRenderer } from 'electron'

type WindowState = {
  isMinimized: boolean
  isMaximized: boolean
  isFullScreen: boolean
  isVisible: boolean
  isFocused: boolean
  size: number[]
  position: number[]
}

type Info = {
  a: { a: number }
  b: { b: number }
}

type InvokeMessage<T> = {
  id: string
  data: T
}

export type SendType = {
  'create-new-window': (idPath: string, newIdPath: string) => void
  'create-docs-window': (idPath: string) => void
  'set-window-full-screen': (idPath: string, shouldFullscreen: boolean) => void
  'set-window-full-screen-toggle': (idPath: string) => void
  'set-config': (idPath: string) => void
}
export type OnType = {
  'on-window-created': (idPath: string) => void
  'on-window-full-screen-changed': (isFullscreen: boolean) => void
  'on-window-id-path-changed': (idPath: string) => void
}
export type InvokeType = {
  'set-window-id-path': (idPath: string, newIdPath: InvokeMessage<string>) => InvokeMessage<boolean>
  'get-window-state': (idPath: string, id: InvokeMessage<null>) => InvokeMessage<WindowState>
  'get-os': (idPath: string, id: InvokeMessage<null>) => InvokeMessage<string>
  'get-auxw-data-path-file-uri': (idPath: string, id: InvokeMessage<null>) => InvokeMessage<string>
  'get-auxw-data-uri': (idPath: string, args: InvokeMessage<string[]>) => InvokeMessage<string>
  'get-auxw-file-uri': (idPath: string, args: InvokeMessage<string[]>) => InvokeMessage<string>
  'get-info': <T extends keyof Info>(idPath: string, id: InvokeMessage<T>) => InvokeMessage<Info[T]>
}

const send = <K extends keyof SendType>(channel: K, ...args: Parameters<SendType[K]>): void => {
  ipcRenderer.send(channel, ...args)
}
const on = <K extends keyof OnType>(
  channel: K,
  listener: (event: Electron.IpcRendererEvent, ...args: Parameters<OnType[K]>) => void
): Electron.IpcRenderer => {
  return ipcRenderer.on(channel, listener)
}
const invoke = <K extends keyof InvokeType>(
  channel: K,
  ...args: Parameters<InvokeType[K]>
): Promise<ReturnType<InvokeType[K]>> => {
  return ipcRenderer.invoke(channel, ...args)
}

export const API = { send, on, invoke }

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('API', API)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in @renderer/src/types/types.d.ts)
  window.API = API
}
