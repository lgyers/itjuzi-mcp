# 自然语言案例

| 用户问题 | 预期工具链 |
| --- | --- |
| 查询具身智能标签下，中国公司中哪些已经有对外投资记录，并列出各家的对外投资清单。 | `search_tags -> search_company_investment_cases` |
| 最近 30 天国内人工智能融资事件有哪些？按轮次和地区做一个摘要。 | `search_tags -> search_events` |
| 北京、上海、深圳 2026 年机器人赛道融资总额和事件数对比。 | `search_tags -> aggregate_funding_by_tags` |
| 红杉中国最近一年投过哪些人工智能公司？ | `search_investors -> search_investor_cases` |
| 国内自动驾驶公司融资总额 TOP50 是哪些？ | `search_tags -> rank_companies_by_funding` |
| 查询某个 FA 机构最近服务过哪些融资案例。 | `search_investors -> search_fa_cases` |

说明：自然语言接入时，由 MCP 客户端中的 Agent 自动选择和组合工具。CLI 的 raw 调用主要用于复现和排查。
