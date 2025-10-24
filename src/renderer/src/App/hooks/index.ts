import { useAppApi } from './useAppApi'
import { useAppLive2d } from './useAppLive2d'

export const useAppHooks = (): void => {
  useAppApi()
  const { on, invoke } = useBus()
  const systemStore = useSystemStore()
  const windowStore = useWindowStore()
  const clientStore = useClientStore()
  const appLive2d = useAppLive2d()

  appLive2d.loadLive2dScript().then((isSuccess) => {
    if (isSuccess) {
      clientStore.isLive2dReady = true
    } else {
      console.error('App Live2D 相关脚本加载失败！')
    }
  })

  invoke('api:get-os', null).then((os) => {
    if (os === 'win32') {
      systemStore.os = 'win'
    } else if (os === 'darwin') {
      systemStore.os = 'mac'
    } else {
      systemStore.os = 'linux'
    }
  })
  invoke('api:get-window-state', null).then((state) => {
    windowStore.state = state
  })
  invoke('api:get-auxw-data-path-file-uri', null).then((auxwDataPath) => {
    systemStore.auxwDataPath = auxwDataPath
  })

  on('api:on-window-created', (idPath) => {
    windowStore.idPath = idPath
  })
  on('api:on-window-full-screen-changed', (isFullscreen) => {
    windowStore.state.isFullScreen = isFullscreen
  })
  on('api:on-window-id-path-changed', (idPath) => {
    windowStore.idPath = idPath
  })

  watch(
    () => clientStore.theme,
    (theme) => {
      document.documentElement.dataset.theme = theme
    }
  )
}
