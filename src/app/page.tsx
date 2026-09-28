import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f5f1] px-4 py-8 text-slate-900 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
          <p className="text-sm font-bold tracking-wide text-teal-900">留学生履历赋能平台</p>
          <span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600">A · Day 04–06 演练</span>
        </div>
        <section className="grid gap-8 py-14 sm:py-20 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-teal-700">从经历里找到可信的表达</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">你做过的事，<br />值得被准确讲清楚。</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">先回忆一件具体的事，核实每一步，再写成属于你的简历句。这里展示的是可点击的早期原型，用来检查体验和事实边界。</p>
          </div>
          <div className="rounded-3xl border border-teal-200 bg-teal-50 p-6">
            <p className="text-xs font-bold tracking-wide text-teal-800">当前状态</p>
            <p className="mt-3 text-xl font-semibold">前端原型可演练</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">数据库、模型、共享契约和真实用户测试尚未完成。演示样例均为虚构内容。</p>
          </div>
        </section>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/try/prototype" className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-8">
            <p className="text-xs font-bold tracking-[0.18em] text-teal-700">DAY 06 / 完整路径</p>
            <h2 className="mt-3 text-2xl font-semibold">体验可点击原型 <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">↗</span></h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">入口、引导、事实审阅、亮点、目标、句子与导出，一次走完。包含未知、返回修改和 AI 失败状态。</p>
          </Link>
          <Link href="/try/poc" className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-8">
            <p className="text-xs font-bold tracking-[0.18em] text-teal-700">DAY 04 / 技术演练</p>
            <h2 className="mt-3 text-2xl font-semibold">测试 PoC 输入页 <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">↗</span></h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">对比模拟保存、模拟超时和实际接口反馈，查看 request_id、错误码与耗时。</p>
          </Link>
        </div>
        <p className="mt-8 text-xs leading-6 text-slate-500">Web 服务：运行中。此页面只证明前端可访问；不代表团队 Day 01–06 Gate 已通过。</p>
      </div>
    </main>
  );
}
