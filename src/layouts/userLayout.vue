<template>
  <div id="user-layout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <a-space direction="vertical">
          <img src="../assets/logo.png" class="logo" alt="logo" />
          <p class="title">茶AI题库</p>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <global-footer />
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalFooter from '@/layouts/components/globalFooter.vue'
</script>
<style scoped>
#user-layout {
  background-image: url('@/assets/loginBackground.png');

}

#user-layout .logo {
  height: 64px;
  margin: 0 auto;
}

#user-layout .header {
  margin: 0 auto;
}

#user-layout .title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
}
</style>
