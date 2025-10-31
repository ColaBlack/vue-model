<template>
  <div id="global-layout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <GlobalFooter />
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/layouts/globalHeader.vue'
import GlobalFooter from '@/layouts/globalFooter.vue'
</script>

<style scoped lang="less">
#global-layout {
  .header {
    padding: 0;
    height: 64px;
    line-height: 64px;
  }

  .content {
    padding: 0;
    background: #f7f8fa;
  }

  .footer {
    padding: 0;
  }
}
</style>
