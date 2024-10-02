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
import GlobalHeader from '@/layouts/components/globalHeader.vue'
import GlobalFooter from '@/layouts/components/globalFooter.vue'
</script>

<style scoped>
#global-layout .content {
  padding: 24px;
  background: linear-gradient(to bottom, #f8f8f8, #f5f5f5);
}
</style>
