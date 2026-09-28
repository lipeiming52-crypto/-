# Day 05｜A 的前端字段与空态审查（待 B/C 对齐）

状态：A 提案，**没有 B 共享 Zod Schema，也没有 C 的正式 AI 响应例；Contract 尚未冻结。** [虚构 Mock](../../mocks/experience.json) 的 `contract_status` 明示 `awaiting_b_shared_schema`。原型读取这份 Mock，仅证明页面可展示候选、来源、归属和未知，不能声称“符合共享 Schema”。

| 页面对象 | A 需要显示的字段 | 空/错误状态 | 请 B/C 决定 |
| --- | --- | --- | --- |
| 体验与回答 | `experience_id`、`scene`、`source_answer.id/text` | 原话空时不能进入事实核实；身份信息不入演示样例 | 回答版本、删除与归属 |
| Fact | `id`、`source_answer_ids`、`text`、`status`、`ownership`、`risk_flags` | 无来源、未知结果或团队成果不能自动进入个人导出 | 共享 Schema、来源关联、状态迁移由 B 定义；C 映射风险旗标 |
| Highlight | 内容与依据的 Fact IDs | 没有已确认个人事实时不生成亮点 | B/C 确认候选与版本字段 |
| Target | 目标文本或明确的“暂不确定” | 目标为空仍可继续；不据此编造岗位要求 | B 定义空值与修改路径 |
| ResumeLine | 候选句、依据、用户复核状态 | 未人工核对不得导出；团队/未知不自动拼进句子 | B 定义版本冲突；C 定义建议语义边界 |
| PoC 请求 | `text`；成功 `request_id`；失败 `code` | `INPUT_REQUIRED`、`POC_TIMEOUT`、`POC_UNAVAILABLE` 暂为 A 页面演练码 | B 给统一错误结构和正式码表 |

## 对 Mock 的审查结论

- 两条个人行动、一条团队结果均为 **candidate**；Mock 不把任何模型输出设为 `confirmed`。
- 第三条明确写“具体分数未知”，`ownership = team`，带 `team_result` / `unknown_result` 风险标签。夸大候选“主导课程项目并取得高分”只供用户识错演练，不进入导出。
- 原型的确认操作发生在浏览器内存中，仅由用户点击。它不写数据库，不代表 B 的状态机已实现。
- 目前无法执行“Mock 过共享 Zod”的 Day 05 PASS 检查；等 B 提交 Schema 后，由 A 改 Mock 并运行同一验证命令，C 同步改输出样例。

## 待发给 B/C 的具体问题

1. `source_answer_ids` 在一句事实有多个来源时如何表示？来源被删除后候选句如何失效？
2. `unknown`、`null`、缺字段各是什么含义？不能让“不记得分数”变成 0。
3. `candidate → confirmed / invalidated` 谁能触发？用户改原话后确认状态是否回退？
4. 统一错误结构是否包含 `request_id`、`code`、可展示信息和可重试性？
5. 团队成果可否被用户确认“确实是团队的”，但不作为个人行动导出？

正式 Contract 应由 B 在 `docs/contracts/api-v0.1.md` 和共享 Schema 中发布，C 提供匹配的 AI 输出样例，三方 Review 后再记录冻结版本。A 不私改公共字段。
