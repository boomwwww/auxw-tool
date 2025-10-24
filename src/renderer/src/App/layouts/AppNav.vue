<script setup lang="ts">
defineOptions({ name: 'AppNav' })

const router = useRouter()
const route = useRoute()
const clientStore = useClientStore()

const onButtonClick = (label: string): void => {
  if (route.name !== label) {
    router.push(label)
    clientStore.isAsideDisplay = true
    return
  }
  clientStore.isAsideDisplay = !clientStore.isAsideDisplay
}
</script>

<template>
  <div class="app-nav">
    <button
      :data-selected="clientStore.isAsideDisplay && route.name === 'info'"
      class="info"
      title="信息总览"
      @click="onButtonClick('info')"
    >
      <img src="@resources/favicon.ico" draggable="false" />
    </button>
    <button
      :data-selected="clientStore.isAsideDisplay && route.name === 'temp1'"
      class="temp1"
      title="临时页面1"
      @click="onButtonClick('temp1')"
    >
      <h2>1</h2>
    </button>
    <button
      :data-selected="clientStore.isAsideDisplay && route.name === 'temp2'"
      class="temp2"
      title="临时页面2"
      @click="onButtonClick('temp2')"
    >
      <h2>2</h2>
    </button>

    <button
      :data-selected="clientStore.isAsideDisplay && route.name === 'files'"
      class="files"
      title="文件管理"
      @click="onButtonClick('files')"
    >
      <h2>files</h2>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.app-nav {
  width: 64px;

  @include grid-display;
  align-content: start;
  grid-template-columns: 1fr;
  grid-auto-rows: 64px;
  row-gap: 8px;

  & > button {
    @include button-shape;
    @include button-cursor;
    position: relative;

    background-color: transparent;
    &:hover {
      background-color: color-mix(in hsl, var(--color-offset-hover) 25%, var(--color-bg));
    }

    &.info {
      & img {
        height: 32px;
      }
    }

    &[data-selected='true'] {
      background-color: color-mix(in hsl, var(--color-offset-active) 25%, var(--color-bg));
      & h2 {
        color: var(--color-primary);
      }
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-left: solid var(--color-primary);
        border-left-width: 2.5px;
        pointer-events: none;
      }
    }

    & h2 {
      font-size: 24px;
      color: var(--color-text);
    }
  }
}
</style>
