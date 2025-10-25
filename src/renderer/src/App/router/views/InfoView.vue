<script setup lang="ts">
defineOptions({ name: 'InfoView' })

const { invoke } = useBus()

const contentDisplay = reactive({
  a: true,
  b: true,
  c: true
})

const onTabClick = (tabName: string): void => {
  contentDisplay[tabName] = !contentDisplay[tabName]
}

const info = ref<object>({})

onMounted(() => {
  invoke('api:get-info', 'a').then((res) => {
    info.value = res as object
  })
})
</script>

<template>
  <div class="info-view">
    <div class="title">信息总览</div>
    <div class="tab" :data-display="contentDisplay.a" @click="onTabClick('a')">d</div>
    <div v-show="contentDisplay.a" class="content">{{ info }}</div>
    <div class="tab" :data-display="contentDisplay.b" @click="onTabClick('b')">x</div>
    <div v-show="contentDisplay.b" class="content">x</div>
    <div class="tab" :data-display="contentDisplay.c" @click="onTabClick('c')">x</div>
    <div v-show="contentDisplay.c" class="content">x</div>
  </div>
</template>

<style scoped lang="scss">
.info-view {
  @include col;
  & > div {
    width: 100%;
    @include with-top-border(1);
    @include with-bottom-border(1);
  }
  & > .title {
    white-space: nowrap;
    height: 48px;
    line-height: 48px;
    padding-left: 24px;
    font-size: 24px;
    font-weight: bold;
  }
  & > .tab {
    height: 32px;
    line-height: 32px;
    padding-left: 10px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;

    &::before {
      content: '>';
      margin-right: 10px;
    }
    &[data-display='true'] {
      &::before {
        content: 'v';
      }
    }
  }
  & > .content {
    @include col;
    & > div {
      @include with-bottom-border(1);
    }
  }
}
</style>
