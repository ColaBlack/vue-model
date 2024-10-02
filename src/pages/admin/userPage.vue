<!--suppress VueUnrecognizedSlot -->
<template>
  <div id="userPage">
    <a-input-search class="search-input" placeholder="按名称搜索" search-button @search="handleSearch" allow-clear>
      <template #button-icon>
        <icon-search />
      </template>
      <template #button-default>
        搜索
      </template>
    </a-input-search>
    <a-button type="primary" @click="addUserClick" style="margin-bottom: 10px; margin-left: 20px;">
      <template #icon>
        <icon-plus />
      </template>
      <template #default>新增用户</template>
    </a-button>
    <a-table
      :columns="columns"
      :data="data"
      :bordered="true"
      :hoverable="true"
      :stripe="true"
      :loading="form.loading"
      :show-header="true"
      :pagination="{
        showTotal:true,
        pageSize:searchParams.pageSize,
        current:searchParams.current,
        total:total
      }"
      @page-change="handlePageChange"
    >
      <template #userAvatar="{ record }">
        <a-image width="64" :src="record.userAvatar" />
      </template>
      <template #createTime="{ record }">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template #updateTime="{ record }">
        {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template #action="{ record }">
        <a-button type="outline" @click="editUserClick(record)">编辑</a-button>
        <a-popconfirm content="你确定要删除该用户吗？" @ok="handleDelete(record)">
          <a-button type="primary" style="margin-left: 10px;">
            <template #icon>
              <icon-delete />
            </template>
            <template #default>Delete</template>
          </a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <div id="addUser">
      <a-drawer :width="500" :visible="addUserVisible" @ok="addUserOk" @cancel="addUserCancel" unmountOnClose>
        <template #title>
          新增用户
        </template>
        <div class="add-user-form">
          <a-form :model="addUserForm" label-width="80">
            <a-form-item label="用户账号">
              <a-input v-model="addUserForm.userAccount" />
              <template #extra>
                <div>账号由字母、数字，长度在4-20位之间，必须唯一</div>
              </template>
            </a-form-item>
            <a-form-item label="用户昵称">
              <a-input v-model="addUserForm.userName" />
              <template #extra>
                <div>昵称可为空，若为空则显示无昵称，可不唯一</div>
              </template>
            </a-form-item>
            <a-form-item label="用户头像">
              <a-input v-model="addUserForm.userAvatar" />
              <template #extra>
                <div>可为空，若为空则使用默认头像</div>
              </template>
            </a-form-item>
            <a-form-item label="用户角色">
              <a-input v-model="addUserForm.userRole" />
              <template #extra>
                <div>"admin"：超级管理员，"user"：普通用户,"ban"：封禁用户，三选一，默认为"user"</div>
              </template>
            </a-form-item>

          </a-form>
        </div>
      </a-drawer>
    </div>
    <div id="editUser">
      <a-drawer :width="500" :visible="editUserVisible" @ok="editUserOk" @cancel="editUserCancel" unmountOnClose>
        <template #title>
          编辑用户
        </template>
        <div class="add-user-form">
          <a-form :model="editUserForm" label-width="80">
            <a-form-item label="用户昵称">
              <a-input v-model="editUserForm.userName" />
              <template #extra>
                <div>昵称可为空，若为空则显示无昵称，可不唯一</div>
              </template>
            </a-form-item>
            <a-form-item label="用户简介">
              <a-input v-model="editUserForm.userProfile" />
              <template #extra>
                <div>用户简介可为空</div>
              </template>
            </a-form-item>
            <a-form-item label="用户头像">
              <a-input v-model="editUserForm.userAvatar" />
              <template #extra>
                <div>可为空，若为空则使用默认头像</div>
              </template>
            </a-form-item>
            <a-form-item label="用户角色">
              <a-input v-model="editUserForm.userRole" />
              <template #extra>
                <div>"admin"：超级管理员，"user"：普通用户,"ban"：封禁用户，三选一，默认为"user"</div>
              </template>
            </a-form-item>

          </a-form>
        </div>
      </a-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watchEffect } from 'vue'
import {
  addUserUsingPost,
  deleteUserUsingPost,
  listUserByPageUsingPost,
  updateUserUsingPost
} from '@/api/userController'
import { Message, Modal } from '@arco-design/web-vue'
import { dayjs } from '@arco-design/web-vue/es/_utils/date'
import { IconDelete } from '@arco-design/web-vue/es/icon'

const form = reactive({
  border: true,
  borderCell: false,
  hover: true,
  stripe: false,
  checkbox: true,
  loading: false,
  tableHeader: true,
  noData: false
})

const columns = [
  { title: '用户ID', dataIndex: 'id' },
  { title: '用户账号', dataIndex: 'userAccount' },
  { title: '用户昵称', dataIndex: 'userName' },
  { title: '用户头像', dataIndex: 'userAvatar', slotName: 'userAvatar' },
  { title: '用户简介', dataIndex: 'userProfile' },
  { title: '用户角色', dataIndex: 'userRole' },
  { title: '创建时间', dataIndex: 'createTime', slotName: 'createTime' },
  { title: '更新时间', dataIndex: 'updateTime', slotName: 'updateTime' },
  { title: '用户操作', dataIndex: 'action', slotName: 'action' }
]

const searchParams = ref<API.UserQueryRequest>({
  current: 1,
  pageSize: 10
})

const data = ref<API.User[]>([])
const total = ref<number>(0)

const loadData = async () => {
  const res = await listUserByPageUsingPost(searchParams.value)
  if (res.data.code === 200) {
    data.value = res.data.data?.records || []
    total.value = res.data.data?.total || 0
  } else {
    Message.error(res.data.message || '数据加载失败')
  }
}

// 监听搜索条件变化，重新加载数据
watchEffect(() => {
  loadData()
})

const handlePageChange = (page: number) => {
  searchParams.value = { ...searchParams.value, current: page }
}

const editUserVisible = ref(false)

const editUserClick = (record: API.User) => {
  editUserForm.id = record.id
  editUserForm.userAvatar = record.userAvatar
  editUserForm.userName = record.userName
  editUserForm.userProfile = record.userProfile
  editUserForm.userRole = record.userRole
  editUserVisible.value = true
}
const editUserOk = async () => {
  const res = await updateUserUsingPost(editUserForm)
  if (res.data.code === 200) {
    Message.success('修改用户成功')
    await loadData()
    editUserVisible.value = false
  } else {
    Message.error('修改用户失败:' + res.data.message)
  }
}
const editUserCancel = () => {
  editUserVisible.value = false
}

let editUserForm: API.UserUpdateRequest = reactive({
  id: -1,
  userAvatar: '',
  userName: '',
  userProfile: '',
  userRole: ''
})


const addUserVisible = ref(false)

const addUserClick = () => {
  addUserVisible.value = true
}
const addUserOk = async () => {
  const res = await addUserUsingPost(addUserForm)
  if (res.data.code === 200) {
    Message.success('新增用户成功')
    await loadData()
    addUserVisible.value = false
  } else {
    Message.error('新增用户失败:' + res.data.message)
  }
}
const addUserCancel = () => {
  addUserVisible.value = false
}

const addUserForm: API.UserAddRequest = reactive({
  userAccount: '',
  userName: '',
  userAvatar: '',
  userRole: ''
})

const handleDelete = async (record: API.User) => {
  // 在删除之前显示确认框
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除该用户吗？这将无法恢复。',
    onOk: async () => {
      const res = await deleteUserUsingPost({ id: record.id })
      if (res.data.code === 200) {
        Message.success('删除成功')
        await loadData()
      } else {
        Message.error(res.data.message || '删除失败')
      }
    },
    onCancel: () => {
      Message.info('取消删除')
    }
  })
}

const handleSearch = (value: string) => {
  searchParams.value = { ...searchParams.value, userName: value }
}

</script>

<style scoped>
#userPage .search-input {
  width: 320px;
  margin-bottom: 10px;
}
</style>