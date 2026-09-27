# Day 01 · A 本机环境与启动记录

日期：2026-09-27  
角色：A（产品 / UX / 前端 / 用户测试）  
本次基线：本地 `main` commit `0612b8c`  
结论：**A 本机从全新本地克隆副本启动 Web 为 PASS；团队 Day 01 Gate 仍待远程仓库和 B/C 独立复跑。**

## 本机版本

| 项目 | 实测 |
| --- | --- |
| Windows / PowerShell | Windows 10.0.26200.0 / PowerShell 7.6.5 |
| Git | 2.53.0.windows.3 |
| Node.js | 24.18.0（与仓库 `.nvmrc` 的 24 主版本一致） |
| npm | 11.16.0（与 `packageManager` 一致） |
| VS Code | 命令路径、常见安装位置和应用列表未检出；版本待补记 |
| Docker Desktop | 命令路径、常见安装位置和应用列表未检出；数据库启动待补验 |
| Harness | 手册未指定独立程序及版本；当前以 Codex 执行，并在任务中限定改动文件 |

“未检出”只表示本次检查没有发现，不能断言软件在本机其他路径不存在。

## 从零复跑记录

1. 从本地 `main` commit `0612b8c` 克隆到一个新目录；Git 克隆完成。
2. 从 `.env.example` 建立独立的 `.env`，使用随机生成的本机数据库密码。真实值不写入记录或仓库。
3. 运行 `npm ci`：安装 358 个包，审计报告 0 个漏洞；保留 npm 关于一个可选 postinstall 脚本和 ESLint 版本的提示。
4. 运行 `npm run dev`：Next.js 16.3.6 启动，提示 `http://localhost:3000` Ready。
5. 浏览器打开首页：HTTP 200，标题“留学生履历赋能平台 · 开发基线”，显示“Web 服务：运行中”。截图：[day01-a-home.png](screenshots/day01-a-home.png)。
6. `GET /api/health`：HTTP 200，返回 `{"status":"ok","service":"web","database":"not_checked"}`。
7. `npm run typecheck`：通过。基线目录的 `npm run lint` 和 `npm run build` 也通过。
8. `git check-ignore .env` 返回 `.env`；干净克隆的 `git status --short` 无待提交文件。未向 Git 添加密钥或真实用户材料。

复跑使用本地仓库作为克隆来源；**还未验证 GitHub 远程克隆**。只有远程仓库创建后，A/B/C 才能分别从同一地址再次独立复跑。

## 故障、修复与交接

| 问题 | 处理 / 当前状态 | 交付对象 |
| --- | --- | --- |
| 原本没有 B 的仓库与 README | 用户授权先建立本地共同底座；README、锁文件、环境模板已提交本地 `main` | B 核对仓库与版本方案 |
| 普通沙箱访问 npm 官方仓库被拒绝 | 在允许网络的环境中完成官方模板与锁定依赖安装；全新克隆成功 | B/C 按 README 复跑 |
| VS Code / Docker 未检出 | 前端可独立启动；数据库未验收，不记为 PASS | B 决定并验证 PostgreSQL 方案 |
| GitHub 尚未登录、Chrome 浏览器未开放给本会话 | 远程仓库、PR、main 保护和非作者 Review 尚未完成 | 用户登录 GitHub 后继续；B/C Review |

## 待团队验收

- [ ] 将本地 `main` 发布到三人共用的 GitHub 仓库，并设置 main 保护。
- [ ] A 从 GitHub 远程地址再次克隆、安装、启动。
- [ ] B/C 各自在自己的电脑从同一远程地址完成 clone → install → dev。
- [ ] B 验证本地 PostgreSQL 运行；C Review `docs/ai/BOUNDARIES.md` 文案。
- [ ] 本记录和截图通过 A 的 feature 分支 PR 提交，由非作者 Review 后合并。

团队 Day 01 Gate 应继续记为 **FAIL / 未验收**，直到三机均可独立启动。
