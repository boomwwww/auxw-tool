import { getObjHash } from '@main/utils/obj'
import { isEqualNumArr } from '@main/utils/num'

export type MtnParamVals = number[]

export type MtnParam = {
  id: string
  vals: MtnParamVals
}

export type MtnObj = MtnParam[]

export const MTN_FILE_HEADER = '# Live2D Animator Motion Data'

export const mtnStr2MtnObj = (mtnStr: string, options = { checkDeclaration: false }): MtnObj => {
  const { checkDeclaration } = options
  if (checkDeclaration && !mtnStr.startsWith(MTN_FILE_HEADER)) {
    throw new Error('Invalid mtn format: missing type declaration')
  }
  return mtnStr.split(/\r?\n/).reduce((acc: MtnObj, lineStr, index) => {
    const i = index + 1
    const l = lineStr.slice(0, 16)
    const lineStrCleaned = lineStr.split(`#`)[0].trim()
    if (lineStrCleaned === '') {
      return acc
    }
    if (!lineStrCleaned.includes('=')) {
      throw new Error(`Invalid mtn format: no '=' found at line ${i}:${l}`)
    }
    const lineStrArr = lineStrCleaned.split('=')
    if (lineStrArr.length !== 2) {
      throw new Error(`Invalid mtn format: more than one '=' found at line ${i}:${l}`)
    }
    const [idStr, valsStr] = lineStrArr
    if (idStr.trim() === '') {
      throw new Error(`Invalid mtn format: empty id at line ${i}:${l}`)
    }
    return [
      ...acc,
      {
        id: idStr.trim(),
        vals: valsStr.split(',').map((numStr) => {
          if (numStr.trim() === '') {
            throw new Error(`Invalid mtn format: empty value at line ${i}:${l}`)
          }
          const num = Number(numStr)
          if (isNaN(num)) {
            throw new Error(`Invalid mtn format: invalid number '${numStr}' at line ${i}:${l}`)
          }
          return Math.round(num * 1000) / 1000
        })
      }
    ]
  }, [])
}

/** mtn对象转文本 */
export const mtnObj2MtnStr = (mtnObj: MtnObj): string => {
  const mtnLineArr = mtnObj.map((param) => {
    if (param.vals === null) {
      throw new Error('Invalid mtn format: null value')
    }
    const numArr = param.vals.map((num) => {
      if (isNaN(num)) {
        throw new Error('Invalid mtn format: invalid number')
      }
      return Math.round(num * 1000) / 1000
    })
    return `${param.id}=${numArr.join(',')}`
  })
  mtnLineArr.unshift(MTN_FILE_HEADER)
  return mtnLineArr.join('\r\n\r\n') + '\r\n'
}

/** mtn对象hash值 */
export const getMtnObjHash = (mtnObj: MtnObj): string => {
  const mtnObjToMtnInnerObj = (mtnObj: MtnObj): { [key: string]: number[] } => {
    const mtnInnerObj: { [key: string]: number[] } = {}
    mtnObj.forEach((param) => {
      mtnInnerObj[param.id] = param.vals
    })
    return mtnInnerObj
  }
  const innerObj = mtnObjToMtnInnerObj(mtnObj)
  return getObjHash(innerObj)
}

/** 获取mtn对象中的某个PARAM，如果没有则返回null */
export const getMtnObjParamValsByParamId = (
  mtnObj: MtnObj,
  paramId: string
): MtnParamVals | null => {
  const param = mtnObj.find((param) => param.id === paramId)
  if (param) {
    return param.vals
  }
  return null
}

/** 获取mtn对象中的PARAM_IMPORT参数，如果没有则返回null */
export const getMtnObjParamImportVals = (mtnObj: MtnObj): MtnParamVals | null => {
  return getMtnObjParamValsByParamId(mtnObj, 'PARAM_IMPORT')
}

/** 去除mtn对象中的特殊参数得到新的mtn对象 */
export const getMtnObjWithoutParamImport = (mtnObj: MtnObj): MtnObj => {
  return getMtnObjWithNewParamImport(mtnObj, null)
}

/** mtn对象hash值（去除PARAM_IMPORT参数） */
export const getMtnObjHashWithoutParamImport = (mtnObj: MtnObj): string => {
  return getMtnObjHash(getMtnObjWithoutParamImport(mtnObj))
}

/**
 * 修改mtn对象中的PARAM_IMPORT参数,
 * 如果mtnObj没有PARAM_IMPORT参数，则添加；如果有，则修改,
 * 如果传入的newParamImportVals是null，则删除PARAM_IMPORT参数
 */
export const getMtnObjWithNewParamImport = (
  mtnObj: MtnObj,
  newParamImportVals: MtnParamVals | null
): MtnObj => {
  return getMtnObjWithNewParam(mtnObj, {
    id: 'PARAM_IMPORT',
    vals: newParamImportVals
  })
}

/**
 * 修改mtn对象中的某个PARAM,
 * 如果mtnObj没有这个PARAM，则添加；如果有，则修改,
 * 如果传入的newParam.vals是null，则删除这个PARAM
 */
export const getMtnObjWithNewParam = (
  mtnObj: MtnObj,
  newParam: MtnParam | { id: string; vals: null }
): MtnObj => {
  let newMtnObj: MtnObj = []
  if (newParam.vals === null) {
    newMtnObj = mtnObj.filter((param) => param.id !== newParam.id)
  } else {
    let hasParam = false
    for (let i = 0; i < mtnObj.length; i++) {
      newMtnObj.push(mtnObj[i])
      if (mtnObj[i].id === newParam.id) {
        newMtnObj[i].vals = newParam.vals
        hasParam = true
      }
    }
    if (!hasParam) {
      newMtnObj.push({
        id: newParam.id,
        vals: newParam.vals
      })
    }
  }
  return newMtnObj
}

/** 判断两个ParamVals是否等价 */
export const isEqualParamVals = (paramVals1: MtnParamVals, paramVals2: MtnParamVals): boolean => {
  return isEqualNumArr(paramVals1, paramVals2)
}
