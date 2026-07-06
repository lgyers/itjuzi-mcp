# 公开工具

当前 IT桔子 MCP 公开 14 个工具：

## 公司

- `search_companies`：查询公司列表，支持标签、行业、地区、融资阶段和公司资质筛选。
- `count_companies`：按公司筛选条件统计对外可见公司总数。
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

## FA

- `search_fa_cases`：查询结构化 FA 服务案例。

## 字典和标签

- `get_lookup_options`：查询行业、轮次、省份、机构类型、公司资质等字典。
- `search_tags`：搜索赛道标签并获取标签 ID。

运行以下命令查看 CLI 参数：

```bash
itjuzi-mcp tools
itjuzi-mcp company search --help
itjuzi-mcp raw search_tags --json '{"keyword":"具身智能","limit":10}'
```
