export type ModelJsonObj = {
  version: string
  layout?: {
    center_x?: number
    center_y?: number
    width?: number
    height?: number
  }
  hit_areas_custom?: { [key: string]: number }
  model: string
  physics: string
  textures: string[]
  motions: { [key: string]: { [key: string]: string }[] }
  expressions: { [key: string]: string }[]
}

/** 判断一个对象是否是模型对象 */
export const isModelJsonObj = (obj: object): boolean => {
  if (
    typeof obj === 'object' &&
    Object.prototype.hasOwnProperty.call(obj, 'model') &&
    Object.prototype.hasOwnProperty.call(obj, 'physics') &&
    Object.prototype.hasOwnProperty.call(obj, 'textures') &&
    Object.prototype.hasOwnProperty.call(obj, 'motions') &&
    Object.prototype.hasOwnProperty.call(obj, 'expressions')
  ) {
    return true
  }
  return false
}
