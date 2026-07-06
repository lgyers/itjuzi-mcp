# 故障排查

## 未配置 API Key

运行：

```bash
itjuzi-mcp init --api-key YOUR_API_KEY
```

或使用环境变量：

```bash
export ITJUZI_MCP_API_KEY=YOUR_API_KEY
```

## 鉴权失败

检查 API Key 是否正确、是否过期、套餐是否可用。

```bash
itjuzi-mcp doctor --verbose
```

`--verbose` 会脱敏 Authorization。

## 空结果

可能原因：

- 关键词没有匹配到标签或机构。
- 地区、时间、轮次过滤过窄。
- 当前套餐没有对应工具或字段权限。

## 批量导出

IT桔子 MCP 面向人在 AI 客户端中的投研问答，不支持批量导出、系统入库或平台分发。
