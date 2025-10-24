import { defineStore } from 'pinia'

export const useSystemStore = defineStore('system', () => {
  const os = ref<'win' | 'mac' | 'linux' | ''>('')
  const auxwDataPath = ref('')
  return { os, auxwDataPath }
})
