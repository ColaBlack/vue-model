import roleEnums from '@/access/roleEnums'

const checkAccess = (loginUser: API.LoginUserVO, neededRole = roleEnums.PUBLIC) => {
  const userRole = loginUser?.userRole ?? roleEnums.PUBLIC

  // 如果需要的角色是普通用户而用户角色是公共用户，则返回 false（即用户没有登录）
  if (neededRole === roleEnums.USER && userRole === roleEnums.PUBLIC) {
    return false
  }
  // 如果需要的角色是管理员而用户角色不是管理员，则返回 false（即用户没有权限）
  if (neededRole === roleEnums.ADMIN && userRole !== roleEnums.ADMIN) {
    return false
  }
  // 其余情况返回 true（即用户有权限）
  return true
}

export default checkAccess
