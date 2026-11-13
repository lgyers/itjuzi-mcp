# Changelog

## 0.1.2

- 工具目录补齐到服务端当前的 22 个公开工具：新增死亡/关闭公司库（`search_closed_companies`、`count_closed_companies`、`analyze_closed_company_cohort`）、人物（`search_people`、`get_person_profile`、`search_person_investment_cases`）和快讯（`search_newsletters`）。
- 新增 `person`、`news` 两个 CLI 分组，公司分组新增 `closed-search`、`closed-count`、`closure-cohort` 三个子命令。
- 文档同步：`docs/tools.md`、`docs/cli.md` 与 README 的工具数量和分组说明。

## 0.1.1

- 补齐公司解析工具命令：`itjuzi-mcp company resolve`。
- 修正 `doctor` 检查逻辑，改为通过标准 MCP endpoint 校验连接和鉴权。

## 0.1.0

- 初始化 IT桔子 MCP 公开客户端项目。
- 支持配置、诊断、MCP 配置生成、工具目录、自然语言案例和 raw 工具调用。
