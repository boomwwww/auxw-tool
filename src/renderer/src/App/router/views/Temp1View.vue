<script setup lang="ts">
defineOptions({ name: 'Temp1View' })

const x = ref(0)

const click = (): void => {
  x.value++
}
</script>
<template>
  <div @click="click">Temp1View {{ x }}</div>
</template>
