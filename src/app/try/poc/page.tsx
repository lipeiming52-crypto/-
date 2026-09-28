"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type Mode = "mock-success" | "mock-timeout" | "api";
type Result = {
  kind: "success" | "error";
  title: string;
  detail: string;
  requestId?: string;
  code?: string;
};

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function PocPage() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("mock-success");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);
    setElapsedMs(null);
    const input = text.trim();
    if (!input) {
      setResult({ kind: "error", title: "还没有内容", detail: "请先写一句虚构经历，再试一次。输入会保留。", code: "INPUT_REQUIRED" });
      return;
    }

    setPending(true);
    const started = performance.now();
    try {
      if (mode === "mock-success") {
        await pause(450);
        setResult({
          kind: "success",
          title: "模拟保存成功",
          detail: "这是 A 的本地 Mock；内容未写入数据库。",
          requestId: `mock-${Date.now()}`,
        });
      } else if (mode === "mock-timeout") {
        await pause(850);
        setResult({ kind: "error", title: "模拟请求超时", detail: "输入仍留在页面，可修改后重试。", code: "POC_TIMEOUT" });
      } else {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);
        try {
          const response = await fetch("/api/v1/poc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: input }),
            signal: controller.signal,
          });
          let payload: unknown;
          try {
            payload = await response.json();
          } catch {
            throw new Error("INVALID_RESPONSE");
          }
          if (!response.ok) {
            const errorPayload = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
            const code = typeof errorPayload.code === "string" ? errorPayload.code : "POC_UNAVAILABLE";
            setResult({ kind: "error", title: "接口未完成本次请求", detail: "请检查 B 的接口或切回模拟模式；输入未丢失。", code });
          } else if (payload && typeof payload === "object" && typeof (payload as Record<string, unknown>).request_id === "string") {
            setResult({
              kind: "success",
              title: "接口已响应",
              detail: "仅表示 B 的接口返回了 request_id；数据库与模型仍须分别验收。",
              requestId: (payload as Record<string, string>).request_id,
            });
          } else {
            throw new Error("INVALID_RESPONSE");
          }
        } finally {
          clearTimeout(timer);
        }
      }
    } catch (error) {
      const isTimeout = error instanceof DOMException && error.name === "AbortError";
      setResult({
        kind: "error",
        title: isTimeout ? "接口请求超时" : "接口暂不可用",
        detail: "请稍后重试，或切回模拟模式检查页面。输入仍在。",
        code: isTimeout ? "POC_TIMEOUT" : "POC_UNAVAILABLE",
      });
    } finally {
      setElapsedMs(Math.round(performance.now() - started));
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f5f1] px-4 py-8 text-slate-900 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline">← 返回首页</Link>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-xs font-bold tracking-[0.2em] text-teal-700">DAY 04 / 前端技术演练</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">一次输入，一次可解释的反馈</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">先检查提交、保存和失败时的体验。模拟模式不会保存内容；正式接口由 B 提供，当前未接入时会如实显示错误。</p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="poc-text" className="block text-sm font-semibold">写一件虚构的经历</label>
              <textarea id="poc-text" value={text} onChange={(event) => setText(event.target.value)} rows={5} maxLength={2000} placeholder="例如：我在课程小组中整理了问卷数据。" className="mt-2 w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base leading-7 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100" />
              <p className="mt-1 text-xs text-slate-500">请勿输入真实用户隐私或密钥。错误时输入不会清空。</p>
            </div>
            <div>
              <label htmlFor="poc-mode" className="block text-sm font-semibold">演练方式</label>
              <select id="poc-mode" value={mode} onChange={(event) => setMode(event.target.value as Mode)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-teal-700">
                <option value="mock-success">本地模拟：保存成功</option>
                <option value="mock-timeout">本地模拟：请求超时</option>
                <option value="api">B 的实际接口：/api/v1/poc</option>
              </select>
            </div>
            <button type="submit" disabled={pending} className="min-h-12 w-full rounded-xl bg-teal-800 px-6 py-3 font-semibold text-white transition hover:bg-teal-900 disabled:cursor-wait disabled:opacity-60 sm:w-auto">
              {pending ? "正在提交…" : "提交并查看结果"}
            </button>
          </form>

          <div aria-live="polite" className="mt-8">
            {result ? (
              <div className={`rounded-2xl border p-5 ${result.kind === "success" ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                <p className="font-semibold">{result.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">{result.detail}</p>
                {result.requestId && <p className="mt-3 break-all font-mono text-xs text-slate-700">request_id: {result.requestId}</p>}
                {result.code && <p className="mt-3 font-mono text-xs text-slate-700">error_code: {result.code}</p>}
                {elapsedMs !== null && <p className="mt-1 text-xs text-slate-500">前端往返耗时：{elapsedMs} ms</p>}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-slate-300 px-5 py-6 text-sm text-slate-500">提交后的结果、错误码和耗时会显示在这里。</p>
            )}
          </div>
        </div>
        <p className="mt-5 text-xs leading-6 text-slate-500">本页为 A 的 PoC 前端。它不证明 PostgreSQL 或 AI 链路已跑通。</p>
      </div>
    </main>
  );
}
