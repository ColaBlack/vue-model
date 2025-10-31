<!--
  用户抽屉组件
  用于新增或编辑用户的抽屉表单
  支持两种模式：新增模式和编辑模式
-->
<template>
  <a-drawer
    :width="500"
    :visible="visible"
    :unmount-on-close="true"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <!-- 抽屉标题 -->
    <template #title>
      {{ mode === 'add' ? '新增用户' : '编辑用户' }}
    </template>
    
    <!-- 表单内容 -->
    <div class="user-form">
      <a-form :model="formData" label-width="80">
        
        <!-- 用户账号 - 仅新增模式显示 -->
        <a-form-item
          v-if="mode === 'add'"
          label="用户账号"
          :rules="[{ required: true, message: '用户账号是必填项' }]"
        >
          <a-input v-model="formData.userAccount" />
          <template #extra>
            <div>账号由字母、数字，长度在4-20位之间，必须唯一</div>
          </template>
        </a-form-item>
        
        <!-- 用户昵称 -->
        <a-form-item label="用户昵称">
          <a-input v-model="formData.userName" />
          <template #extra>
            <div>昵称可为空，若为空则显示无昵称，可不唯一</div>
          </template>
        </a-form-item>
        
        <!-- 用户简介 - 仅编辑模式显示 -->
        <a-form-item v-if="mode === 'edit'" label="用户简介">
          <a-input v-model="formData.userProfile" />
          <template #extra>
            <div>用户简介可为空</div>
          </template>
        </a-form-item>
        
        <!-- 用户头像 -->
        <a-form-item label="用户头像">
          <a-input v-model="formData.userAvatar" />
          <template #extra>
            <div>可为空，若为空则使用默认头像</div>
          </template>
        </a-form-item>
        
        <!-- 用户角色 -->
        <a-form-item
          label="用户角色"
          :rules="mode === 'add' ? [{ required: true, message: '用户角色是必填项' }] : []"
        >
          <a-select 
            v-model="formData.userRole" 
            placeholder="请选择用户角色" 
            allow-clear
          >
            <a-option
              v-for="(value, key) of userStatusMap"
              :value="key"
              :key="key"
              :label="value"
            />
          </a-select>
        </a-form-item>
        
      </a-form>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { watch, reactive } from 'vue'

/**
 * Props 定义
 */
interface Props {
  /** 抽屉可见状态 */
  visible: boolean
  /** 模式：add-新增，edit-编辑 */
  mode: 'add' | 'edit'
  /** 表单初始数据 */
  initialData?: Partial<API.User>
  /** 用户状态映射表 */
  userStatusMap: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({})
})

/**
 * Emits 定义
 */
interface Emits {
  /** 更新可见状态 */
  (e: 'update:visible', visible: boolean): void
  /** 确认提交 */
  (e: 'submit', data: any): void
}

const emit = defineEmits<Emits>()

/**
 * 表单数据
 * 根据模式不同，包含不同的字段
 */
const formData = reactive<any>({
  id: undefined,
  userAccount: '',
  userName: '',
  userProfile: '',
  userAvatar: '',
  userRole: ''
})

/**
 * 监听初始数据变化，更新表单数据
 * 当打开抽屉并传入初始数据时，自动填充表单
 */
watch(() => props.initialData, (newData) => {
  if (newData) {
    Object.assign(formData, {
      id: newData.id,
      userAccount: newData.userAccount || '',
      userName: newData.userName || '',
      userProfile: newData.userProfile || '',
      userAvatar: newData.userAvatar || '',
      userRole: newData.userRole || ''
    })
  }
}, { immediate: true, deep: true })

/**
 * 处理确认提交
 * 将表单数据传递给父组件
 */
const handleOk = () => {
  emit('submit', { ...formData })
}

/**
 * 处理取消操作
 * 关闭抽屉并重置表单
 */
const handleCancel = () => {
  emit('update:visible', false)
  // 重置表单数据
  Object.assign(formData, {
    id: undefined,
    userAccount: '',
    userName: '',
    userProfile: '',
    userAvatar: '',
    userRole: ''
  })
}
</script>

<style scoped>
.user-form {
  padding: 10px 0;
}
</style>

