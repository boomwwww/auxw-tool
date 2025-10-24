export type ExpParam = {
  id: string
  val: number
  calc?: 'add' | 'mult' | 'set'
  def?: number
}

export type ExpObj = {
  type: 'Live2D Expression'
  fade_in?: number
  fade_out?: number
  params?: ExpParam[]
}

export const isExpObj = (obj: object): boolean => {
  if (
    typeof obj === 'object' &&
    Object.prototype.hasOwnProperty.call(obj, 'type') &&
    obj['type'] === 'Live2D Expression'
  ) {
    return true
  }
  return false
}
