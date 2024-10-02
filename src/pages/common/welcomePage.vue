<template>
  <div id="home-page">
    <h1>Welcome to my website!</h1>
    <p>
      This is the home page of my website. You can find my latest projects, blog posts, and other
      information here.
    </p>
    {{ useUserStore().loginUser }}
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'
</script>

<style scoped></style>
