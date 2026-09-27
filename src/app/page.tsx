export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-16 sm:px-10">
      <p className="mb-4 text-sm font-semibold tracking-wide text-sky-700">
        DAY 01 · 开发环境检查
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        留学生履历赋能平台
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        首页已从本地 Web 服务成功加载。团队正在完成统一仓库、依赖与数据库环境，产品功能将在后续阶段逐步接入。
      </p>
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-emerald-700">Web 服务：运行中</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          这只证明前端可访问；数据库、AI 服务和三台电脑的共同验收需分别检查。
        </p>
      </div>
    </main>
  );
}
