# Day 01–03 状态（C 分支工作记录）

日期：2026-09-27  
分支：`feature/c-day1-3`
集成负责人：按手册每日 A→B→C 轮换；Day 01 为 A。
全队 Gate：**FAIL / 待团队验收**（本记录不是 PR Review、合并或三机签收证明）。

| 项目 | 状态 | 证据 / 阻塞 |
| --- | --- | --- |
| 仓库基线与 AI 目录 | 已有基线；C 文档见本分支 | `evals/`、`knowledge/`、`docs/ai/`、`BOUNDARIES.md` 已存在；本分支补 Day 02/03 文档与样本 |
| C 工作区 clone/install/dev | 局部 PASS | `npm ci` 成功；Node `24.19.0`、npm `11.9.0`；Web 健康检查已在此工作区复测。详见 `docs/setup-c.md`。这不能代表 C/A/B 各自电脑验收 |
| Lint / Build | PASS | `npm run lint`、`npm run build` 成功 |
| Typecheck | FAIL | `npm run typecheck` 报 `src/app/layout.tsx:9` 找不到 `LayoutProps`；已定位阻塞，待 A/B 修复，C 不修改该所有权文件 |
| PostgreSQL | 未验收 | 当前执行环境没有 Docker；不得记为数据库或三机 PASS |
| Day 02 用户问题验证 | C 材料已起草，整体待证据/团队核验 | `docs/ai/risk-words.md` 和虚构 Eval 候选已建；尚无经同意、去标识化访谈记录，因此不把候选当用户研究结论 |
| Day 03 AI Scope Freeze | C 草案完成，待 A/B 评审和三方签字 | `docs/ai/AI_SCOPE.md` 和危险样本已建；仓库尚无 `PRODUCT.md` / `ARCHITECTURE.md`，本范围依据手册闭环拟定 |
| PR / main / 非作者 Review | 待团队操作 | 当前改动在 `feature/c-day1-3`；尚未推送、Review 或合并 |
| 密钥与真实用户资料 | 本分支复查中 | 新增样本全部标记 `synthetic`；提交前还需检查完整 Git diff 与跟踪文件 |

## C 交付

- Day 01：保持 `docs/ai/BOUNDARIES.md` 事实边界；增加工作区复跑记录 `docs/setup-c.md`。
- Day 02：增加 `docs/ai/risk-words.md` 与 `evals/day02-candidates.jsonl`。需 A 提供合规匿名记录后再补充真实证据；当前没有真实访谈结论。
- Day 03：增加 `docs/ai/AI_SCOPE.md` 与 `evals/dangerous-samples.jsonl`。已覆盖 Guide、Fact Extractor、Highlight、Requirement、Rewrite；所有输出要求人工确认，RAG、LangGraph、Vector Memory、Multi-Agent 延期。
- 交 B：调用输入版本、来源 ID、候选/确认状态、错误退化与拒绝写回需求；字段名仍待 Day 05 Contract 冻结。
- 交 A：`AI 草稿，请核对`、`来源：你的回答`、`这个信息还不确定`、`模型暂不可用，你可以继续手动填写` 等用户提示。

## 下一步与阻塞

1. A/B 修复 `LayoutProps` typecheck 阻塞；修复前不签全队 Day 01 Gate。
2. C 在自己的设备复跑并补充 `docs/setup-c.md`；等待 A/B 三机记录及 B 的 PostgreSQL 结果。
3. A 提供已同意、去标识化的访谈证据后，C 再将其整理为 Eval 候选，不提交真实原文。
4. A/B 评审 `AI_SCOPE.md` 的 P0 与调用边界；三方确认后才可将 Day 03 标记为 Freeze PASS。
5. 按仓库流程由非作者 Review 本分支 PR，合并后在 `main` 重跑 typecheck、lint 和相关测试，再更新 Gate。
