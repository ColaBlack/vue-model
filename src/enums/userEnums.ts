export enum USER_ENUMS {
  //管理员
  ADMIN = 'admin',
  //普通用户
  USER = 'user',
  //封禁用户
  BANNED = 'banned'
}

export const USER_STATUS = {
  [USER_ENUMS.ADMIN]: '管理员',
  [USER_ENUMS.USER]: '普通用户',
  [USER_ENUMS.BANNED]: '封禁用户'
}
