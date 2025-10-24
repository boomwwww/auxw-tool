export const loadScript = (url: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = url
    script.onload = () => resolve()
    script.onerror = (error) => reject(error)
    document.head.appendChild(script)
  })
}

let idCount = 0
export const getId = (): string => {
  return `${idCount++}-${Date.now()}`
}
