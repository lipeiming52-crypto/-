# 留学生履历赋能平台

这是三人共用的 Day 01 开发基线，并附 A 的 Day 04–06 前端演练页面。Web 健康接口、锁定依赖和本地 PostgreSQL 启动方案已准备；正式数据库、AI 与产品功能尚未接入。

## 统一版本

- Node.js **24.x LTS**（见 `.nvmrc`；Day 01 实测为 24.18.0）
- npm **11.x**（项目记录为 11.16.0）
- 使用 `npm ci` 与同一份 `package-lock.json`，不要混用 pnpm/yarn 生成其他锁文件。
- 本地 PostgreSQL 由 Docker Compose 的 `postgres:16` 提供。若使用系统安装版，也应保持 PostgreSQL 16，并记录差异。

## 从零启动 Web（Windows PowerShell）

```powershell
git clone https://github.com/lipeiming52-crypto/-.git resume-platform
cd resume-platform
node --version
npm --version
Copy-Item .env.example .env
# 编辑 .env：设置只在本机使用的数据库密码，并让 DATABASE_URL 使用相同密码
npm ci
npm run dev
```

访问 <http://localhost:3000>。浏览器应显示“留学生履历赋能平台”和“Web 服务：运行中”。访问 <http://localhost:3000/api/health> 应返回 `status: "ok"`、`service: "web"`、`database: "not_checked"`。此接口只检查 Web 路由，不声称数据库已连通。

若 3000 端口已被占用，开发服务器会提示实际端口；以终端输出为准。停止服务使用 `Ctrl+C`。

## 本地 PostgreSQL（需要 Docker Desktop）

1. 在 `.env` 中换掉示例密码，并同步修改 `DATABASE_URL`。该文件已被 Git 忽略。
2. 运行 `docker compose up -d db`。
3. 运行 `docker compose ps`，确认 `db` 为 healthy。
4. 停止时运行 `docker compose down`。本地数据保存在命名卷中；不要在需要保留数据时删除该卷。

Day 01 尚无正式表结构。后续 Migration 由 B 负责；不要手工建立业务表或把本地数据库复制给队友。当前 A 的 Web 首页不依赖数据库，因此 Docker 尚未安装时可先完成前端启动，但数据库项必须在 `STATUS.md` 标明未验收。

## 日常检查

```powershell
npm run typecheck
npm run lint
npm run build
git status --short
```

提交前确认 `.env`、API Key、真实用户材料不在 Git 中。团队只提交 `.env.example`、虚构样例与迁移文件。测试数据位于 `db/seed/`，目前只是标记清楚的虚构样例，尚无可执行导入脚本。

## 三人协作

- `main` 保持可运行；每人从最新 `main` 新建 `feature/a-*`、`feature/b-*` 或 `feature/c-*` 分支。
- PR 依照 `.github/pull_request_template.md` 填写验证和截图，并由非作者 Review。
- A 负责页面与用户可读性；B 负责仓库、数据库与 API；C 负责 AI、知识与 Eval。公共 Contract、Migration、Prompt 的变更先通知其他两人。
- 每天把可复现的 PASS/FAIL、阻塞和下一优先级写入 `STATUS.md`。Day 01 的三机验收要由 A/B/C 各自从同一远程仓库独立克隆后完成。

## 目录

- `src/app/`：Next.js 页面与 Route Handler。
- `db/seed/`：明确标记为虚构的开发样例；正式导入待 Schema 冻结。
- `docs/ai/`：AI 事实边界，待 C Review。
- `evals/`、`knowledge/`：C 的后续工作目录。
- `docs/setup-a.md`：A 的本机启动记录。

本仓库的 Day 01 状态见 [`STATUS.md`](STATUS.md)。

## Day 04–06 的 A 侧演练入口

启动开发服务后访问 `/try/poc`（提交、模拟超时、错误码和接口占位）以及 `/try/prototype`（入口到导出的可点击原型）。原型只保留当前页面内存状态，刷新会丢失；不要输入敏感材料。它使用 [虚构 Mock](mocks/experience.json)，尚未接上 B 的数据库/API 和 C 的模型，也未通过真实用户测试。

A 的 [PoC 实测](docs/poc/results.md)、[前端字段审查](docs/contracts/frontend-field-review.md)、[内部自测](docs/ux/day06-internal-qa.md)、[用户测试计划](docs/ux/day06-test-plan.md) 与 [专业执行提示词](docs/prompts/day03-06-guidance.md) 记录了可复现路径和待对齐问题。共享 Schema 与三方 Scope Freeze 完成之前，不能把这些演练文档当作团队验收通过。

Day 07–09 A 的 `/try/workspace` 经历/问答/事实工作页及 [交接记录](docs/ux/day07-09-a-handoff.md) 补齐空白、异常、刷新恢复与来源风险演练；目前只用浏览器标签页存储虚构草稿，尚未接入 B/C 正式接口。
