# 用户个人信息管理 - 后端接口文档

## 概述

本文档定义了用户个人信息管理功能所需的后端接口。这些接口允许普通用户查看和修改自己的个人信息。

---

## 1. 更新个人信息

### 接口说明

允许用户更新自己的个人信息（用户名、简介、头像）

### 请求信息

- **接口路径**: `/api/user/update/profile`
- **请求方法**: `POST`
- **Content-Type**: `application/json`
- **需要登录**: 是

### 请求参数

```typescript
{
  userName?: string;      // 用户名，长度1-20字符
  userProfile?: string;   // 个人简介，长度0-200字符
  userAvatar?: string;    // 头像URL
}
```

### 请求示例

```json
{
  "userName": "张三",
  "userProfile": "热爱水产品研究的技术爱好者",
  "userAvatar": "https://example.com/avatar/123.jpg"
}
```

### 响应参数

```typescript
{
  code: number // 状态码，200表示成功
  data: boolean // 操作结果，true表示成功
  message: string // 提示信息
}
```

### 响应示例

```json
{
  "code": 200,
  "data": true,
  "message": "更新成功"
}
```

### 业务规则

1. 只能修改自己的个人信息
2. 用户名不能为空，长度1-20字符
3. 个人简介长度不超过200字符
4. 不能修改账号（userAccount）
5. 不能修改用户角色（userRole）

---

## 2. 修改密码

### 接口说明

允许用户修改自己的登录密码

### 请求信息

- **接口路径**: `/api/user/update/password`
- **请求方法**: `POST`
- **Content-Type**: `application/json`
- **需要登录**: 是

### 请求参数

```typescript
{
  oldPassword: string // 当前密码（必填）
  newPassword: string // 新密码，长度6-20字符（必填）
}
```

### 请求示例

```json
{
  "oldPassword": "oldPass123",
  "newPassword": "newPass456"
}
```

### 响应参数

```typescript
{
  code: number // 状态码，200表示成功
  data: boolean // 操作结果，true表示成功
  message: string // 提示信息
}
```

### 响应示例

```json
{
  "code": 200,
  "data": true,
  "message": "密码修改成功"
}
```

### 业务规则

1. 必须验证当前密码是否正确
2. 新密码长度6-20字符
3. 新密码必须包含字母和数字，不能是纯数字或纯字母
4. 新密码不能与旧密码相同
5. 修改密码后不需要重新登录（可选：根据业务需求决定是否清除session）

---

## 3. 上传头像

### 接口说明

允许用户上传并更新自己的头像图片

### 请求信息

- **接口路径**: `/api/user/upload/avatar`
- **请求方法**: `POST`
- **Content-Type**: `multipart/form-data`
- **需要登录**: 是

### 请求参数

```
file: File  // 图片文件，字段名为 "file"
```

### 文件要求

- 支持的格式：JPG, JPEG, PNG, GIF
- 文件大小：不超过 2MB
- 推荐尺寸：200x200 像素以上

### 响应参数

```typescript
{
  code: number // 状态码，200表示成功
  data: string // 上传后的图片URL
  message: string // 提示信息
}
```

### 响应示例

```json
{
  "code": 200,
  "data": "https://example.com/avatars/user_123_1234567890.jpg",
  "message": "上传成功"
}
```

### 业务规则

1. 验证文件格式
2. 验证文件大小
3. 图片需要压缩处理（推荐保存为200x200的缩略图）
4. 文件名使用UUID或时间戳命名，避免冲突
5. 存储到CDN或对象存储服务
6. 自动更新用户的 userAvatar 字段
7. 可选：删除用户之前的头像文件（如果不是默认头像）

---

## 4. 获取当前用户信息（已存在）

### 接口说明

获取当前登录用户的详细信息（此接口已存在，无需修改）

### 请求信息

- **接口路径**: `/api/user/get/login`
- **请求方法**: `GET`
- **需要登录**: 是

### 响应参数

```typescript
{
  code: number
  data: {
    id: number
    userName: string
    userAvatar: string
    userProfile: string
    userRole: string
    createTime: string
    updateTime: string
  }
  message: string
}
```

### 说明

前端会从这个接口获取用户信息并在用户进入个人中心时显示。需要确保返回的数据包含 `userProfile` 字段。

---

## 错误码规范

| 错误码 | 说明         | 示例场景               |
| ------ | ------------ | ---------------------- |
| 200    | 成功         | 操作成功               |
| 40000  | 请求参数错误 | 必填字段缺失、格式错误 |
| 40001  | 未登录       | 用户未登录或登录已过期 |
| 40003  | 权限不足     | 尝试修改他人信息       |
| 40004  | 操作失败     | 当前密码错误           |
| 50000  | 系统内部错误 | 服务器异常             |

---

## 安全建议

### 1. 身份验证

- 所有接口都必须验证用户登录状态
- 验证操作用户的身份，确保只能修改自己的信息

### 2. 参数验证

- 后端必须对所有输入参数进行严格验证
- 防止SQL注入、XSS攻击
- 验证字段长度和格式

### 3. 密码安全

- 密码必须使用加密算法（如BCrypt）存储
- 修改密码时需要验证旧密码
- 考虑添加密码复杂度要求

### 4. 文件上传安全

- 严格验证文件类型（检查文件头，不只是扩展名）
- 限制文件大小
- 文件存储路径不要暴露在响应中
- 使用独立的存储服务（OSS、CDN）

### 5. 频率限制

- 建议对接口添加频率限制
- 特别是密码修改和文件上传接口
- 防止暴力破解和恶意上传

---

## 数据库设计建议

如果需要在 `User` 表中添加 `userProfile` 字段：

```sql
ALTER TABLE user ADD COLUMN user_profile VARCHAR(200) COMMENT '个人简介' AFTER user_avatar;
```

---

## 测试用例建议

### 更新个人信息

- ✅ 正常更新用户名和简介
- ✅ 用户名为空
- ✅ 用户名超长（>20字符）
- ✅ 简介超长（>200字符）
- ✅ 未登录状态访问

### 修改密码

- ✅ 正常修改密码
- ✅ 当前密码错误
- ✅ 新密码格式不符合要求
- ✅ 新旧密码相同
- ✅ 未登录状态访问

### 上传头像

- ✅ 上传有效的图片文件
- ✅ 上传非图片文件
- ✅ 上传超大文件（>2MB）
- ✅ 上传非法文件类型
- ✅ 未登录状态访问

---

## 前端调用示例

### 更新个人信息

```typescript
// 在 src/api/userController.ts 中添加
export async function updateUserProfile(
  body: { userName?: string; userProfile?: string; userAvatar?: string },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/user/update/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
```

### 修改密码

```typescript
// 在 src/api/userController.ts 中添加
export async function updatePassword(
  body: { oldPassword: string; newPassword: string },
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean>('/user/update/password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: body,
    ...(options || {})
  })
}
```

---

## 实现优先级

建议按以下顺序实现：

1. **高优先级**

   - 更新个人信息接口（最常用）
   - 获取用户信息接口（确保包含所需字段）

2. **中优先级**

   - 修改密码接口

3. **低优先级**
   - 上传头像接口（可以先使用外部图片URL）

---

## 联系方式

如有接口设计问题，请及时沟通调整。
