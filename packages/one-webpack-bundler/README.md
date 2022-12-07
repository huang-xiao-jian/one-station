# @one/webpack-bundler

暂时忽略灵活性，作为 `visual palette` 定制级工具。

## 插件化设计

配置内容基于 `Tapable` 进行扩展维护，整体流程设计为：

1. `initialize` 负责处理基准 `webpack-chain` 配置
2. `aggregation` 基准配置扩展
   - `css`
   - `less`
   - `sass`
   - `png`
   - `javascript`
   - `typescript`

配置依赖环境：

- `NODE_ENV` 环境变量
