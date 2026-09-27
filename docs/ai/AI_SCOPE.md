# Day 03：AI 首发范围与任务边界

状态：C 初稿，待 A/B 按 P0 旅程、架构与容量共同评审后冻结。当前仓库没有收到 `PRODUCT.md`、`ARCHITECTURE.md` 或访谈证据，因此本范围依据手册规定的事实到导出闭环拟定；不表示团队已完成 Scope Freeze。

## 首发 AI 任务

所有模型结果都是候选。调用必须带任务类型和输入版本；输出通过结构校验后仍停留在待审状态。只有用户明确确认才能改变业务状态。AI 不可直接写入 `confirmed`，不可越过服务端状态机，不可将未知补成事实。

| 任务 | 输入 | 结构化输出（初稿） | 人工确认点 |
| --- | --- | --- | --- |
| Guide | 用户选择的经历场景、当前问题、用户回答、已知缺口 | `nextQuestion`, `unknowns`, `fallbackUsed` | 用户自行回答或跳过；问题每次只问一件事 |
| Fact Extractor | 原始回答及 `source_answer_id` / 版本 | `candidateFacts[{text, sourceAnswerId, riskFlags}]`, `unknowns` | 用户逐条编辑、补充或确认候选事实 |
| Highlight | 仅用户已确认的事实及事实来源 ID | `candidates[{claim, sourceFactIds, riskFlags}]`，数量 0–3 | 用户编辑、拒绝或确认亮点；0 条是有效结果 |
| Requirement | 用户粘贴的目标/要求原文 | `requirements[{text, sourceSpan, needsReview}]`, `unknowns` | 用户逐条接受、修改或删除解析结果 |
| Rewrite | 用户已确认的事实/亮点、用户确认的目标要求 | `drafts[{text, sourceFactIds, riskFlags}]` | 用户编辑并确认句子；未确认素材不能生成正式简历内容 |

以上字段是 C 提供给 B 的调用/状态需求草案，不是 Day 05 冻结的 API Contract。字段名、错误码、版本规则和状态枚举需由 B 主责确定并在 Day 05 对齐。

## 状态与失败退化

- 候选生命周期建议：`candidate` → `needs_review` → 用户显式确认后由服务端写入 `user_confirmed`；拒绝和未知保持独立状态。模型不能请求或执行确认迁移。
- B 需提供任务输入版本、来源 ID、当前状态和稳定错误分类；过期版本、缺来源或来源已变化时拒绝写回，并要求重新审阅。
- A 的提示文案建议：`AI 草稿，请核对`、`来源：你的回答`、`这个信息还不确定`、`模型暂不可用，你可以继续手动填写`。不使用“已验证”或“已确认”描述模型输出。
- 超时、限流、不可用、结构校验失败或安全校验失败时，不保存模型生成的业务事实。Guide 回到静态问题树；抽取/改写/要求解析显示错误并允许用户手动编辑；亮点可返回 0 条。
- 对同一输入的有限重试和错误记录由 B 的调用/任务层承载；不因重试放宽校验，也不覆盖较新的用户输入。

## 延期，不阻断 P0

RAG、LangGraph、Vector Memory、Multi-Agent 均不属于首发核心。知识库增强、向量检索、图编排或多 Agent 只有在核心事实到导出闭环通过验收且另行评审后才考虑。

## 危险样本与质量门

[`../../evals/dangerous-samples.jsonl`](../../evals/dangerous-samples.jsonl) 收录新增数字、头衔膨胀、奖项、团队归属、无测量结果及输入中夹带指令六类虚构危险样本。Day 02 候选见 [`../../evals/day02-candidates.jsonl`](../../evals/day02-candidates.jsonl)。这些只是待批准的回归样本，尚未构成自动化 Eval。正式接入前需由 C 标记批准状态、A 核用户可读性、B 核 Schema。

**Day 03 Gate：**任何模型都不能直接写 `user_confirmed`；未确认内容不进入推荐或导出；RAG 延期不阻断 P0。A/B/C 完成范围与 P0 定义的共同评审前，Gate 状态为待签收。
