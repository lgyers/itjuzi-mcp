# IT桔子 MCP

IT桔子 MCP 是一个远程托管的 `streamable-http` MCP 服务，支持在 WorkBuddy、Claude、Cursor、Cherry Studio 等 MCP 客户端中通过自然语言查询一级市场结构化数据。

本项目是 IT桔子 MCP 的公开客户端项目，包含 npm CLI、公开工具目录、接入文档和使用案例。服务端由 IT桔子托管运行，后端源码、数据库结构、同步任务和专有数据集不在本仓库开源。

## 快速接入 MCP 客户端

在支持 MCP 的客户端中添加：

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

接入后可以直接自然语言提问：

- 查询具身智能标签下，中国公司中哪些已经有对外投资记录，并列出各家的对外投资清单。
- 最近 30 天国内人工智能融资事件有哪些？按轮次和地区做一个摘要。
- 北京、上海、深圳 2026 年机器人赛道融资总额和事件数对比。
- 红杉中国最近一年投过哪些人工智能公司？

## 安装 CLI

```bash
npm install -g @itjuzi/mcp-cli
```

配置 API Key：

```bash
itjuzi-mcp init --api-key YOUR_API_KEY
```

检查连接：

```bash
itjuzi-mcp doctor
```

生成 MCP 客户端配置：

```bash
itjuzi-mcp print-config --client workbuddy
```

查看自然语言案例：

```bash
itjuzi-mcp examples
```

查看公开工具：

```bash
itjuzi-mcp tools
```

## CLI 调用示例

CLI 主要用于配置、诊断、演示和复现工具调用。普通用户更推荐在 MCP 客户端中自然语言提问。

```bash
itjuzi-mcp tag search --keyword 具身智能 --limit 10
itjuzi-mcp company search --tag_ids 14956 --location in --page_size 20
itjuzi-mcp company investment-cases --investor_tag_ids 14956 --page_size 20
itjuzi-mcp funding events --tag_ids 14956 --location in --date_start 2026-01-01
itjuzi-mcp lookup options --lookup_type round
```

技术用户可以用 raw 命令复现单个工具调用：

```bash
itjuzi-mcp raw search_tags --json '{"keyword":"具身智能","limit":10}'
```

## 当前边界

- 第一版 CLI 覆盖当前 14 个公开 MCP 工具。
- 第一版 CLI 不要求公开服务端源码，也不包含数据库逻辑。
- 第一版名称自动解析能力有限。部分服务端工具当前需要系统识别码或标签 ID，可以先用 `search_tags`、`search_investors`、`get_lookup_options` 等工具查询。
- IT桔子 MCP 适用于人在 AI 客户端中进行投研问答，不支持批量导出、系统入库或平台分发。

## 文档

- [快速接入](docs/quickstart.md)
- [CLI 手册](docs/cli.md)
- [公开工具](docs/tools.md)
- [自然语言案例](docs/natural-language-examples.md)
- [故障排查](docs/troubleshooting.md)
- [价格权益](docs/pricing.md)

## License

本仓库中的客户端代码、公开文档和示例使用 MIT License。

IT桔子托管 MCP 服务、后端实现、数据库结构、同步任务和专有数据集不在本仓库开源。
