<template>
  <div id="no-auth-page">
    <a-result
      status="403"
      subtitle="对不起，您没有权限访问此页面"
    >
      <template #extra>
        <a-space>
          <a-button type="primary" @click="router.go(-1)">返回</a-button>
        </a-space>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
</style>