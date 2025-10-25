<script setup lang="ts">
defineOptions({ name: 'FigureDisplay' })

const props = defineProps<{ l2dPath: string }>()

import type { Application } from 'pixi.js'
import type { Live2DModel } from 'pixi-live2d-display'

const clientStore = useClientStore()

let pixiApp: Application
let l2dModel: Live2DModel

const canvas = useTemplateRef('canvas')

const loadLive2D = async (): Promise<void> => {
  if (!clientStore.isLive2dReady || !canvas.value) {
    return
  }
  if (!canvas.value) {
    return
  }
  const { Application } = window.PIXI
  const { Live2DModel } = window.PixiLive2dDisplay
  pixiApp = new Application({
    width: 600,
    height: 600,
    view: canvas.value,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
    backgroundAlpha: 0
  })
  l2dModel = await Live2DModel.from(props.l2dPath, {
    autoInteract: false
  })

  pixiApp.stage.addChild(l2dModel)
  l2dModel.scale.set(0.2)
}

const setModelMotion = (motion: string): void => {
  l2dModel.motion(motion)
}

const setModelExpression = (expression: string): void => {
  l2dModel.expression(expression)
}

const setModelParam = (paramId: string, paramVal: number): void => {
  console.log('setModelParam', paramId, paramVal)
  ;(l2dModel.internalModel.coreModel as ICoreModel).setParamFloat(paramId, paramVal)
}

defineExpose({ setModelMotion, setModelExpression, setModelParam })

watch(
  () => clientStore.isLive2dReady,
  (isReady) => {
    if (isReady) {
      loadLive2D()
    }
  }
)

onMounted(() => {
  loadLive2D()
})

onUnmounted(() => {
  l2dModel.destroy()
  pixiApp.destroy()
})
</script>

<template>
  <figure class="figure-display">
    <canvas ref="canvas" class="figure-display-canvas"></canvas>
  </figure>
</template>

<style scoped lang="scss">
.figure-display {
  height: 100%;
  width: 100%;
}
</style>
