# VueModel

## 介绍

vue前端项目模版（自用）

## 软件架构

- 前端Vue项目模版，
- 使用Vite构建项目
- 使用Pinia进行全局用户登录态管理
- 使用axios进行全局请求调用
- 使用openapi根据文档快速生成请求函数
- 使用Vue Router进行全局路由管理
- 使用arco design制作基础布局页面和登录注册页面

## 安装教程

1.克隆或下载本仓库

2.使用

```bash
pnpm install
```

或其他node包管理器安装项目依赖

3.修改/src/config/request.ts中的请求地址

```typescript
const request = axios.create({
  baseURL: 'http://localhost:1221',//修改为自己的请求地址
  timeout: 10000,
  withCredentials: true
})
```

4.修改/src/config/openapi.config.js中的后端接口文档地址

```javascript
generateService({
  requestLibPath: 'import request from \'@/config/request\'',
  schemaPath: 'http://localhost:1221/api/v2/api-docs',//修改为自己的接口文档地址
  serversPath: './src'
})

```

5.运行

```bash
pnpm run openapi
```

根据openapi文档生成请求函数（如使用[配套后端模版](https://gitee.com/colablack/spring-model)则不需要运行openapi命令）

6.运行

```bash
pnpm run dev
```

启动项目

## 使用说明

1. 您可以使用与之匹配的Spring Boot后端项目模版[配套后端模版](https://gitee.com/colablack/spring-model)
2. 请务必修改/src/config/request.ts中的请求地址和/src/config/openapi.config.js中的后端接口文档地址

## 项目演示

#### 欢迎页展示

![欢迎页](https://2f7171c5.cloudflare-imgbed-bo7.pages.dev/file/1727872438069_欢迎页.png)

#### 登录页展示

![登录页](https://2f7171c5.cloudflare-imgbed-bo7.pages.dev/file/1727872447917_登录注册.png)

#### 用户CRUD展示

![用户CRUD](https://2f7171c5.cloudflare-imgbed-bo7.pages.dev/file/1727872439489_用户CRUD.png)

#### 用户管理展示

![用户管理](https://2f7171c5.cloudflare-imgbed-bo7.pages.dev/file/1727872441887_用户管理.png)

#### 404页面展示

![404页面](https://2f7171c5.cloudflare-imgbed-bo7.pages.dev/file/1727872621533_404.png)

#### 403页面展示

![403页面](https://2f7171c5.cloudflare-imgbed-bo7.pages.dev/file/1727872628832_403.png)

## 参与贡献

1. Fork 本仓库
2. 新建 Feat分支
3. 提交代码
4. 新建 Pull Request
