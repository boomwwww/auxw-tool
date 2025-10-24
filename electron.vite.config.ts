import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

import autoImport from 'unplugin-auto-import/vite'
import vueComponents from 'unplugin-vue-components/vite'

const _resolve = {
  alias: {
    '@': resolve('src/renderer/src'),
    '@renderer': resolve('src/renderer'),
    '@preload': resolve('src/preload'),
    '@docs': resolve('src/docs'),
    '@main': resolve('src/main'),
    '@src': resolve('src'),
    '@resources': resolve('resources'),
    '@root': resolve('.')
  }
}

export default defineConfig({
  main: { resolve: _resolve, plugins: [externalizeDepsPlugin()] },
  preload: { resolve: _resolve, plugins: [externalizeDepsPlugin()] },
  renderer: {
    resolve: _resolve,
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => ['webview'].includes(tag)
          }
        }
      }),
      autoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/types/auto/import.d.ts',
        vueTemplate: true
      }),
      autoImport({
        dirs: ['src/stores'],
        dts: 'src/types/auto/stores.d.ts',
        vueTemplate: true
      }),
      autoImport({
        dirs: ['src/hooks'],
        dts: 'src/types/auto/hooks.d.ts',
        vueTemplate: true
      }),
      vueComponents({
        dirs: ['src/components'],
        dts: 'src/types/auto/components.d.ts'
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '@/styles/mixin.scss' as *;`
        }
      }
    }
  }
})
