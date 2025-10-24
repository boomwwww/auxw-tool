export const usePaths = (): typeof paths => {
  const { invoke } = useBus()
  const paths = {
    auxwData(...args: string[]) {
      const dataPathArray = args.map(encodeURIComponent)
      return new Promise<string>((resolve) => {
        invoke('api:get-auxw-data-uri', dataPathArray).then(resolve)
      })
    },
    auxwFile(...args: string[]) {
      const filePathArray = args.map(encodeURIComponent)
      return new Promise<string>((resolve) => {
        invoke('api:get-auxw-file-uri', filePathArray).then(resolve)
      })
    }
  }
  return paths
}
