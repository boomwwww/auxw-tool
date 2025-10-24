import fs from 'fs'
import { paths } from '@main/utils/paths'
import type { ModelJsonObj, MtnObj, ExpObj, PhyObj } from '../core'
import { isModelJsonObj, isPhyObj, isExpObj, mtnStr2MtnObj, getMtnObjHash } from '../core'
import { getObjHash } from '@main/utils/obj'
// import {
// collectUniqueExpObjArrParamIds,
//   collectUniqueMtnObjArrParamIds,
//   statisticExpParamUsageFrequency,
//   statisticMtnParamUsageFrequency
// } from '../lib/statistic'

export class FigurePackageManager {
  path: string
  pathType: 'relative' | 'absolute'
  private fullPath: string
  private fileCache: {
    modelJson: Map<string, ModelJsonObj>
    phy: Map<string, PhyObj>
    mtn: Map<string, MtnObj>
    exp: Map<string, ExpObj>
  }
  modelJsonFileList: { pathFromRoot: string; hash: string }[] = []
  phyFileList: { pathFromRoot: string; hash: string }[] = []
  mtnFileList: { pathFromRoot: string; hash: string }[] = []
  expFileList: { pathFromRoot: string; hash: string }[] = []

  constructor(options: { path: string; pathType: 'relative' | 'absolute' }) {
    this.path = paths.join(options.path)
    this.pathType = options.pathType
    this.fullPath =
      this.pathType === 'relative' ? paths.auxw_data(this.path) : paths.resolve(this.path)
    this.fileCache = {
      modelJson: new Map(),
      mtn: new Map(),
      exp: new Map(),
      phy: new Map()
    }
    this.loadInfo()
  }

  loadInfo(): void {
    const filePaths = paths.getAllFilePaths(this.fullPath)
    filePaths.forEach((filePathElem) => {
      const ext = (() => {
        const extIndex = filePathElem.name.lastIndexOf('.')
        return extIndex === -1 ? '' : filePathElem.name.slice(extIndex + 1)
      })()

      if (ext === 'json') {
        let jsonObj: unknown
        try {
          jsonObj = JSON.parse(fs.readFileSync(filePathElem.pathAbs, 'utf8'))
        } catch (error) {
          console.error(error)
          return
        }
        if (typeof jsonObj !== 'object' || jsonObj === null) {
          console.error(`${filePathElem.pathAbs} is not a valid json file`)
          return
        }
        if (isModelJsonObj(jsonObj)) {
          const modelJsonObj = jsonObj as ModelJsonObj
          const modelJsonObjHash = getObjHash(modelJsonObj)
          this.fileCache.modelJson.set(modelJsonObjHash, modelJsonObj)
          this.modelJsonFileList.push({
            pathFromRoot: filePathElem.pathFromRoot,
            hash: modelJsonObjHash
          })
          return
        } else if (isPhyObj(jsonObj)) {
          const phyObj = jsonObj as PhyObj
          const phyObjHash = getObjHash(phyObj)
          this.fileCache.phy.set(phyObjHash, phyObj)
          this.phyFileList.push({
            pathFromRoot: filePathElem.pathFromRoot,
            hash: phyObjHash
          })
          return
        } else if (isExpObj(jsonObj)) {
          const expObj = jsonObj as ExpObj
          const expObjHash = getObjHash(expObj)
          this.fileCache.exp.set(expObjHash, expObj)
          this.expFileList.push({
            pathFromRoot: filePathElem.pathFromRoot,
            hash: expObjHash
          })
          return
        }
      } else if (ext === 'mtn') {
        let mtnObj: MtnObj
        try {
          mtnObj = mtnStr2MtnObj(fs.readFileSync(filePathElem.pathAbs, 'utf8'))
        } catch (error) {
          console.error(error)
          return
        }
        const mtnObjHash = getMtnObjHash(mtnObj)
        this.fileCache.mtn.set(mtnObjHash, mtnObj)
        this.mtnFileList.push({
          pathFromRoot: filePathElem.pathFromRoot,
          hash: mtnObjHash
        })
      }
    })
  }
}
