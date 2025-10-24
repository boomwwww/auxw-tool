<script setup lang="ts">
defineOptions({ name: 'SplitPane' })

const props = withDefaults(
  defineProps<{
    dragDirection?: 'horizontal' | 'vertical'
    basisSize?: number
    minSize?: number
    maxSize?: number
    realTime?: boolean
    basicResizable?: boolean
  }>(),
  {
    dragDirection: 'horizontal',
    basisSize: 25, // 第一个区域的初始的百分比
    minSize: 10, // 第一个区域的最小的百分比
    maxSize: 90, // 第一个区域的最大的百分比
    realTime: true, // 是否实时更新百分比
    basicResizable: true // 是否初始可拖拽
  }
)

const container = useTemplateRef('split-pane')
const resizeHandle = useTemplateRef('resize-handle')

const leftWidthPercent = ref(props.basisSize) // 左侧初始宽度
const topHeightPercent = ref(props.basisSize) // 上侧初始高度

const resizable = ref(true)

let isDragging = false

const startDrag = (): void => {
  isDragging = true
}

const handelResize = (e: MouseEvent): void => {
  if (!isDragging || !container.value) return
  const containerRect = container.value.getBoundingClientRect()
  const containerToMouseWidth = e.clientX - containerRect.left
  const containerToMouseHeight = e.clientY - containerRect.top
  const newWidthPercent = (containerToMouseWidth / containerRect.width) * 100
  const newHeightPercent = (containerToMouseHeight / containerRect.height) * 100
  // 最大最小限制
  if (newWidthPercent > props.minSize && newWidthPercent < props.maxSize) {
    leftWidthPercent.value = newWidthPercent
  }
  if (newHeightPercent > props.minSize && newHeightPercent < props.maxSize) {
    topHeightPercent.value = newHeightPercent
  }
}

const doDrag = (e: MouseEvent): void => {
  if (props.realTime) {
    handelResize(e)
  }
}

const stopDrag = (e: MouseEvent): void => {
  handelResize(e)
  isDragging = false
}

const initDragListeners = (): void => {
  if (resizeHandle.value) {
    resizeHandle.value.addEventListener('mousedown', startDrag)
    document.addEventListener('mousemove', doDrag)
    document.addEventListener('mouseup', stopDrag)
  }
}

const removeDragListeners = (): void => {
  if (resizeHandle.value) {
    resizeHandle.value.removeEventListener('mousedown', startDrag)
    document.removeEventListener('mousemove', doDrag)
    document.removeEventListener('mouseup', stopDrag)
  }
}

const getSize = (): number => {
  return leftWidthPercent.value
}

const setSize = (size: number): void => {
  leftWidthPercent.value = size
  topHeightPercent.value = size
}

const setResizable = (isResizable: boolean): void => {
  resizable.value = isResizable
  if (resizable.value) {
    initDragListeners()
    if (resizeHandle.value) {
      resizeHandle.value.classList.add('resize-handle')
    }
  } else {
    removeDragListeners()
    if (resizeHandle.value) {
      resizeHandle.value.classList.remove('resize-handle')
    }
  }
}

defineExpose({ getSize, setSize, setResizable })

onMounted(() => {
  nextTick(() => {
    setResizable(props.basicResizable)
  })
})

onUnmounted(() => {
  removeDragListeners()
})
</script>

<template>
  <div
    ref="split-pane"
    class="split-pane"
    :style="{
      display: 'flex',
      height: '100%',
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: props.dragDirection === 'horizontal' ? 'row' : 'column'
    }"
  >
    <!-- 第一区域 -->
    <div
      class="first-panel"
      :style="{
        display: 'flex',
        overflow: 'auto',
        flexBasis:
          props.dragDirection === 'horizontal' ? leftWidthPercent + '%' : topHeightPercent + '%',
        height: props.dragDirection === 'horizontal' ? '100%' : 'auto',
        width: props.dragDirection !== 'horizontal' ? '100%' : 'auto'
      }"
    >
      <slot name="first"></slot>
    </div>

    <!-- 可拖拽分隔条 -->
    <div
      ref="resize-handle"
      class="resize-handle"
      :style="{
        display: resizable ? 'flex' : 'none',
        height: props.dragDirection === 'horizontal' ? '100%' : '4px',
        width: props.dragDirection !== 'horizontal' ? '100%' : '4px',
        cursor: resizable
          ? props.dragDirection !== 'horizontal'
            ? 'row-resize'
            : 'col-resize'
          : 'default'
      }"
    ></div>

    <!-- 第二区域 -->
    <div
      class="second-panel"
      :style="{
        display: 'flex',
        overflow: 'auto',
        flex: 1,
        height: props.dragDirection === 'horizontal' ? '100%' : 'auto',
        width: props.dragDirection !== 'horizontal' ? '100%' : 'auto'
      }"
    >
      <slot name="second"></slot>
    </div>
  </div>
</template>

<style scoped lang="css">
.resize-handle {
  background-color: var(--color-border, #ddd);
  transition: background-color 0.2s;
}
.resize-handle:hover {
  background-color: var(--color-primary, #3388bb);
}
</style>
