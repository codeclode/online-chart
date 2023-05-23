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
- 技术选型，next+trpc+mongodb+prisma

### B

- 数据处理——管道-过滤器
- 画布信息的发布订阅——黑板
- 整体内容分层，prop传递信息
- 不同类型的BoxChart、ArcChart等继承自Chart抽象类（面向对象系统）
- 图形控件类Controller的唯一实例（单例模式）与选中的Chart双向绑定（我不知道是什么）

### S

- Mongodb数据库，三机，一主一从一投票，目的只是为了完成事务操作

## 代码阅读

>主要内容在src和prisma中，test为测试代码

### prisma

- 负责数据库自动生成
- 只需要看scheme.prisma就行，那个是数据库的模型和关系
- 数据库scheme的定义方式见[此链接](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/mongodb/creating-the-prisma-schema-typescript-mongodb)
- 阅读下mongodb复制集的内容，和课程里的冗余存储联系起来随便说点。

### src

- 最重要的文件夹
- server是服务端代码
- pages和components是前端代码
- utils是前后端公用方法代码，除了里边的charts文件夹内容目前只有前端使用

#### pages

- 除了api、styles、utils分别负责前后端交互、样式和方法封装，其他都是页面文件
- login登录解密
- workSpace，最重要的页面，图表的大部分操作
- index主页

##### utils

- const常量定义
- fileInput和outputImage数据导入和图表导出
- dataTransnsform数据转化（批处理和一些管道）

#### utils

- 不介绍除了charts文件夹的内容，里边是自定义错误和鉴权代码
- charts中，定义Controller类和Chart抽象基类和一系列实现（PIE、TREE等）
- charts的绘制属于管道结构，投入数据->数据归一化->归一化以后的数据转化为可视化维度（大小、颜色）->svg元素结点绘制

#### components

页面中使用的组件，调用utils提供的方法

### server

trpc架构，只需要知道定义了一个provider使用Auth中间件作为过滤器过滤无token用户。

## 可以写的架构

- 大部分workspace中CanvasWithOptions组件都监听根svg元素，比如画布设置中的缩放比例。。。
- 其实，这个也属于事件系统
- 刚才提到的管道过滤器还有批处理，自己区分一下哪些是批处理，哪些是管道
- 分层结构、BS结构很明显的
- 面向对象系统（刚才提到的抽象基类）
- 数据库冗余架构

