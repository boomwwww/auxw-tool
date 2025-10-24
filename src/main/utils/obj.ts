import crypto from 'crypto'

/** 递归规范化 obj 对象 */
export const normalizeObj = (obj: unknown): unknown => {
  // 基本类型直接返回
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map((item) => normalizeObj(item))
  }

  // 处理对象：排序键后递归处理
  const sortedObj: { [key: string]: unknown } = {}
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sortedObj[key] = normalizeObj(obj[key])
    })

  return sortedObj
}

export const getStrHash = (str: string): string => {
  return crypto.createHash('sha512').update(str).digest('hex').slice(0, 16)
}

export const getObjHash = (obj: unknown): string => {
  return getStrHash(JSON.stringify(normalizeObj(obj)))
}
