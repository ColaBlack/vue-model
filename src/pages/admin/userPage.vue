<!--
  用户管理页面
  提供用户的增删改查功能
  包含搜索、列表展示、新增和编辑功能
-->
<template>
  <div id="userPage">
    <!-- 搜索和操作栏 -->
    <UserSearch
      @search="handleSearch"
      @add-user="handleAddUserClick"
    />
    
    <!-- 用户列表表格 -->
    <UserTable
      :data="data"
      :loading="loading"
      :pagination="{
        current: searchParams.current,
        pageSize: searchParams.pageSize,
        total: total
      }"
      :user-role-map="USER_ROLE"
      @page-change="handlePageChange"
      @edit="handleEditUserClick"
      @delete="handleDeleteUser"
    />
    
    <!-- 新增用户抽屉 -->
    <UserDrawer
      v-model:visible="addUserVisible"
      mode="add"
      :user-status-map="USER_STATUS"
      @submit="handleAddUserSubmit"
    />
    
    <!-- 编辑用户抽屉 -->
    <UserDrawer
      v-model:visible="editUserVisible"
      mode="edit"
      :initial-data="editUserData"
      :user-status-map="USER_STATUS"
      @submit="handleEditUserSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import {
  addUser,
  deleteUser,
  listUserByPage,
  updateUser
} from '@/api/userController'
import { Message, Modal } from '@arco-design/web-vue'
import { USER_ROLE } from '@/access/roleEnums'
import { USER_STATUS } from '@/enums/userEnums'
import UserSearch from './components/UserSearch.vue'
import UserTable from './components/UserTable.vue'
import UserDrawer from './components/UserDrawer.vue'

// ==================== 数据状态 ====================

/** 加载状态 */
const loading = ref(false)

/** 搜索参数 */
const searchParams = ref<API.UserQueryRequest>({
  current: 1,
  pageSize: 10
})

/** 用户列表数据 */
const data = ref<API.User[]>([])

/** 数据总数 */
const total = ref<number>(0)

// ==================== 新增用户相关 ====================

/** 新增用户抽屉可见状态 */
const addUserVisible = ref(false)

// ==================== 编辑用户相关 ====================

/** 编辑用户抽屉可见状态 */
const editUserVisible = ref(false)

/** 当前编辑的用户数据 */
const editUserData = ref<Partial<API.User>>({})

// ==================== 数据加载 ====================

/**
 * 加载用户列表数据
 * 根据搜索参数从后端获取用户数据
 */
const loadData = async () => {
  loading.value = true
  try {
    const res = await listUserByPage(searchParams.value)
    if (res.data.code === 200) {
      data.value = res.data.data?.records || []
      total.value = res.data.data?.total || 0
    } else {
      Message.error(res.data.message || '数据加载失败')
    }
  } catch (error) {
    Message.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

/**
 * 监听搜索条件变化，自动重新加载数据
 */
watchEffect(() => {
  loadData()
})

// ==================== 事件处理 ====================

/**
 * 处理搜索
 * @param value - 搜索关键词（用户名）
 */
const handleSearch = (value: string) => {
  searchParams.value = { 
    ...searchParams.value, 
    userName: value,
    current: 1 // 搜索时重置到第一页
  }
}

/**
 * 处理页码变化
 * @param page - 新的页码
 */
const handlePageChange = (page: number) => {
  searchParams.value = { ...searchParams.value, current: page }
}

/**
 * 处理点击新增用户按钮
 * 打开新增用户抽屉
 */
const handleAddUserClick = () => {
  addUserVisible.value = true
}

/**
 * 处理新增用户提交
 * @param formData - 新增用户表单数据
 */
const handleAddUserSubmit = async (formData: API.UserAddRequest) => {
  try {
    const res = await addUser(formData)
    if (res.data.code === 200) {
      Message.success('新增用户成功')
      await loadData()
      addUserVisible.value = false
    } else {
      Message.error('新增用户失败: ' + res.data.message)
    }
  } catch (error) {
    Message.error('新增用户失败')
  }
}

/**
 * 处理点击编辑用户按钮
 * 打开编辑用户抽屉并填充数据
 * @param record - 用户数据
 */
const handleEditUserClick = (record: API.User) => {
  editUserData.value = {
    id: record.id,
    userAvatar: record.userAvatar,
    userName: record.userName,
    userProfile: record.userProfile,
    userRole: record.userRole
  }
  editUserVisible.value = true
}

/**
 * 处理编辑用户提交
 * @param formData - 编辑用户表单数据
 */
const handleEditUserSubmit = async (formData: API.UserUpdateRequest) => {
  try {
    const res = await updateUser(formData)
    if (res.data.code === 200) {
      Message.success('修改用户成功')
      await loadData()
      editUserVisible.value = false
    } else {
      Message.error('修改用户失败: ' + res.data.message)
    }
  } catch (error) {
    Message.error('修改用户失败')
  }
}

/**
 * 处理删除用户
 * 显示确认对话框，确认后调用删除接口
 * @param record - 用户数据
 */
const handleDeleteUser = (record: API.User) => {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除该用户吗？这将无法恢复。',
    onOk: async () => {
      try {
        const res = await deleteUser({ id: record.id })
        if (res.data.code === 200) {
          Message.success('删除成功')
          await loadData()
        } else {
          Message.error(res.data.message || '删除失败')
        }
      } catch (error) {
        Message.error('删除失败')
      }
    },
    onCancel: () => {
      Message.info('取消删除')
    }
  })
}
</script>

<style scoped>
/* 用户管理页面容器 */
#userPage {
  padding: 20px;
}
</style>
