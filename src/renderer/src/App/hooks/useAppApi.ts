export const useAppApi = (): void => {
  const windowStore = useWindowStore()
  const bus = useBus()
  const API = window.API

  // Sent API
  bus.SEND_TYPE.forEach((key) => {
    bus.on(`api:${key}`, (arg) => {
      // @ts-expect-error 类型无误
      API.send(key, windowStore.idPath, arg)
    })
  })

  // On API
  bus.ON_TYPE.forEach((key) => {
    API.on(key, (_event, arg) => {
      bus.emit(`api:${key}`, arg)
    })
  })

  // Invoke API
  bus.INVOKE_TYPE.forEach((key) => {
    bus.on(`api:${key}`, (msg) => {
      // @ts-expect-error 类型无误
      API.invoke(key, windowStore.idPath, msg).then((res) => {
        bus.emit(`api:${key}-result`, res)
      })
    })
  })
}
