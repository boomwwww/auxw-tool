<script setup lang="ts">
defineOptions({ name: 'AppFooter' })
</script>

<template>
  <div class="app-footer">app-footer底部栏</div>
</template>

<style lang="scss" scoped>
.app-footer {
  height: 100%;
  width: 100%;

  font-size: 16px;
  line-height: 32px;
  color: var(--color-info);

  @include grid-display;
  grid-template:
    'a  b' 1fr/
    200px 1fr;
}
</style>
