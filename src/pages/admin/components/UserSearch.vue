<!--
  用户搜索和操作栏组件
  提供用户名搜索功能和新增用户按钮
-->
<template>
  <div class="user-search">
    <!-- 搜索输入框 -->
    <a-input-search
      class="search-input"
      placeholder="按名称搜索"
      search-button
      allow-clear
      @search="handleSearch"
    >
      <template #button-icon>
        <icon-search />
      </template>
      <template #button-default>搜索</template>
    </a-input-search>
    
    <!-- 新增用户按钮 -->
    <a-button 
      type="primary" 
      class="add-btn"
      @click="handleAddUser"
    >
      <template #icon>
        <icon-plus />
      </template>
      <template #default>新增用户</template>
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { IconSearch, IconPlus } from '@arco-design/web-vue/es/icon'

/**
 * Emits 定义
 */
interface Emits {
  /** 搜索事件 */
  (e: 'search', value: string): void
  /** 新增用户事件 */
  (e: 'add-user'): void
}

const emit = defineEmits<Emits>()

/**
 * 处理搜索操作
 * @param value - 搜索关键词
 */
const handleSearch = (value: string) => {
  emit('search', value)
}

/**
 * 处理新增用户操作
 * 触发父组件的新增用户事件
 */
const handleAddUser = () => {
  emit('add-user')
}
</script>

<style scoped>
.user-search {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  align-items: center;
}

.search-input {
  width: 320px;
}

.add-btn {
  flex-shrink: 0;
}
</style>

