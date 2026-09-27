# C 成员 Day 01 本地启动记录

日期：2026-09-27
分支：`feature/c-day1-3`

> 这是当前工作区的复现记录，不代表 C 成员自己的电脑或 A/B 两台电脑已验收。合并前请 C 在自己的电脑独立复跑，并把结果追加到本文件。

## 环境与结果

| 项目 | 结果 |
| --- | --- |
| 克隆 | 从团队 GitHub 仓库克隆到隔离工作目录，成功 |
| Node.js | `v24.19.0`；符合 `package.json` 的 `>=24 <25`，与 README 记载的 `24.18.0` 不完全一致 |
| npm | `11.9.0`；符合 `package.json` 的 `>=11 <12` |
| 依赖安装 | `npm ci` 成功，使用仓库 `package-lock.json` |
| `npm run lint` | PASS |
| `npm run build` | PASS |
| `npm run typecheck` | FAIL：`src/app/layout.tsx:9` 找不到 `LayoutProps`；已定位阻塞，待 A/B 修复，C 未改动其所有权文件 |
| Web + 健康接口 | `npm run dev` 启动成功；本工作区首页可访问，`/api/health` 返回 `status: ok`、`database: not_checked`；不代表团队其他电脑复测 |
| PostgreSQL | 未验收：当前执行环境没有 Docker 命令；Web 健康接口不检查数据库 |

## 复跑命令

```bash
git clone https://github.com/lipeiming52-crypto/-.git resume-platform
cd resume-platform
node --version
npm --version
npm ci
npm run dev
```

另开终端访问 `http://localhost:3000` 与 `http://localhost:3000/api/health`，然后运行：

```bash
npm run lint
npm run typecheck
npm run build
```

`.env` 和 API Key 不需要写入本记录或提交到 Git。若测试失败，保留原始错误并通知文件所有者；不要把单机成功写成三机 Gate PASS。
