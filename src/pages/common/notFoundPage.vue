<template>
  <a-result status="404" subtitle="Whoops, that page is gone.">
    <template #extra>
      <a-space>
        <a-button type="primary" @click="router.push('/')">返回首页</a-button>
        <a-button type="secondary" @click="router.go(-1)">返回上一页</a-button>
      </a-space>
    </template>
  </a-result>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>

</style>