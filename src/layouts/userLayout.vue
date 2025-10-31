<template>
  <a-layout class="user-layout">
    <a-layout-header class="header">
      <div class="logo">
        <img src="@/assets/logo.png" alt="logo" />
      </div>
      <div class="title">Water AI</div>
    </a-layout-header>
    <a-layout-content class="content">
      <router-view v-slot="{ Component }">
        <component :is="Component" style="height: 100%;" />
      </router-view>
    </a-layout-content>
    <a-layout-footer class="footer">
      <GlobalFooter />
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts" setup>
import GlobalFooter from '@/layouts/globalFooter.vue';
import {
  Layout as ALayout,
  LayoutHeader as ALayoutHeader,
  LayoutContent as ALayoutContent,
  LayoutFooter as ALayoutFooter,
} from '@arco-design/web-vue';
</script>

<style lang="less" scoped>
.user-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: auto;
  background-image: url('../../assets/loginBackground.png');
  background-size: 100% 100%;
}

.header {
  height: 64px;
  line-height: 64px;
  text-align: center;
}

.logo {
  display: inline-block;
  vertical-align: middle;
  height: 32px;
  width: 32px;
  margin-right: 10px;
}

.logo img {
  height: 100%;
}

.title {
  display: inline-block;
  vertical-align: middle;
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.content {
  flex: 1;
  /* Removed padding: 20px; */
}

.footer {
  padding: 20px;
  text-align: center;
}
</style>
