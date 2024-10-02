<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <UserLayout />
    </template>
    <template v-else>
      <GlobalLayout />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import UserLayout from '@/layouts/userLayout.vue'
import GlobalLayout from '@/layouts/globalLayout.vue'
import { useUserStore } from '@/store/user'

const route = useRoute()

const userStore = useUserStore()

if (!userStore.loginUser || !userStore.loginUser.userRole) {
  userStore.fetchLoginUser()
}
</script>

<style scoped></style>
