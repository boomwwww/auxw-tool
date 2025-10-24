declare type CreatePackageOption = {
  mtnSpecialParamStrictMode: boolean
}

declare type CharaTreeNodeFigurePackage = {
  nodeType: 'CharaTreeNodeFigurePackage'
  idName: string
  description?: string
  children: (CharaTreeNodeCharaGroup | CharaTreeNodeChara)[]
}
declare type CharaTreeNodeCharaGroup = {
  nodeType: 'CharaTreeNodeCharaGroup'
  idName: string
  description?: string
  children: (CharaTreeNodeCharaGroup | CharaTreeNodeChara)[]
}
declare type CharaTreeNodeChara = {
  nodeType: 'CharaTreeNodeChara'
  idName: string
  description?: string
  children: (CharaTreeNodeCharaInnerGroup | CharaTreeNodeCharaInnerElement)[]
}
declare type CharaTreeNodeCharaInnerGroup = {
  nodeType: 'CharaTreeNodeCharaInnerGroup'
  idName: string
  description?: string
  type: 'outfit-group' | 'composite-model'
  children: (CharaTreeNodeCharaInnerGroup | CharaTreeNodeCharaInnerElement)[]
}
declare type CharaTreeNodeCharaInnerElement = {
  nodeType: 'CharaTreeNodeCharaInnerElement'
  idName: string
  type: 'picture' | 'outfit-model' | 'composite-model'
  hash: string
  identityMtnParamImport?: number[] | null | undefined
}

declare type MotionTree = {
  idName: string
  description?: string
  children: MotionTreeNode[]
}

declare type MotionTreeNode = {
  idName: string
  description?: string
  hash?: string
  children: MotionTreeNode[]
}
declare type ExpressionTree = {
  idName: string
  description?: string
  children: ExpressionTreeNode[]
}

declare type ExpressionTreeNode = {
  idName: string
  description?: string
  hash?: string
  children: ExpressionTreeNode[]
}
