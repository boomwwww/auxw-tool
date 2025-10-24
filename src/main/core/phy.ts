export type PhysicsHair = {
  label: string
  setup: {
    length: number
    regist: number
    mass: number
  }
  src: {
    id: string
    ptype: string
    scale: number
    weight: number
  }[]
  targets: {
    id: string
    ptype: string
    scale: number
    weight: number
  }[]
}

export type PhyObj = {
  type: string // "Live2D Physics";
  physics_hair: PhysicsHair[]
}

export const isPhyObj = (obj: object): boolean => {
  if (
    typeof obj === 'object' &&
    Object.prototype.hasOwnProperty.call(obj, 'type') &&
    obj['type'] === 'Live2D Physics' &&
    Object.prototype.hasOwnProperty.call(obj, 'physics_hair') &&
    Array.isArray(obj['physics_hair'])
  ) {
    for (const hair of obj['physics_hair']) {
      if (
        !(
          Object.prototype.hasOwnProperty.call(hair, 'label') &&
          Object.prototype.hasOwnProperty.call(hair, 'setup') &&
          Object.prototype.hasOwnProperty.call(hair, 'src') &&
          Object.prototype.hasOwnProperty.call(hair, 'targets')
        )
      ) {
        return false
      }
    }
    return true
  }
  return false
}
