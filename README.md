# online-chart
web前端svg+d3+trpc图表生成

## 主要功能

### 前端

- 用户登录
- 读取用户选择的文件（csv格式），解析和处理
- 图表绘制
- 画布和图表状态（transform）

### 后端

- 记录用户信息
- 用户颜色集预设

## 架构

### 整体

- BS
- 主要工作在B端，S只负责记录用户的预设颜色和鉴权
- 技术选型，trpc+mongodb+prisma

### B

- 数据处理——管道-过滤器
- 画布信息的发布订阅——黑板
- 整体内容分层，prop传递信息
- 不同类型的BoxChart、ArcChart等继承自Chart抽象类（面向对象系统）
- 图形控件Controller与选中的Chart双向绑定（我不知道是什么）

### S

- Mongodb数据库，三机，一主一从一投票，目的只是为了完成事务操作

