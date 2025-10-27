import { defineConfig } from 'vitepress'
import { DOCS_DEV_PORT } from './docs_config.json'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'AuxW_Tool 说明文档',
  description: '辅助立绘包管理工具',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    logo: '/resources/logo.png',
    nav: [
      { text: '条目列表', link: '/lib/item-list' },
      { text: '关于', link: '/lib/about' }
    ],

    sidebar: [
      {
        text: '条目列表',
        items: [
          // { text: '条目a', link: '/lib/item-list' },
          // { text: '条目b', link: '/lib/item-list' }
        ]
      }
    ],

    search: {
      provider: 'local'
    }
  },
  head: [
    [
      'meta',
      {
        'http-equiv': 'Content-Security-Policy',
        content: `
          default-src 'self';
          script-src 'self' 'unsafe-inline';
          style-src 'self' 'unsafe-inline';
          img-src 'self' data:;
          font-src 'self' data:;
        `
      }
    ]
  ],
  vite: {
    server: {
      port: DOCS_DEV_PORT
    }
  },
  outDir: '../../out/docs'
})
