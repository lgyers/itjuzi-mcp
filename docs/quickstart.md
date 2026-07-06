# 快速接入

## MCP 客户端配置

```json
{
  "mcpServers": {
    "itjuzi-mcp": {
      "url": "https://mcp.itjuzi.com/mcp",
      "transport": "streamable-http",
      "headers": {
        "Authorization": "Bearer YOUR_ITJUZI_MCP_API_KEY"
      },
      "disabled": false
    }
  }
}
```

## CLI 配置

```bash
npm install -g itjuzi-mcp
itjuzi-mcp init --api-key YOUR_API_KEY
itjuzi-mcp doctor
```

## 推荐提问

- 查询某赛道下有哪些中国公司。
- 查询某赛道近期融资事件。
- 查询某机构投资案例。
- 查询企业对外投资案例。
- 做城市或赛道融资统计对比。
