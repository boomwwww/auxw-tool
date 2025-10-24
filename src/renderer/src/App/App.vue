<script setup lang="ts">
defineOptions({ name: 'App' })

import { AppHeader, AppNav, AppMain, AppFooter } from './layouts'
import { useAppHooks } from './hooks'

useAppHooks()

const clientStore = useClientStore()
const mainSplitPane = useTemplateRef('main-split-pane')
let mainSplitPaneSize = 15
watch(
  () => clientStore.isAsideDisplay,
  (shouldDisplay) => {
    if (shouldDisplay) {
      mainSplitPane.value?.setSize(mainSplitPaneSize)
      mainSplitPane.value?.setResizable(true)
    } else {
      mainSplitPaneSize = mainSplitPane.value!.getSize()
      mainSplitPane.value?.setSize(0)
      mainSplitPane.value?.setResizable(false)
    }
  }
)
</script>

<template>
  <div class="app">
    <header>
      <AppHeader />
    </header>
    <nav>
      <ScrollArea x="break" y="auto" wheel-direction="vertical">
        <AppNav />
      </ScrollArea>
    </nav>
    <main>
      <SplitPane
        ref="main-split-pane"
        :drag-direction="'horizontal'"
        :basis-size="15"
        :min-size="5"
        :max-size="50"
      >
        <template #first>
          <ScrollArea>
            <RouterView v-slot="{ Component, route }">
              <KeepAlive>
                <component :is="Component" :key="route.fullPath" />
              </KeepAlive>
            </RouterView>
          </ScrollArea>
        </template>
        <template #second>
          <AppMain />
        </template>
      </SplitPane>
    </main>
    <footer>
      <AppFooter />
    </footer>
  </div>
</template>

<style lang="scss">
@use '@/styles/index.scss' as *;
// @use '@/styles/mixin.scss' as *;
// 已在 electron.vite.config.ts 中的 renderer.css 中配置
// 为所有 scss 文件添加 `@use '@/styles/mixin.scss' as *;`
// 因此不再需要为每个文件单独添加
.app {
  width: 100vw;
  height: 100vh;
  background-color: var(--color-bg);

  @include grid-display;
  grid-template:
    'header  header' 48px
    'nav     main  ' 1fr
    'footer  footer' 32px /
    64px 1fr;
  & > header {
    grid-area: header;
    @include with-bottom-border(1);
  }
  & > nav {
    grid-area: nav;
    @include with-right-border(1);
    background-color: color-mix(in hsl, var(--color-primary) 12.5%, var(--color-bg));
  }
  & > main {
    grid-area: main;
  }
  & > footer {
    grid-area: footer;
    @include with-top-border(1);
  }
}
</style>
