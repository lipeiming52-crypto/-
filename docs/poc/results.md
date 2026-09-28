# Day 04｜A 的 PoC 前端实测记录

日期：2026-09-28。环境：本机 Next.js 开发服务 `http://localhost:3100`，桌面浏览器及 390 px 手机视口。测试只使用虚构输入。**这是 A 页面与 Mock 的记录，不是 B 数据库或 C 模型纵切验收。**

## 页面与暂拟请求

页面：`/try/poc`。输入为一段 `text`，最长 2000 字；拟向 B 的 `POST /api/v1/poc` 发送 `{"text":"…"}`。成功响应至少需有字符串 `request_id`；失败需有稳定的 `code`。这仅是 A 的**待对齐请求提案**，B 的 API Contract 尚未交付，不能称为冻结字段。

| 模式 | 输入与预期 | 实测结果 | 前端往返耗时 |
| --- | --- | --- | --- |
| 本地模拟成功 | 虚构“我在课程小组中整理了虚构的问卷数据。” | 显示“模拟保存成功”和 `mock-*` request_id；明确未写入数据库 | 461 ms |
| 本地模拟超时 | 同一输入 | 显示 `POC_TIMEOUT`，输入仍留在文本框，可继续编辑 | 851–865 ms |
| 实际接口 | 同一输入，请求 `/api/v1/poc` | 当前接口尚不存在，显示 `POC_UNAVAILABLE`，输入未丢失；不能声称保存成功 | 158 ms |
| 空输入 | 直接提交 | 显示 `INPUT_REQUIRED`，不发送请求 | 不适用 |

耗时为本机一次/少量手工演练值，不是性能基准。模拟模式的 request_id 有 `mock-` 前缀，不能和 B 的真实 request_id 混淆。实际 API/DB 延迟、模型 token/费用和非法 JSON 降级由 B/C 实测后补入团队 PoC 记录。

## 可见证据

- [PoC 超时截图](../screenshots/day04-a-poc-timeout.png)：输入保留，错误码与耗时可见。
- 手机视口 `window.innerWidth = 390`、页面 `scrollWidth = 375`，未见横向溢出；模拟成功和超时的状态均可访问。
- 浏览器页面源码和请求构造中没有 API Key；实际接口只用站内相对路径。

## 给 B/C 的断点

- B：请给 `POST /api/v1/poc` 的正式请求/响应、错误码、request_id 语义及连接失败样例；只有实际数据库写入并可读取才算保存纵切。
- C：请给模型 JSON/Zod 合法与非法结构、超时映射、模型/耗时/token/费用记录；模型失败不能写入 confirmed 事实。
- 当前 Day 04 团队 Gate：**FAIL**。页面可演练；页面→API→PostgreSQL→模型未实际连通。
