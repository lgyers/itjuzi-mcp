# IT桔子 MCP

IT桔子 MCP 是一个远程托管的 `streamable-http` MCP 服务，支持在 WorkBuddy、Claude、Cursor、Cherry Studio 等 MCP 客户端中通过自然语言查询一级市场结构化数据。

本项目是 IT桔子 MCP 的公开客户端项目，包含 npm CLI、公开工具目录、接入文档和使用案例。服务端由 IT桔子托管运行，后端源码、数据库结构、同步任务和专有数据集不在本仓库开源。

## 购买套餐并激活 API Key

使用 IT桔子 MCP 前，需要先在 IT桔子官网购买 MCP 套餐，并生成 API Key。在 WorkBuddy 中添加 IT桔子连接器后，也需要填写这个 API Key 才能查询数据。

1. 打开 [IT桔子 MCP 官网介绍与购买页面](https://www.itjuzi.com/ai_skill/mcp)，注册或登录 IT桔子账号。
2. 从该页面的购买入口选择适合自己的 MCP 套餐，按页面提示完成支付。套餐价格、Token 额度和有效期以官网购买页面展示为准。
3. 支付成功后，使用购买时的同一账号进入官网个人中心的 MCP 页面。首次开通时，按页面提示生成 API Key，完成套餐激活。
4. 复制并保存生成的完整 API Key，再回到 WorkBuddy 或其他 MCP 客户端完成配置。

API Key 明文只在生成时展示一次，请及时保存。如果未保存，可以在官网个人中心的 MCP 页面重新生成；重新生成后，旧 Key 将失效，需要同步更新已配置的客户端。套餐有效期和剩余额度也可以在该页面查看。

如果已经支付但仍提示未开通或待激活，请先确认登录的是购买时的账号，并检查是否已完成生成 API Key；仍有问题时，通过官网客服核查订单与开通状态。

## 在 WorkBuddy 中接入

如果你是从 WorkBuddy 中 IT桔子连接器的「查看接入说明」进入本页，按以下步骤操作即可：

1. 按照上方说明，在 [IT桔子官网](https://www.itjuzi.com/ai_skill/mcp) 购买套餐并生成 API Key。
2. 回到 WorkBuddy 的 IT桔子连接器配置页，将完整 API Key 粘贴到 **API Key** 输入框中。这里只填写 Key 本身，无需添加 `Bearer ` 前缀。
3. 保存配置并启用连接器，然后在对话中提问，例如：「帮我查询月之暗面的融资历史」。

使用 WorkBuddy 连接器无需安装本项目或 CLI，也无需自行部署服务端。

## 快速接入 MCP 客户端

如果使用其他支持远程 MCP 的客户端，可以手动添加以下配置，将 `YOUR_ITJUZI_MCP_API_KEY` 替换为官网生成的 API Key，并保留 `Bearer ` 前缀：

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
npm install -g itjuzi-mcp
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
itjuzi-mcp company resolve --names 智元机器人,月之暗面
itjuzi-mcp company search --keyword 智元机器人
itjuzi-mcp company search --tag_ids 14956 --location in --page_size 20
itjuzi-mcp company investment-cases --investor_tag_ids 14956 --page_size 20
itjuzi-mcp company closed-search --tag_ids 14956 --close_date_start 2026-01-01
itjuzi-mcp person search --keyword 张一鸣 --is_on_job true
itjuzi-mcp person cases --person_id 12 --page_size 20
itjuzi-mcp funding events --tag_ids 14956 --location in --date_start 2026-01-01
itjuzi-mcp news search --keyword 机器人 --date_start 2026-11-01
itjuzi-mcp lookup options --lookup_type round
```

技术用户可以用 raw 命令复现单个工具调用：

```bash
itjuzi-mcp raw search_tags --json '{"keyword":"具身智能","limit":10}'
```

## 当前边界

- 第一版 CLI 覆盖当前 22 个公开 MCP 工具。
- 第一版 CLI 不要求公开服务端源码，也不包含数据库逻辑。
- 第一版支持通过 `resolve_companies` 批量把公司名称解析为 `company_id`；部分服务端工具仍需要系统识别码或标签 ID，可以先用 `resolve_companies`、`search_tags`、`search_investors`、`get_lookup_options` 等工具查询。
- IT桔子 MCP 适用于人在 AI 客户端中进行投研问答，不支持批量导出、系统入库或平台分发。

## 文档

- [快速接入](docs/quickstart.md)
- [CLI 手册](docs/cli.md)
- [公开工具](docs/tools.md)
- [自然语言案例](docs/natural-language-examples.md)
- [故障排查](docs/troubleshooting.md)

## License

本仓库中的客户端代码、公开文档和示例使用 MIT License。

IT桔子托管 MCP 服务、后端实现、数据库结构、同步任务和专有数据集不在本仓库开源。
