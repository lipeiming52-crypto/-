# Day 01 状态

日期：2026-09-27  
集成负责人：A（按手册 A→B→C 轮值）  
当前 Gate：**FAIL / 尚未完成团队验收**

| 项目 | 状态 | 证据 / 阻塞 |
| --- | --- | --- |
| 本地项目底座与锁文件 | 待最终验证 | Next.js + TypeScript + npm lockfile 已生成；验证结果随后补记 |
| A 本机 clone → install → dev | 待验证 | 当前先在本机搭建仓库；远程仓库创建后再独立克隆复跑 |
| B/C 两台电脑独立启动 | 待队友执行 | 尚未收到 B/C 的运行记录 |
| 本地 PostgreSQL | 未验收 | Compose 方案已写；当前电脑未检测到 Docker Desktop |
| AI 目录与事实边界 | 待 C Review | 目录与草案已准备，不能代替 C 的签收 |
| GitHub 仓库 / main 保护 / PR | 待创建 | GitHub 需登录后继续；非作者 Review 需队友完成 |
| 无真实用户数据与密钥入库 | 待最终复查 | 仅使用标记为虚构的样例；提交前再查 Git 跟踪列表 |

明日第一优先级：先处理任何一台无法 clone/install/dev 的问题，再推进 Day 02 访谈。不要把单机启动记为三机 PASS。

## Day 01 后续核验（2026-09-27）

A 已从远程仓库独立克隆，完成 `npm ci`、开发服务首页与 `/api/health` 访问及类型检查；启动记录和截图见 [Day 01 PR #1](https://github.com/lipeiming52-crypto/-/pull/1)。这些只证明 A 的电脑可启动。B/C 独立启动、PostgreSQL 和非作者 Review 仍待完成；PR #1 未合并，main 保护也未启用。

## Day 02｜用户问题验证（A，2026-09-28）

当前 Gate：**FAIL / 缺真实访谈与团队对齐**。

| 项目 | 状态 | 证据 / 下一步 |
| --- | --- | --- |
| 招募、同意、六个开放问题 | 文档完成 | [访谈提纲](docs/research/interview-guide.md)；尚未实际招募 |
| 匿名真实原话 | 0 条 | [清洗记录](docs/research/interviews-clean.md) 的 S01/S02 明确为虚构演练，不计样本 |
| H1–H4 与反例 | 计划完成、实证未验证 | [假设表](docs/research/hypotheses.md) 保留未知和反例条件 |
| B/C 交接 | A 的文件完成、对方未签收 | [字段需求](docs/research/field-needs-for-b.md)、[措辞风险](docs/research/question-risks-for-c.md) |
| 主旅程 | 低保真草图完成 | [流程草图](docs/ux/low-fi-flow.md)，尚无真实用户测试 |

不能声称 Day 02 “用户问题已验证”。下一优先级：真实招募与访谈；请 B/C 审核字段和诱导风险。

## Day 03｜MVP 范围（A，2026-09-28）

当前 Gate：**FAIL / A 提案已备，三方 Scope Freeze 和 P0 实测未完成**。

| 项目 | 状态 | 证据 / 下一步 |
| --- | --- | --- |
| 用户问题、主流程、P0/P1/P2、可见完成标准 | A 提案完成 | [PRODUCT.md](PRODUCT.md)；基于待验证假设，待访谈后修订 |
| 延期与不做清单 | A 提案完成 | [NOT_DOING.md](NOT_DOING.md) |
| P0 现场演示脚本 | 验收剧本完成、功能未实现 | [演示剧本](docs/ux/day03-demo-script.md)；不能记录为 PASS |
| B 架构/容量、C AI 范围、三方评审 | 待实际队友完成 | 不代签；B/C 结论回来后再冻结范围 |

本分支仅增加 A 的文档和状态记录，无 Migration、Contract、Prompt 或 Eval 运行规则改动。提交前复查敏感信息；合并后仍需在 main 复跑检查与三机同步。

## 2026-09-28 交接复查

已补 [Day 01–03 交接索引](docs/day01-03-handoff.md)、[单场访谈空白模板](docs/research/interview-record-template.md) 和 [B/C 范围评审清单](docs/ux/scope-review-checklist.md)。GitHub 实时核对时，PR #1/#2 均仍开放且未合并，尚无可归属到非作者的有效 Review；队友写权限邀请仍待接受。上述条件与真实访谈缺口未消除，因此 Day 01–03 团队 Gate 均维持 **FAIL / 待验收**。此节是当日快照，后续以 PR 和实际记录为准。

## Day 04–06｜A 的前端演练（2026-09-28）

已实现 `/try/poc` 与 `/try/prototype`，并提供 [专业提示词](docs/prompts/day03-06-guidance.md)、[虚构 Mock](mocks/experience.json)、[PoC 结果](docs/poc/results.md)、[字段审查](docs/contracts/frontend-field-review.md)、[真实用户测试计划](docs/ux/day06-test-plan.md) 和 [UI 问题卡](docs/ux/day06-ui-issues.md)。浏览器自测覆盖 Mock 保存、超时不丢输入、接口缺失、事实人工确认、夸大句排除、导出预览与 AI 失败提示；具体证据见上述文档及截图。

本分支 `npm run typecheck`、`npm run lint`、`npm run build` 均通过；[内部自测记录](docs/ux/day06-internal-qa.md) 区分了已验证的前端行为与未验证的真实用户体验。

| 天数 | A 当前状态 | 团队 Gate / 尚缺证据 |
| --- | --- | --- |
| Day 04 | A 的页面和 Mock 演练完成 | **FAIL**：B 的 `/api/v1/poc`、PostgreSQL 单表读写、C 的模型 JSON/Zod/费用记录尚未实际连通 |
| Day 05 | A 虚构 Mock、字段/空态审查完成 | **FAIL**：B 共享 Zod/API/SQL Contract 与 C 输出样例未交付；Mock 尚不能证明符合共享 Schema，三方未冻结 |
| Day 06 | A 可点击原型和测试脚本完成 | **FAIL**：真实目标用户测试 0/2–3；B/C 未审字段、措辞和 Eval，不能宣称用户可识别夸大 |

下一优先级：先收 B/C 对 Day 03–05 契约与范围的评审，再运行真实访谈及 2–3 人原型测试；所有新增结论必须带实际证据。Day 04–06 分支从 Day 02–03 分支派生，后续 PR 需按依赖顺序 Review/合并。

## Day 07–09｜A 的前端工作页（2026-09-29）

新增 `/try/workspace` 和 [A 交接/浏览器自测记录](docs/ux/day07-09-a-handoff.md)。A 可用虚构样例检查场景选择、逐题问答、空白/加载/保存失败/冲突状态、标签页刷新恢复、原话与事实对照、四类风险提示和原话修改后旧确认失效。`npm run typecheck`、`npm run lint`、`npm run build` 通过。本分支包含 PR #1 已提交但尚未进入本分支祖先的布局类型修复，以支持干净安装后立即类型检查。

| 天数 | A 当前状态 | 团队 Gate / 明日第一优先级 |
| --- | --- | --- |
| Day 07 | 前端状态与异常路径演练完成 | **FAIL**：真实用户失败点 0、B Migration 未验收、C approved 双审未完成；先收真实测试与 B/C 交付 |
| Day 08 | Experience/Guide 前端完成，浏览器标签页恢复已测 | **FAIL**：B 保存/读取 API 未到位，真实 API 替换 0；先接保存与 owner/version |
| Day 09 | Fact Review 前端与风险演练完成 | **FAIL**：B Fact API/source/version、C Extractor/Validator/Eval 未到位；先验来源与确认状态机 |

未把虚构样例、浏览器存储或 A 的关键词规则记为团队 PASS。后续 PR 依赖 Day 04–06 A 分支；需非作者 Review、按依赖顺序合并并在 main 重跑。
