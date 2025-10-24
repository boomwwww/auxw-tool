import { onUnmounted } from 'vue'
import mitt, { type Handler } from '@/utils/mitt'
import { getId } from '@/utils'

type EnsureAllKeys<
  T extends readonly unknown[],
  K extends string,
  Acc = never
> = T extends readonly [infer Head, ...infer Tail]
  ? Head extends K
    ? EnsureAllKeys<Tail, K, Acc | Head>
    : 'Invalid key'
  : K extends Acc
    ? T
    : 'Missing keys'

type KeyCheck<T extends []> = T

const SEND_TYPE = [
  'create-new-window',
  'create-docs-window',
  'set-window-full-screen',
  'set-window-full-screen-toggle',
  'set-config'
] as const

// 如果下面这行报错，说明上面的 SEND_TYPE 中的 key 相对于 preload/index.ts 中定义的 key 存在错误，可能缺少或多出了
export type SendKeyCheck = KeyCheck<EnsureAllKeys<typeof SEND_TYPE, keyof SendType>>

const ON_TYPE = [
  'on-window-created',
  'on-window-full-screen-changed',
  'on-window-id-path-changed'
] as const

// 如果下面这行报错，说明上面的 ON_TYPE 中的 key 相对于 preload/index.ts 中定义的 key 存在错误，可能缺少或多出了
export type OnKeyCheck = KeyCheck<EnsureAllKeys<typeof ON_TYPE, keyof OnType>>

const INVOKE_TYPE = [
  'set-window-id-path',
  'get-window-state',
  'get-os',
  'get-auxw-data-path-file-uri',
  'get-auxw-data-uri',
  'get-auxw-file-uri',
  'get-info'
] as const

// 如果下面这行报错，说明上面的 INVOKE_TYPE 中的 key 相对于 preload/index.ts 中定义的 key 存在错误，可能缺少或多出了
export type InvokeKeyCheck = KeyCheck<EnsureAllKeys<typeof INVOKE_TYPE, keyof InvokeType>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractParam<T> = T extends () => any
  ? null
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends (_: any, arg: infer P) => any
    ? P
    : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractOnParam<T> = T extends () => any ? null : T extends (arg: infer P) => any ? P : never

type ApiSendEvents = {
  [K in keyof SendType as `api:${K}`]: ExtractParam<SendType[K]>
}
type ApiOnEvents = {
  [K in keyof OnType as `api:${K}`]: ExtractOnParam<OnType[K]>
}
type ApiInvokeEvents = {
  [K in keyof InvokeType as `api:${K}`]: ExtractParam<InvokeType[K]>
}
type ApiInvokeResultEvents = {
  [K in keyof InvokeType as `api:${K}-result`]: ReturnType<InvokeType[K]>
}

type ApiEvents = ApiSendEvents & ApiOnEvents & ApiInvokeEvents & ApiInvokeResultEvents

type AppEvents = {
  demo: void
}

type Events = ApiEvents & AppEvents

const eventBus = mitt<Events>()

export const useBus = (): typeof bus => {
  const handlers = new Map<keyof Events, Set<Handler<Events[keyof Events]>>>()
  const on = <K extends keyof Events>(type: K, handler: Handler<Events[K]>): void => {
    const handlerSet = handlers.get(type)
    if (!handlerSet) {
      const newHandlerSet = new Set<Handler<Events[keyof Events]>>()
      newHandlerSet.add(handler as Handler<Events[keyof Events]>)
      handlers.set(type, newHandlerSet)
    } else {
      handlerSet.add(handler as Handler<Events[keyof Events]>)
    }
    eventBus.on(type, handler)
  }
  const once = <K extends keyof Events>(type: K, handler: Handler<Events[K]>): void => {
    const handlerWrapper = (event: Events[K]): void => {
      try {
        handler(event)
      } finally {
        eventBus.off(type, handlerWrapper)
      }
    }
    eventBus.on(type, handlerWrapper)
  }
  const emit = <K extends keyof Events>(type: K, event: Events[K]): void => {
    eventBus.emit(type, event)
  }
  const emitOnce = <K extends keyof Events, L extends keyof Events>(
    emitType: K,
    emitEvent: Events[K],
    onType: L,
    onHandler: Handler<Events[L]>
  ): void => {
    const handlerWrapper = (event: Events[L]): void => {
      try {
        onHandler(event)
      } finally {
        eventBus.off(onType, handlerWrapper)
      }
    }
    eventBus.on(onType, handlerWrapper)
    eventBus.emit(emitType, emitEvent)
  }
  const invoke = <K extends keyof ApiInvokeEvents, L extends `${K}-result`>(
    emitType: K,
    emitEvent: Events[K]['data' extends keyof Events[K] ? 'data' : never]
  ): Promise<Events[L]['data' extends keyof Events[L] ? 'data' : never]> => {
    const _id = getId()
    const onType = `${emitType}-result` as L
    return new Promise((resolve) => {
      const handlerWrapper = (event: Events[L]): void => {
        if (event.id !== _id) return
        try {
          resolve(event.data)
        } finally {
          eventBus.off(onType, handlerWrapper)
        }
      }
      eventBus.on(onType, handlerWrapper)
      const _emitEvent = {
        id: _id,
        data: emitEvent
      } as Events[K]
      eventBus.emit(emitType, _emitEvent)
    })
  }
  const off = <K extends keyof Events>(type: K, handler: Handler<Events[K]>): void => {
    const handlerSet = handlers.get(type)
    if (handlerSet) {
      handlerSet.delete(handler as Handler<Events[keyof Events]>)
      if (handlerSet.size === 0) {
        handlers.delete(type)
      }
    }
    eventBus.off(type, handler)
  }
  onUnmounted(() => {
    handlers.forEach((handlerSet, type) => {
      handlerSet.forEach((handler) => {
        eventBus.off(type, handler)
      })
    })
    handlers.clear()
  })
  const bus = { SEND_TYPE, ON_TYPE, INVOKE_TYPE, on, once, emit, emitOnce, invoke, off }
  return bus
}
