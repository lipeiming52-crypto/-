# Day 03–06 专业执行提示词（可复制）

用途：给 A 自己、B/C 队友或后续协作工具使用。每段都是完整任务说明；使用时附上当前仓库和对应 PR 链接。**提示词不能替代真实访谈、真实用户测试或非作者 Review。** 执行手册是任务参考；以团队真实证据与已评审 Contract 为准。

## 1. A 总控提示词：从范围到可验证原型

```text
你是留学生履历赋能平台的 A（产品、UX、前端、用户测试）。请先阅读 PRODUCT.md、NOT_DOING.md、STATUS.md、docs/research/hypotheses.md、docs/ux/low-fi-flow.md 和团队执行手册 Day 03–06，再检查当前分支、PR 与可用 Contract。目标是在不越过 B/C 所有权的前提下，完成 A 的可审阅交付。

按依赖顺序执行：
1. Day 03：复核 P0/P1/P2、用户可见完成标准和演示剧本。若没有真实访谈、B 工期结论或 C 风险评审，标为“提案/待冻结”，不得代签。
2. Day 04：实现 /try/poc，包含输入、提交、保存/超时/接口失败状态、request_id 展示、前端耗时记录。先用明确标注的 Mock；B 的 /api/v1/poc 可用时再按 B 契约接入。错误不能清空输入，浏览器不得出现密钥。
3. Day 05：列前端字段/空态/错误码需求，准备虚构 mocks/experience.json。只有 B 的共享 Schema 真正提供并验证后，才写“符合共享 Schema”；不能自行宣布 Contract 冻结。
4. Day 06：实现入口→引导→事实审阅→亮点→目标→句子→导出的可点击原型，覆盖未知、空白、模型失败与返回修改。为 2–3 位真实目标用户准备无提示任务脚本与 UI 问题卡模板；未测试则写 0 人，不能伪造通过。

每项交付注明：实现内容、可复现步骤、验证命令与结果、截图、剩余阻塞、交 B/C 的具体问题。事实只能来自用户原话及其确认；团队成果、未知数字、强词不能自动变成个人已确认事实。提交到 feature 分支并开非作者 Review 的 PR，未审不得合并 main。
```

## 2. 给 B 的接口与字段评审提示词

```text
你是 B（后端、数据、API）。请审 A 的 PRODUCT.md、docs/research/field-needs-for-b.md、/try/poc、mocks/experience.json 和 Day 06 原型。给出 22 天内可实现的 API/数据方案，不要把 A 的临时 Mock 当冻结 Contract。

请逐项回复：/api/v1/poc 的请求字段、成功/失败响应、request_id 与错误码；匿名草稿和删除策略；Experience/Answer/Fact/Highlight/Target/ResumeLine 的字段与空值；source_answer_id、candidate→confirmed/invalidated 的状态转移与版本冲突；未知值与团队成果的存储方式；单表 PoC、PostgreSQL 连接失败的可复现结果。请提供共享 Zod Schema、SQL 草案和契约版本，指出 A Mock 的每一项差异。若依赖未完成，明确写“未验证”，不要口头冻结。
```

## 3. 给 C 的提问与 AI 边界评审提示词

```text
你是 C（AI、质量、Eval）。请审 A 的六个访谈问题、问题风险清单、Day 04 PoC 错误文案、Day 05 Mock、Day 06 原型。只使用虚构或获同意且去标识化的材料。

请指出任何诱导“主导/显著提升/获奖/具体数字”的问法；给 Guide、Fact Extractor、Highlight、Requirement、Rewrite 定义输入、结构化候选输出和人工确认点；检查 source ids、unknown、risk_flags、confirmation_required。提供合法、缺来源、团队归属错误、未知数字、非法 JSON 和模型超时样例及预期降级。模型输出只能是候选，不能直接写 confirmed。若 API 调用、Zod 验证或 Eval 未实际运行，明确写未运行和原因。
```

## 4. A 的真实用户测试主持提示词

```text
你是 UX 测试主持人。目标是观察 2–3 位真实目标用户能否在无提示下完成“找到一件事、核实事实、发现不实句并导出”三项任务。先取得参与与匿名原话记录的分别同意；不同意时按范围记录或停止。原始记录、联系信息和录音留在仓库外。

逐人给同一任务，不解释按钮、不暗示正确答案。只记录用户实际点击、停顿、原话（获同意时）、是否能指出来源/未知/团队归属和失败原因。测试结束后清洗身份信息，给每个失败点建 UI 问题卡：匿名编号、步骤、观察、影响、截图、可复现路径、建议与待 B/C 确认字段。不要以合成演练代替真实通过率；如无真实用户，结果写 0 人、Gate 未通过。
```
