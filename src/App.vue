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

const route = useRoute()

</script>

<style scoped></style>
