import type { MtnObj } from '@main/core'
import type { ExpObj } from '@main/core'

/** 动作参数清点 */
export const collectUniqueMtnObjArrParamIds = (mtnObjArr: MtnObj[]): string[] => {
  const mtnParamIdSet = new Set<string>()
  mtnObjArr.forEach((mtnObj) => {
    mtnObj.forEach((param) => {
      mtnParamIdSet.add(param.id)
    })
  })
  return Array.from(mtnParamIdSet).sort()
}

/** 动作参数使用频率统计 */
export const statisticMtnParamUsageFrequency = (
  mtnObjArr: MtnObj[]
): { id: string; count: number }[] => {
  const mtnParamIdMap = new Map<string, number>()
  mtnObjArr.forEach((mtnObj) => {
    mtnObj.forEach((param) => {
      if (mtnParamIdMap.has(param.id)) {
        mtnParamIdMap.set(param.id, mtnParamIdMap.get(param.id)! + 1)
      } else {
        mtnParamIdMap.set(param.id, 1)
      }
    })
  })
  return Array.from(mtnParamIdMap)
    .map((el) => ({
      id: el[0],
      count: el[1]
    }))
    .sort((a, b) => b.count - a.count)
}

/** 表情参数清点 */
export const collectUniqueExpObjArrParamIds = (expObjArr: ExpObj[]): string[] => {
  const expParamIdSet = new Set<string>()
  expObjArr.forEach((expObj) => {
    expObj.params?.forEach((param) => {
      expParamIdSet.add(param.id)
    })
  })
  return Array.from(expParamIdSet).sort()
}

/** 表情参数使用频率统计 */
export const statisticExpParamUsageFrequency = (
  expObjArr: ExpObj[]
): { id: string; count: number }[] => {
  const expParamIdMap = new Map<string, number>()
  expObjArr.forEach((expObj) => {
    expObj.params?.forEach((param) => {
      if (expParamIdMap.has(param.id)) {
        expParamIdMap.set(param.id, expParamIdMap.get(param.id)! + 1)
      } else {
        expParamIdMap.set(param.id, 1)
      }
    })
  })
  return Array.from(expParamIdMap)
    .map((el) => ({
      id: el[0],
      count: el[1]
    }))
    .sort((a, b) => b.count - a.count)
}
