export const useAppTheme = (): typeof appTheme => {
  const clientStore = useClientStore()
  const appTheme = {
    trigger() {
      if (clientStore.theme === 'dark') {
        clientStore.theme = 'light'
      } else {
        clientStore.theme = 'dark'
      }
    }
  }
  return appTheme
}
