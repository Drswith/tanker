# 项目开发规则与规范

## 0. 基础规则

- 永远使用简体中文回答问题和编写注释
- 严格遵循项目现有的代码风格和架构模式

## 1. 技术栈与环境

- **框架**: Vue2 + JavaScript + UniApp
- **开发工具**: HBuilderX
- **代码规范**: ESLint + @uni-helper/eslint-config
- **样式预处理**: SCSS
- **地图服务**: 腾讯地图

## 2. 开发服务器规则

- **禁止通过终端启动开发服务器**，外部已通过HBuilderX在本地8080端口启动预览服务器
- **预览地址**: http://localhost:8080/#/ + pages.json中对应页面路径
- 例如: 首页预览 → http://localhost:8080/#/pages/home/index/index

## 3. 项目结构规范

### 3.1 页面路由规范

- 所有页面必须在 `pages.json` 中注册
- 页面路径格式: `pages/模块名/功能名/index`
- 导航栏标题必须明确描述页面功能

### 3.2 目录结构说明

```
├── api/           # API接口封装
├── common/        # 公共工具函数
├── components/    # 自定义组件
├── pages/         # 页面文件
├── static/        # 静态资源
├── utils/         # 工具类库
└── uni_modules/   # uni-app插件
```

### 3.3 核心模块说明

- **订单中心**: 下单、支付、进度跟踪、评价等完整流程
- **司机管理**: 司机信息管理和详情查看
- **地址管理**: 收发货地址的增删改查
- **邀请系统**: 好友邀请和记录管理
- **个人中心**: 用户信息、密码修改等

## 4. 编码规范

### 4.1 命名规范

- **文件名**: 使用kebab-case (如: order-center)
- **组件名**: 使用PascalCase (如: TimeLine)
- **变量名**: 使用camelCase
- **常量名**: 使用UPPER_SNAKE_CASE

### 4.2 Vue组件规范

- 使用Vue2语法，使用options API,避免使用Vue3特性
- 组件必须有明确的name属性
- props必须定义类型和默认值
- 事件命名使用kebab-case

### 4.3 样式规范

- 优先使用uni.scss中定义的变量
- 主色调: $uni-color-primary: #FF9E00
- 使用rpx单位适配不同屏幕
- 遵循BEM命名规范

### 4.4 API调用规范

- 使用 `utils/http.js` 进行网络请求
- API接口统一在 `api/` 目录下管理
- 错误处理必须统一处理

## 5. 平台兼容性

- **主要平台**: 微信小程序
- **支持平台**: H5、微信小程序
- **权限要求**: 地理位置权限 (用于地图定位)

## 6. 开发最佳实践

### 6.1 性能优化

- 图片使用适当尺寸，避免过大图片
- 合理使用组件懒加载
- 避免在页面中直接写大量业务逻辑

### 6.2 用户体验

- 所有异步操作必须有loading状态
- 网络错误要有友好的提示信息
- 表单验证要及时反馈

### 6.3 安全规范

- 敏感信息不得硬编码
- 用户输入必须进行验证和过滤
- API调用必须进行权限验证

## 7. 调试与测试

- 使用HBuilderX内置调试工具
- 真机调试前先在H5端验证基本功能
- 重点测试地图定位、支付、图片上传等关键功能

## 8. 发布规范

- 发布前必须通过ESLint检查
- 确保所有平台编译无错误
- 版本号遵循语义化版本规范

## 9. 常用页面预览地址

- 首页: http://localhost:8080/#/pages/home/index/index
- 订单列表: http://localhost:8080/#/pages/order-center/list/index
- 下单页面: http://localhost:8080/#/pages/order-center/add/index
- 司机管理: http://localhost:8080/#/pages/driver/list/index
- 地址管理: http://localhost:8080/#/pages/address/list/index
- 个人中心: http://localhost:8080/#/pages/mine/index/index
