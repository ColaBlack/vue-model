import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { ref } from 'vue'
import type { AxiosResponse } from 'axios'
import roleEnums from '@/access/roleEnums'
import { getLoginUser } from '@/api/userController'

export const useUserStore = defineStore('USER_LOGIN_STATE', () => {
  const loginUser: Ref<API.LoginUserVO> = ref({ userName: '未登录' })

  async function fetchLoginUser() {
    const res: AxiosResponse<API.BaseResponseLoginUserVO> = await getLoginUser()
    if (res.data.code === 200 && res.data.data) {
      loginUser.value = res.data.data
    } else {
      loginUser.value = { userName: '未登录', userRole: roleEnums.PUBLIC }
    }
  }

  function setLoginUser(newUser: API.LoginUserVO) {
    loginUser.value = newUser
  }

  return {
    loginUser,
    fetchLoginUser,
    setLoginUser
  }
})
