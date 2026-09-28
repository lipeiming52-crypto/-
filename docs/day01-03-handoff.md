# Day 01–03｜A 交接与待办（2026-09-28 核对）

这是便于三人接手的状态索引；实时状态仍以 GitHub PR 和 [STATUS.md](../STATUS.md) 为准。当前 Web 是 Day 01 可启动底座，P0 产品页面尚未实现。

| 天数 | A 已完成 | 仍需真实执行的事项 |
| --- | --- | --- |
| Day 01 | [启动记录与截图（PR #1）](https://github.com/lipeiming52-crypto/-/pull/1)：A 从远程仓库独立克隆、安装、启动并检查密钥忽略 | B/C 各在自己的电脑复跑并记录；B 验 PostgreSQL；非作者 Review 后合并；仓库所有者处理 main 保护 |
| Day 02 | [访谈提纲](research/interview-guide.md)、[空白记录模板](research/interview-record-template.md)、[假设表](research/hypotheses.md)、[字段需求](research/field-needs-for-b.md)、[问题风险](research/question-risks-for-c.md)、[低保真流程](ux/low-fi-flow.md) | 招募并完成真实访谈、取得同意、清洗匿名原话；B/C 审字段与诱导风险。当前真实样本 0，不能宣称 H1–H4 通过 |
| Day 03 | [PRODUCT 范围](../PRODUCT.md)、[延期项](../NOT_DOING.md)、[演示剧本](ux/day03-demo-script.md)、[B/C 评审清单](ux/scope-review-checklist.md) | B 给出架构与工期边界，C 给出 AI 范围和降级方案，三方共同确认 P0；功能实现后才能真正跑演示 |

## 最短行动顺序

1. 邀请尚未接受的队友接受仓库写权限；队友各自按 README 运行并在 PR 中留下可复现结果。
2. A 按 [访谈模板](research/interview-record-template.md) 找到真实目标用户。原始记录留在仓库外，只有经同意、匿名化的引文进入 [清洗记录](research/interviews-clean.md)。
3. B/C 分别在 [PR #2](https://github.com/lipeiming52-crypto/-/pull/2) 审查字段、风险和容量；A 根据实证与意见修订范围。
4. 非作者 Review、三方 Scope Freeze、合并 main、三机 pull 和复测完成后，再把相应 Gate 改为 PASS。

**不能用虚构访谈、代签评审或本机启动记录补齐需要真实用户和队友亲自完成的证据。**
