import { defineStore } from 'pinia'

export const useWindowStore = defineStore('window', () => {
  const idPath = ref('')
  const state = reactive({
    isMinimized: false,
    isMaximized: true,
    isFullScreen: false,
    isVisible: true,
    isFocused: true,
    size: [600, 800],
    position: [0, 0]
  })
  return { idPath, state }
})
