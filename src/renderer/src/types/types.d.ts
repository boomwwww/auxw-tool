declare type SendType = import('@preload/index').SendType
declare type OnType = import('@preload/index').OnType
declare type InvokeType = import('@preload/index').InvokeType
declare type Api = typeof import('@preload/index').API

interface Window {
  API: Api
  PIXI: typeof import('pixi.js')
  PixiLive2dDisplay: typeof import('pixi-live2d-display')
}

interface ICoreModel {
  setParamFloat: (paramName: string, value: number) => void
}
