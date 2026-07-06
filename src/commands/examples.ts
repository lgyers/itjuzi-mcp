import type { Command } from "commander";

const EXAMPLES = [
  {
    question: "查询具身智能标签下，中国公司中哪些已经有对外投资记录，并列出各家的对外投资清单。",
    tools: "search_tags -> search_company_investment_cases",
  },
  {
    question: "最近 30 天国内人工智能融资事件有哪些？按轮次和地区做一个摘要。",
    tools: "search_tags -> search_events",
  },
  {
    question: "北京、上海、深圳 2026 年机器人赛道融资总额和事件数对比。",
    tools: "search_tags -> aggregate_funding_by_tags",
  },
  {
    question: "查询红杉中国最近投过哪些人工智能公司。",
    tools: "search_investors -> search_investor_cases",
  },
  {
    question: "查询国内自动驾驶公司融资总额 TOP50。",
    tools: "search_tags -> rank_companies_by_funding",
  },
];

export function registerExamplesCommand(program: Command): void {
  program
    .command("examples")
    .description("输出自然语言问题案例和预期工具链")
    .action(() => {
      for (const [idx, item] of EXAMPLES.entries()) {
        console.log(`${idx + 1}. ${item.question}`);
        console.log(`   预期工具链：${item.tools}`);
      }
    });
}
