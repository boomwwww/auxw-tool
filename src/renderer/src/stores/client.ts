import { defineStore } from 'pinia'

export const useClientStore = defineStore('client', () => {
  const isLive2dReady = ref(false)
  const isAsideDisplay = ref(true)
  const theme = ref('light')
  return { isLive2dReady, isAsideDisplay, theme }
})
