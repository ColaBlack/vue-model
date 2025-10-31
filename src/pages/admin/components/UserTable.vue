<!--
  用户列表表格组件
  显示用户数据列表，支持分页、编辑和删除操作
-->
<template>
  <a-table
    :columns="columns"
    :data="data"
    :bordered="true"
    :hoverable="true"
    :stripe="true"
    :loading="loading"
    :show-header="true"
    :pagination="{
      showTotal: true,
      pageSize: pagination.pageSize,
      current: pagination.current,
      total: pagination.total
    }"
    @page-change="handlePageChange"
  >
    <!-- 用户角色列 - 自定义渲染 -->
    <template #userRole="{ record }">
      {{ userRoleMap[record.userRole] || '未知用户类型' }}
    </template>
    
    <!-- 用户头像列 - 自定义渲染 -->
    <template #userAvatar="{ record }">
      <a-image width="64" :src="record.userAvatar" />
    </template>
    
    <!-- 创建时间列 - 格式化显示 -->
    <template #createTime="{ record }">
      {{ formatDateTime(record.createTime) }}
    </template>
    
    <!-- 更新时间列 - 格式化显示 -->
    <template #updateTime="{ record }">
      {{ formatDateTime(record.updateTime) }}
    </template>
    
    <!-- 操作列 - 编辑和删除按钮 -->
    <template #action="{ record }">
      <a-button type="outline" @click="handleEdit(record)">
        编辑
      </a-button>
      
      <a-popconfirm 
        content="你确定要删除该用户吗？" 
        @ok="handleDelete(record)"
      >
        <a-button 
          status="danger" 
          type="primary" 
          style="margin-left: 10px"
        >
          <template #icon>
            <icon-delete />
          </template>
          <template #default>Delete</template>
        </a-button>
      </a-popconfirm>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { dayjs } from '@arco-design/web-vue/es/_utils/date'
import { IconDelete } from '@arco-design/web-vue/es/icon'

/**
 * Props 定义
 */
interface Props {
  /** 表格数据 */
  data: API.User[]
  /** 加载状态 */
  loading: boolean
  /** 分页配置 */
  pagination: {
    current: number
    pageSize: number
    total: number
  }
  /** 用户角色映射表 */
  userRoleMap: Record<string, string>
}

defineProps<Props>()

/**
 * Emits 定义
 */
interface Emits {
  /** 页码变化事件 */
  (e: 'page-change', page: number): void
  /** 编辑用户事件 */
  (e: 'edit', record: API.User): void
  /** 删除用户事件 */
  (e: 'delete', record: API.User): void
}

const emit = defineEmits<Emits>()

/**
 * 表格列配置
 * 定义表格的列结构和显示规则
 */
const columns = [
  { title: '用户ID', dataIndex: 'id' },
  { title: '用户账号', dataIndex: 'userAccount' },
  { title: '用户昵称', dataIndex: 'userName' },
  { title: '用户头像', dataIndex: 'userAvatar', slotName: 'userAvatar' },
  { title: '用户简介', dataIndex: 'userProfile' },
  { title: '用户角色', dataIndex: 'userRole', slotName: 'userRole' },
  { title: '创建时间', dataIndex: 'createTime', slotName: 'createTime' },
  { title: '更新时间', dataIndex: 'updateTime', slotName: 'updateTime' },
  { title: '用户操作', dataIndex: 'action', slotName: 'action' }
]

/**
 * 格式化日期时间
 * @param timeStr - 时间字符串
 * @returns 格式化后的日期时间字符串 (YYYY-MM-DD HH:mm:ss)
 */
const formatDateTime = (timeStr: string) => {
  return dayjs(timeStr).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 处理页码变化
 * @param page - 新的页码
 */
const handlePageChange = (page: number) => {
  emit('page-change', page)
}

/**
 * 处理编辑用户
 * @param record - 用户数据
 */
const handleEdit = (record: API.User) => {
  emit('edit', record)
}

/**
 * 处理删除用户
 * @param record - 用户数据
 */
const handleDelete = (record: API.User) => {
  emit('delete', record)
}
</script>

<style scoped>
/* 表格样式继承自 Arco Design 默认样式 */
</style>

