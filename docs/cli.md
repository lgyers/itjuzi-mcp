# CLI 手册

## 基础命令

```bash
itjuzi-mcp init --api-key YOUR_API_KEY
itjuzi-mcp doctor
itjuzi-mcp print-config --client workbuddy
itjuzi-mcp tools
itjuzi-mcp examples
```

## 业务分组

```text
company   公司搜索、公司画像、融资历史和企业对外投资
funding   融资事件、融资排名和赛道融资统计
investor  投资机构搜索、机构画像和机构投资案例
fa        结构化 FA 服务案例
lookup    字典
tag       标签
raw       原始工具调用
```

## 输出选项

```text
--pretty        缩进 JSON，默认
--compact       单行 JSON
--md            Markdown 表格
--head <n>      只展示前 n 行
--tail <n>      只展示后 n 行
--full          输出完整内容
--output-file   保存完整输出
--verbose       打印请求细节，Authorization 会脱敏
```
