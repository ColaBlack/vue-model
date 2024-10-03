/**
 * 用户角色枚举
 */
const ROLE_ENUM = {
  PUBLIC: 'public',
  USER: 'user',
  ADMIN: 'admin',
  BANNER: 'ban'
}

export default ROLE_ENUM


export const USER_ROLE = {
  [ROLE_ENUM.PUBLIC]: '未登录',
  [ROLE_ENUM.USER]: '普通用户',
  [ROLE_ENUM.ADMIN]: '管理员',
  [ROLE_ENUM.BANNER]: '封禁用户'
}