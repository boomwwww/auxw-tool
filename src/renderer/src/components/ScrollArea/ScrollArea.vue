<script setup lang="ts">
defineOptions({ name: 'ScrollArea' })

const props = withDefaults(
  defineProps<{
    x?: 'auto' | 'scroll' | 'hidden' | 'break'
    xBarSide?: 'top' | 'bottom'
    y?: 'auto' | 'scroll' | 'hidden' | 'break'
    yBarSide?: 'left' | 'right'
    wheelSensitivity?: number
    wheelDirection?: 'vertical' | 'horizontal' | 'both' | 'none'
  }>(),
  {
    x: 'auto',
    xBarSide: 'bottom',
    y: 'auto',
    yBarSide: 'right',
    wheelSensitivity: 0.1,
    wheelDirection: 'both'
  }
)

const showLeftBar = computed(() => {
  return (
    props.yBarSide === 'left' &&
    (props.y === 'scroll' || (props.y === 'auto' && yThumbSize.value < 100))
  )
})

const showRightBar = computed(() => {
  return (
    props.yBarSide === 'right' &&
    (props.y === 'scroll' || (props.y === 'auto' && yThumbSize.value < 100))
  )
})

const showTopBar = computed(() => {
  return (
    props.xBarSide === 'top' &&
    (props.x === 'scroll' || (props.x === 'auto' && xThumbSize.value < 100))
  )
})

const showBottomBar = computed(() => {
  return (
    props.xBarSide === 'bottom' &&
    (props.x === 'scroll' || (props.x === 'auto' && xThumbSize.value < 100))
  )
})

const area = useTemplateRef('scroll-area')
const content = useTemplateRef('content')
const leftThumb = useTemplateRef('left-thumb')
const rightThumb = useTemplateRef('right-thumb')
const topThumb = useTemplateRef('top-thumb')
const bottomThumb = useTemplateRef('bottom-thumb')

const areaWidth = ref(0)
const areaHeight = ref(0)
const contentWidth = ref(0)
const contentHeight = ref(0)

const updateSizeData = (): void => {
  if (!(area.value && content.value)) {
    return
  }
  const areaRect = area.value.getBoundingClientRect()
  areaWidth.value = areaRect.width
  areaHeight.value = areaRect.height

  const contentRect = content.value.getBoundingClientRect()
  contentWidth.value = contentRect.width
  contentHeight.value = contentRect.height

  if (parseInt(content.value?.style.left) < areaWidth.value - contentWidth.value) {
    content.value.style.left = `${areaWidth.value - contentWidth.value}px`
  }
  if (parseInt(content.value?.style.left) > 0) {
    content.value.style.left = '0px'
  }

  if (parseInt(content.value?.style.top) < areaHeight.value - contentHeight.value) {
    content.value.style.top = `${areaHeight.value - contentHeight.value}px`
  }
  if (parseInt(content.value?.style.top) > 0) {
    content.value.style.top = '0px'
  }
}
const resizeObserver = new ResizeObserver(updateSizeData)

const xThumbSize = computed(() => {
  let thumbSize = (areaWidth.value / contentWidth.value) * 100
  if (thumbSize < 10) {
    thumbSize = 10
  } else if (thumbSize > 100) {
    thumbSize = 100
  }
  return thumbSize
})

const yThumbSize = computed(() => {
  let thumbSize = (areaHeight.value / contentHeight.value) * 100
  if (thumbSize < 10) {
    thumbSize = 10
  } else if (thumbSize > 100) {
    thumbSize = 100
  }
  return thumbSize
})

const xThumbDistance = ref(0)
const yThumbDistance = ref(0)

let isDraggingX = false
let isDraggingY = false

const startDragX = (e: MouseEvent): void => {
  isDraggingX = true
  startX = e.clientX
  startXPercent = xThumbDistance.value
}
const startDragY = (e: MouseEvent): void => {
  isDraggingY = true
  startY = e.clientY
  startYPercent = yThumbDistance.value
}

let startX: number
let startY: number

let startXPercent: number
let startYPercent: number

const doDrag = (e: MouseEvent): void => {
  if (!(area.value && content.value)) {
    return
  }
  if (isDraggingX) {
    const movePercent = ((e.clientX - startX) / areaWidth.value) * 100
    let newXPercent = startXPercent + movePercent
    if (newXPercent < 0) {
      newXPercent = 0
    } else if (newXPercent > 100 - xThumbSize.value) {
      newXPercent = 100 - xThumbSize.value
    }
    const newContentX = (newXPercent / 100) * contentWidth.value
    content.value.style.left = `${-newContentX}px`
    xThumbDistance.value = newXPercent
  }
  if (isDraggingY) {
    const movePercent = ((e.clientY - startY) / areaHeight.value) * 100
    let newYPercent = startYPercent + movePercent
    if (newYPercent < 0) {
      newYPercent = 0
    } else if (newYPercent > 100 - yThumbSize.value) {
      newYPercent = 100 - yThumbSize.value
    }
    const newContentY = (newYPercent / 100) * contentHeight.value
    content.value.style.top = `${-newContentY}px`
    yThumbDistance.value = newYPercent
  }
}

const stopDrag = (): void => {
  isDraggingX = false
  isDraggingY = false
}

const handelWheel = (e: WheelEvent): void => {
  if (!content.value) {
    return
  }
  e.preventDefault()
  if (
    props.wheelDirection === 'vertical' ||
    (props.wheelDirection === 'both' && yThumbSize.value < 100)
  ) {
    let newYPercent = yThumbDistance.value + e.deltaY * props.wheelSensitivity
    if (newYPercent < 0) {
      newYPercent = 0
    } else if (newYPercent > 100 - yThumbSize.value) {
      newYPercent = 100 - yThumbSize.value
    }
    const newContentY = (newYPercent / 100) * contentHeight.value
    content.value.style.top = `${-newContentY}px`
    yThumbDistance.value = newYPercent
  } else if (props.wheelDirection === 'horizontal' || props.wheelDirection === 'both') {
    let newXPercent = xThumbDistance.value + e.deltaY * props.wheelSensitivity
    if (newXPercent < 0) {
      newXPercent = 0
    } else if (newXPercent > 100 - xThumbSize.value) {
      newXPercent = 100 - xThumbSize.value
    }
    const newContentX = (newXPercent / 100) * contentWidth.value
    content.value.style.left = `${-newContentX}px`
    xThumbDistance.value = newXPercent
  }
}

const initDragListeners = (): void => {
  if (
    !(
      area.value &&
      content.value &&
      leftThumb.value &&
      rightThumb.value &&
      topThumb.value &&
      bottomThumb.value
    )
  ) {
    return
  }
  resizeObserver.observe(area.value)
  resizeObserver.observe(content.value)
  leftThumb.value.addEventListener('mousedown', startDragY)
  rightThumb.value.addEventListener('mousedown', startDragY)
  topThumb.value.addEventListener('mousedown', startDragX)
  bottomThumb.value.addEventListener('mousedown', startDragX)
  area.value.addEventListener('wheel', handelWheel)
  document.addEventListener('mousemove', doDrag)
  document.addEventListener('mouseup', stopDrag)
}

const removeDragListeners = (): void => {
  if (
    !(
      area.value &&
      content.value &&
      leftThumb.value &&
      rightThumb.value &&
      topThumb.value &&
      bottomThumb.value
    )
  ) {
    return
  }
  resizeObserver.unobserve(area.value)
  resizeObserver.unobserve(content.value)
  leftThumb.value.removeEventListener('mousedown', startDragY)
  rightThumb.value.removeEventListener('mousedown', startDragY)
  topThumb.value.removeEventListener('mousedown', startDragX)
  bottomThumb.value.removeEventListener('mousedown', startDragX)
  area.value.removeEventListener('wheel', handelWheel)
  document.removeEventListener('mousemove', doDrag)
  document.removeEventListener('mouseup', stopDrag)
}

onMounted(() => {
  nextTick(() => {
    initDragListeners()
    updateSizeData()
  })
})

onUnmounted(() => {
  removeDragListeners()
})
</script>

<template lang="html">
  <div ref="scroll-area" class="scroll-area">
    <div
      ref="content"
      class="scroll-area-content"
      :data-x-break="x === 'break'"
      :data-y-break="y === 'break'"
    >
      <slot></slot>
    </div>
    <div v-show="showLeftBar" class="scroll-area-left-bar">
      <div
        ref="left-thumb"
        class="scroll-area-left-bar-thumb"
        :style="{ height: `${yThumbSize}%`, width: `100% `, top: `${yThumbDistance}%` }"
      ></div>
    </div>
    <div v-show="showRightBar" class="scroll-area-right-bar">
      <div
        ref="right-thumb"
        class="scroll-area-right-bar-thumb"
        :style="{ height: `${yThumbSize}%`, width: `100% `, top: `${yThumbDistance}%` }"
      ></div>
    </div>
    <div v-show="showTopBar" class="scroll-area-top-bar">
      <div
        ref="top-thumb"
        class="scroll-area-top-bar-thumb"
        :style="{ height: `100%`, width: `${xThumbSize}% `, left: `${xThumbDistance}%` }"
      ></div>
    </div>
    <div v-show="showBottomBar" class="scroll-area-bottom-bar">
      <div
        ref="bottom-thumb"
        class="scroll-area-bottom-bar-thumb"
        :style="{ height: `100%`, width: `${xThumbSize}% `, left: `${xThumbDistance}%` }"
      ></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.scroll-area {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.scroll-area-content {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  &[data-x-break] {
    width: 100%;
  }
  &[data-y-break] {
    height: 100%;
  }
}

.scroll-area-left-bar {
  height: 100%;
  width: 1.2vmin;
  position: absolute;
  left: 0;
  background-color: rgba(0, 0, 0, 0);
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.scroll-area-left-bar-thumb {
  position: relative;
  background-color: rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
}

.scroll-area-right-bar {
  height: 100%;
  width: 1.2vmin;
  position: absolute;
  right: 0;
  background-color: rgba(0, 0, 0, 0);
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.scroll-area-right-bar-thumb {
  position: relative;
  background-color: rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
}

.scroll-area-top-bar {
  height: 1.2vmin;
  width: 100%;
  position: absolute;
  top: 0;
  background-color: rgba(0, 0, 0, 0);
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.scroll-area-top-bar-thumb {
  position: relative;
  background-color: rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
}

.scroll-area-bottom-bar {
  height: 1.2vmin;
  width: 100%;
  position: absolute;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.scroll-area-bottom-bar-thumb {
  position: relative;
  background-color: rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
}
</style>
