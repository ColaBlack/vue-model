export enum BIZ_ENUMS {
  /**
   * 用户头像上传
   */
  USER_AVATAR = 'user_avatar',

  /**
   * 题库图片上传
   */
  BANK_IMAGE = 'bank_image',

  /**
   * 评分结果图片上传
   */
  RESULT_IMAGE = 'result_image',
}

export const BIZ_TYPE = {
  [BIZ_ENUMS.USER_AVATAR]: '用户头像上传',
  [BIZ_ENUMS.BANK_IMAGE]: '题库图片上传',
  [BIZ_ENUMS.RESULT_IMAGE]: '评分结果图片上传'
}

export const BIZ_MAPPING = {
  'avatar': BIZ_ENUMS.USER_AVATAR,
  'bank': BIZ_ENUMS.BANK_IMAGE,
  'result': BIZ_ENUMS.RESULT_IMAGE
}
