import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import fs from 'fs'
import path from 'path'
import { DOCS_DEV_PORT } from '@docs/.vitepress/docs_config.json'

export const paths = {
  join(...args: string[]) {
    return path.join(...args).replaceAll('\\', '/')
  },
  // /** 判断两个路径是否等价 */
  isEqual(path1: string, path2: string): boolean {
    return this.join(path1).toLocaleLowerCase() === this.join(path2).toLocaleLowerCase()
  },
  resolve(...args: string[]) {
    return path.resolve(...args).replaceAll('\\', '/')
  },
  relative(...args: Parameters<typeof path.relative>) {
    return path.relative(...args).replaceAll('\\', '/')
  },
  root(...args: string[]) {
    return this.resolve(__dirname, '..', '..', ...args)
  },
  auxw_data(...args: string[]) {
    if (is.dev) {
      return this.root('auxw_data', ...args)
    } else {
      const rootPath = process.env.PORTABLE_EXECUTABLE_DIR || app.getAppPath()
      return this.resolve(rootPath, 'auxw_data', ...args)
    }
  },
  out(...args: string[]) {
    return this.root('out', ...args)
  },
  main(...args: string[]) {
    return this.out('main', ...args)
  },
  mainIndex() {
    return this.main('index.js')
  },
  preload(...args: string[]) {
    return this.out('preload', ...args)
  },
  preloadIndex() {
    return this.preload('index.js')
  },
  renderer(...args: string[]) {
    return this.out('renderer', ...args)
  },
  rendererIndex() {
    return this.renderer('index.html')
  },
  docs(...args: string[]) {
    return this.out('docs', ...args)
  },
  docsIndex() {
    return this.docs('index.html')
  },
  docsDevUrl() {
    return `http://localhost:${DOCS_DEV_PORT}`
  },
  docsUrl(port: number) {
    return `http://localhost:${port}`
  },
  resources(...args: string[]) {
    if (is.dev) {
      return this.root('resources', ...args)
    } else {
      return this.docs('resources', ...args)
    }
  },
  icon() {
    return this.resources('favicon.ico')
  },
  logo() {
    return this.resources('logo.png')
  },

  /** 得到文件夹下所有文件路径 */
  getAllFilePaths(rootPathAbs: string): {
    pathAbs: string
    pathFromRoot: string
    name: string
  }[] {
    const allFilePathArr: {
      pathAbs: string
      pathFromRoot: string
      name: string
    }[] = []
    const forDirForAllFiles = (pathAbs: string): void => {
      const elemArr = fs.readdirSync(pathAbs)
      elemArr.forEach((elemName: string) => {
        const elemPathAbs: string = paths.resolve(pathAbs, elemName)
        const stat = fs.statSync(elemPathAbs)
        if (stat.isFile()) {
          const elemPathFromRoot = paths.relative(rootPathAbs, elemPathAbs)
          allFilePathArr.push({
            pathAbs: elemPathAbs,
            pathFromRoot: elemPathFromRoot,
            name: elemName
          })
        } else if (stat.isDirectory()) {
          forDirForAllFiles(elemPathAbs)
        }
      })
    }
    forDirForAllFiles(rootPathAbs)
    return allFilePathArr
  }
}
