<script setup lang="ts">
defineOptions({ name: 'AppMain' })

// todo: 用于编辑文件的标签页
const l2dPath = import.meta.env.VITE_L2D_PATH
</script>

<template>
  <div class="app-main">
    <ScrollArea>
      <FigureDisplay :l2d-path="l2dPath" />
    </ScrollArea>
  </div>
</template>

<style lang="scss" scoped>
.app-main {
  height: 100%;
  width: 100%;
  background-color: color-mix(in hsl, var(--color-offset-active) 5%, var(--color-bg));
}
</style>
