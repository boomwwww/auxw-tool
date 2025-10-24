import { loadScript } from '@/utils'

interface AppLive2d {
  loadLive2dCubismCoreLegacyScript(): Promise<boolean>
  loadLive2dCubismCoreScript(): Promise<boolean>
  loadPixiScript(): Promise<boolean>
  loadPixiLive2dDisplayScript(): Promise<boolean>
  loadLive2dScript(): Promise<boolean>
}

export const useAppLive2d = (): AppLive2d => {
  const paths = usePaths()

  return {
    loadLive2dCubismCoreLegacyScript() {
      return new Promise<boolean>((resolve) => {
        paths
          .auxwData('lib', 'live2d.min.js')
          .then(loadScript)
          .then(() => {
            console.log('Live2D Cubismcore Legacy 相关脚本加载完成！')
            resolve(true)
          })
          .catch((error) => {
            console.error(`加载 Live2D Cubismcore Legacy 相关脚本时出错！`)
            console.error(error)
            resolve(false)
          })
      })
    },
    loadLive2dCubismCoreScript() {
      return new Promise<boolean>((resolve) => {
        paths
          .auxwData('lib', 'live2dcubismcore.min.js')
          .then(loadScript)
          .then(() => {
            console.log('Live2D Cubismcore 相关脚本加载完成！')
            resolve(true)
          })
          .catch((error) => {
            console.error(`加载 Live2D Cubismcore 相关脚本时出错！`)
            console.error(error)
            resolve(false)
          })
      })
    },
    loadPixiScript() {
      return new Promise<boolean>((resolve) => {
        import('pixi.js')
          .then((pixi) => {
            window.PIXI = pixi
            console.log('PIXI 相关脚本加载完成！')
            resolve(true)
          })
          .catch((error) => {
            console.error(`加载 PIXI 相关脚本时出错！`)
            console.error(error)
            resolve(false)
          })
      })
    },
    loadPixiLive2dDisplayScript() {
      return new Promise<boolean>((resolve) => {
        import('pixi-live2d-display')
          .then((pixiLive2dDisplay) => {
            window.PixiLive2dDisplay = pixiLive2dDisplay
            console.log('PixiLive2dDisplay 相关脚本加载完成！')
            resolve(true)
          })
          .catch((error) => {
            console.error(`加载 PixiLive2dDisplay 相关脚本时出错！`)
            console.error(error)
            resolve(false)
          })
      })
    },
    async loadLive2dScript() {
      if (!(await this.loadLive2dCubismCoreLegacyScript())) return false
      if (!(await this.loadLive2dCubismCoreScript())) return false
      if (!(await this.loadPixiScript())) return false
      if (!(await this.loadPixiLive2dDisplayScript())) return false
      return true
    }
  }
}
