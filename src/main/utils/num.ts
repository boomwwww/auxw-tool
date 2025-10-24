/** 判断两个浮点数是否相等（默认只比较小数点后3位） */
export const isEqualFloatWithPrecision = (
  num1: number,
  num2: number,
  precision: number = 3
): boolean => {
  return num1.toFixed(precision) === num2.toFixed(precision)
}

/** 判断两个数的数组是否完全相等（默认精确到小数点后3位） */
export const isEqualNumArr = (arr1: number[], arr2: number[], precision: number = 3): boolean => {
  if (arr1.length !== arr2.length) {
    return false
  }
  for (let i = 0; i < arr1.length; i++) {
    if (!isEqualFloatWithPrecision(arr1[i], arr2[i], precision)) {
      return false
    }
  }
  return true
}
