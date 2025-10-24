<script setup lang="ts">
defineOptions({ name: 'AppHeader' })

import { useAppTheme } from '../hooks/useAppTheme'

const windowStore = useWindowStore()
const appTheme = useAppTheme()

const { emit, invoke } = useBus()

let count = 0

let newPath = ''

const onClick = (idName: string): void => {
  switch (idName) {
    case 'set-config':
      // emit('api:set-config', null)
      break
    case 'change':
      newPath = `abc${count++}`
      invoke('api:set-window-id-path', newPath).then((result) => {
        if (result) {
          windowStore.idPath = newPath
        }
      })
      break
    case 'theme':
      appTheme.trigger()
      break
    case 'docs':
      emit('api:create-docs-window', null)
      break
    default:
      break
  }
}
</script>

<template>
  <div class="app-header">
    <div>{{ windowStore.idPath }}</div>
    <div @click="onClick('')"></div>
    <div @click="onClick('theme')">theme</div>
    <div @click="onClick('docs')">docs</div>
  </div>
</template>

<style scoped lang="scss">
.app-header {
  width: 100%;
  height: 100%;

  @include grid-display;
  grid-template:
    'a b c d' 1fr /
    1fr 1fr 48px 48px;
  & > div {
    font-size: 12px;

    @include with-right-border(1);
    &:last-child {
      border: none;
    }
    &:nth-child(3),
    &:nth-child(4) {
      cursor: pointer;
    }
  }
}
</style>
