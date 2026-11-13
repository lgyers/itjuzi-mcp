# 公开工具

当前 IT桔子 MCP 公开 22 个工具：

## 公司

- `search_companies`：查询公司列表，支持公司关键词、标签、行业、地区、融资阶段、千里马、独角兽和公司资质筛选。
- `count_companies`：按公司筛选条件统计对外可见公司总数。
- `resolve_companies`：批量把公司简称或工商全称解析为 `company_id`。
- `search_closed_companies`：分页查询死亡/关闭公司库，支持关闭日期和关闭原因筛选。
- `count_closed_companies`：按关闭公司筛选条件统计总数。
- `analyze_closed_company_cohort`：按关闭公司样本聚合融资历史、最后融资至关闭间隔、轮次分布和关闭原因。
- `get_company_profile`：按公司系统识别码查询公司画像。
- `get_company_funding_events`：查询某家公司融资历史。
- `search_company_investment_cases`：查询企业对外投资案例。

## 融资

- `search_events`：查询融资、上市相关和并购事件。
- `rank_companies_by_funding`：按公司汇总融资金额并输出 TOP 排名。
- `aggregate_funding_by_tags`：按标签、时间段和地区聚合融资统计。

## 机构

- `search_investors`：搜索投资机构。
- `get_investor_profile`：查询机构详情。
- `search_investor_cases`：查询某机构投资案例。

## 人物

- `search_people`：按姓名、在职状态、当前任职、教育经历和过往工作经历搜索人物。
- `get_person_profile`：按人物 ID 查询人物画像。
- `search_person_investment_cases`：查询人物个人参与的投资案例。

## FA

- `search_fa_cases`：查询结构化 FA 服务案例。

## 字典和标签

- `get_lookup_options`：查询行业、轮次、省份、机构类型、公司资质、快讯类型等字典。
- `search_tags`：搜索赛道标签并获取标签 ID。

## 快讯

- `search_newsletters`：查询快讯、创投电报，支持快讯类型、关键词和发布时间筛选。

运行以下命令查看 CLI 参数：

```bash
itjuzi-mcp tools
itjuzi-mcp company search --help
itjuzi-mcp company resolve --names 智元机器人,月之暗面
itjuzi-mcp company closed-search --close_date_start 2026-01-01
itjuzi-mcp person search --keyword 张一鸣
itjuzi-mcp news search --keyword 具身智能
itjuzi-mcp raw search_tags --json '{"keyword":"具身智能","limit":10}'
```

> CLI 目录只覆盖常用入参，`fields` 等字段级参数没有单独暴露；需要精细控制字段时，用 `itjuzi-mcp raw <tool_name> --json '<参数>'` 复现完整调用。
