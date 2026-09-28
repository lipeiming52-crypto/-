"use client";

import Link from "next/link";
import { useState } from "react";
import demo from "../../../../mocks/experience.json";

type Step = "entry" | "guide" | "facts" | "highlight" | "target" | "line" | "export";
type FactStatus = "candidate" | "confirmed" | "invalidated";
type Ownership = "personal" | "team" | "unknown";
type Fact = { id: string; text: string; status: FactStatus; ownership: Ownership; sourceAnswerId: string };

const steps: { id: Step; label: string }[] = [
  { id: "entry", label: "入口" },
  { id: "guide", label: "引导" },
  { id: "facts", label: "事实" },
  { id: "highlight", label: "亮点" },
  { id: "target", label: "目标" },
  { id: "line", label: "句子" },
  { id: "export", label: "导出" },
];
const questions = [
  "这件事里，你亲手做了哪一步？",
  "其他人分别做了什么？哪些是团队成果？",
  "你知道哪些结果？不记得或无法确认的部分是什么？",
];

const primaryButton = "min-h-11 rounded-xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-45";
const secondaryButton = "min-h-11 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-700 hover:text-teal-800";
const fieldClass = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base leading-6 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100";

function nextIndex(step: Step) { return steps.findIndex((item) => item.id === step); }

export default function PrototypeStudio() {
  const [step, setStep] = useState<Step>("entry");
  const [sourceText, setSourceText] = useState("");
  const [entryMode, setEntryMode] = useState<"free" | "guided">("free");
  const [answers, setAnswers] = useState(["", "", ""]);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [unsafeDecision, setUnsafeDecision] = useState<"pending" | "invalidated">("pending");
  const [highlight, setHighlight] = useState("");
  const [target, setTarget] = useState("");
  const [line, setLine] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [aiFailed, setAiFailed] = useState(false);
  const [usingDemo, setUsingDemo] = useState(false);
  const [notice, setNotice] = useState("");

  const confirmedPersonal = facts.filter((fact) => fact.status === "confirmed" && fact.ownership === "personal" && fact.text.trim());
  const currentIndex = nextIndex(step);

  function clearDerived() {
    setFacts([]);
    setHighlight("");
    setLine("");
    setReviewed(false);
    setUnsafeDecision("pending");
  }

  function loadDemo() {
    setSourceText(demo.source_answer.text);
    setEntryMode("free");
    setAnswers(["", "", ""]);
    setFacts(demo.facts.map((fact) => ({
      id: fact.id,
      text: fact.text,
      status: "candidate" as FactStatus,
      ownership: fact.ownership as Ownership,
      sourceAnswerId: fact.source_answer_ids[0],
    })));
    setTarget(demo.target);
    setHighlight("");
    setLine("");
    setReviewed(false);
    setUnsafeDecision("pending");
    setUsingDemo(true);
    setNotice("已载入虚构演示样例。所有事实仍须逐条由你确认。");
  }

  function moveTo(next: Step) {
    setNotice("");
    setStep(next);
  }

  function begin() {
    if (!sourceText.trim() && !answers.some((answer) => answer.trim())) {
      setNotice("先写一件事，或载入虚构演示样例。暂时想不起来也可以先看问题提示。");
      if (entryMode === "guided") moveTo("guide");
      return;
    }
    moveTo(entryMode === "guided" ? "guide" : "facts");
    if (facts.length === 0) addBlankFact();
  }

  function addBlankFact() {
    setFacts((current) => [...current, {
      id: `fact-local-${Date.now()}-${current.length}`,
      text: "",
      status: "candidate",
      ownership: "personal",
      sourceAnswerId: "answer-local-001",
    }]);
  }

  function updateFact(id: string, changes: Partial<Fact>) {
    setFacts((current) => current.map((fact) => fact.id === id ? { ...fact, ...changes } : fact));
    setLine("");
    setReviewed(false);
    setNotice("");
  }

  function goFromFacts() {
    if (!confirmedPersonal.length) {
      setNotice("请先逐条核对原话，至少确认一条属于自己的行动。未知结果可以留空。");
      return;
    }
    if (!highlight) setHighlight(confirmedPersonal[0].text);
    moveTo("highlight");
  }

  function goToLine() {
    if (!line) setLine(confirmedPersonal.map((fact) => fact.text.trim()).join("；"));
    setReviewed(false);
    moveTo("line");
  }

  function goToExport() {
    if (!line.trim() || !reviewed || !confirmedPersonal.length) {
      setNotice("请保留至少一条已确认的个人事实，检查句子，并勾选人工核对后再导出。");
      return;
    }
    moveTo("export");
  }

  async function copyLine() {
    try {
      await navigator.clipboard.writeText(line.trim());
      setNotice("已复制最终句子。");
    } catch {
      setNotice("浏览器未允许自动复制，请选中预览文字手动复制。");
    }
  }

  function downloadMarkdown() {
    const content = `# 经本人核对的经历表述\n\n${line.trim()}\n`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "resume-line-demo.md";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Markdown 已下载；内容与预览一致。");
  }

  return (
    <main className="min-h-screen bg-[#f6f5f1] px-4 py-6 text-slate-900 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-sm font-medium text-slate-600 underline-offset-4 hover:underline">← 返回首页</Link>
          <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">Day 06 可点击原型 · 仅本页内存</span>
        </div>

        <header className="mt-7 grid gap-7 rounded-3xl bg-slate-900 px-6 py-8 text-white sm:px-9 sm:py-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-teal-300">从真实行动，到可信表达</p>
            <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">先核实，再写成简历句。</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">按自己的节奏回忆、确认事实并编辑结果。原型只在当前页面内保存状态，刷新后会丢失；请不要输入身份信息或敏感材料。</p>
          </div>
          <button type="button" onClick={() => { setAiFailed((value) => !value); setNotice(""); }} className="min-h-11 rounded-xl border border-slate-500 px-4 py-2 text-sm font-semibold text-white hover:border-teal-300">
            {aiFailed ? "结束 AI 失败演练" : "模拟 AI 不可用"}
          </button>
        </header>

        {aiFailed && <div role="status" className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">AI 暂不可用。你仍可按静态问题回忆、手动确认事实并导出；已写内容不会因此清空。</div>}

        <div className="mt-6 grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-slate-500">主流程</p>
            <ol className="mt-4 space-y-1">
              {steps.map((item, index) => <li key={item.id} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${item.id === step ? "bg-teal-50 font-semibold text-teal-900" : index < currentIndex ? "text-slate-700" : "text-slate-400"}`}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${item.id === step ? "bg-teal-800 text-white" : index < currentIndex ? "bg-slate-200 text-slate-700" : "border border-slate-200"}`}>{index + 1}</span>{item.label}
              </li>)}
            </ol>
            <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-6 text-slate-500">虚构样例用于功能演练，不算真实访谈或用户测试。</p>
          </aside>

          <section className="min-h-[530px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="step-title">
            <p className="text-xs font-bold tracking-[0.15em] text-teal-700">步骤 {currentIndex + 1} / {steps.length}</p>

            {step === "entry" && <>
              <h2 id="step-title" className="mt-2 text-2xl font-semibold">从一件事开始</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">不需要先想“这算不算亮点”。写下你做过的事，或选择逐步问题。我们不会自动替你确认事实。</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" aria-pressed={entryMode === "free"} onClick={() => setEntryMode("free")} className={`${secondaryButton} ${entryMode === "free" ? "border-teal-700 bg-teal-50 text-teal-900" : ""}`}>自由写</button>
                <button type="button" aria-pressed={entryMode === "guided"} onClick={() => setEntryMode("guided")} className={`${secondaryButton} ${entryMode === "guided" ? "border-teal-700 bg-teal-50 text-teal-900" : ""}`}>跟着问题想</button>
              </div>
              <label htmlFor="source-text" className="mt-6 block text-sm font-semibold">你的原话</label>
              <textarea id="source-text" className={`${fieldClass} mt-2 min-h-36`} value={sourceText} maxLength={3000} onChange={(event) => { setSourceText(event.target.value); setUsingDemo(false); clearDerived(); }} placeholder="例如：我在课程项目里整理过问卷数据……" />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button type="button" onClick={loadDemo} className="text-sm font-semibold text-teal-800 underline-offset-4 hover:underline">载入虚构演示样例</button>
                {usingDemo && <span className="text-xs text-amber-800">目前是合成样例</span>}
              </div>
              <div className="mt-8"><button type="button" onClick={begin} className={primaryButton}>继续 {entryMode === "guided" ? "回答问题" : "核实事实"} →</button></div>
            </>}

            {step === "guide" && <>
              <h2 id="step-title" className="mt-2 text-2xl font-semibold">一步一步回忆</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">问题可以跳过。记不清的结果就写“未知”，不要为了填满而猜测。</p>
              <div className="mt-6 space-y-5">{questions.map((question, index) => <div key={question}>
                <label htmlFor={`guide-${index}`} className="block text-sm font-semibold">{index + 1}. {question}</label>
                <textarea id={`guide-${index}`} className={`${fieldClass} mt-2`} rows={3} value={answers[index]} onChange={(event) => { setAnswers((current) => current.map((answer, answerIndex) => answerIndex === index ? event.target.value : answer)); clearDerived(); }} placeholder="可以写‘不知道’或留空" />
              </div>)}</div>
              <div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={() => moveTo("entry")} className={secondaryButton}>← 返回原话</button><button type="button" onClick={() => { if (!sourceText.trim() && !answers.some((answer) => answer.trim())) { setNotice("至少写下一件事或一个具体行动，再进入核实。"); return; } if (!facts.length) addBlankFact(); moveTo("facts"); }} className={primaryButton}>继续核实 →</button></div>
            </>}

            {step === "facts" && <>
              <h2 id="step-title" className="mt-2 text-2xl font-semibold">核实你真正做过的事</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">每条候选都先是“待确认”。对照原话，编辑后再确认；团队结果和未知项不会作为你的个人行动导出。</p>
              <div className="mt-6 rounded-2xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-500">来源 · {usingDemo ? demo.source_answer.id : "answer-local-001"}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-7">{sourceText || answers.filter(Boolean).join("；") || "原话暂为空"}</p>{answers.some(Boolean) && sourceText && <p className="mt-2 text-xs text-slate-500">补充回答：{answers.filter(Boolean).join("；")}</p>}</div>
              <div className="mt-6 space-y-4">{facts.map((fact, index) => <div key={fact.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold">候选事实 {index + 1}</p><span className={`rounded-full px-2 py-1 text-xs ${fact.status === "confirmed" ? "bg-emerald-100 text-emerald-900" : fact.status === "invalidated" ? "bg-slate-100 text-slate-500" : "bg-amber-100 text-amber-900"}`}>{fact.status === "confirmed" ? "本人已确认" : fact.status === "invalidated" ? "已否定" : "待确认"}</span></div>
                <label htmlFor={`fact-${fact.id}`} className="mt-3 block text-xs font-semibold text-slate-500">具体行动或结果</label>
                <input id={`fact-${fact.id}`} className={`${fieldClass} mt-1`} value={fact.text} onChange={(event) => updateFact(fact.id, { text: event.target.value, status: "candidate" })} placeholder="只写你能对照原话核实的部分" />
                <label htmlFor={`ownership-${fact.id}`} className="mt-3 block text-xs font-semibold text-slate-500">归属</label>
                <select id={`ownership-${fact.id}`} className={`${fieldClass} mt-1`} value={fact.ownership} onChange={(event) => updateFact(fact.id, { ownership: event.target.value as Ownership, status: "candidate" })}><option value="personal">我的个人行动</option><option value="team">团队成果</option><option value="unknown">还不确定</option></select>
                <p className="mt-2 text-xs text-slate-500">来源编号：{fact.sourceAnswerId}</p>
                <div className="mt-4 flex flex-wrap gap-2"><button type="button" disabled={!fact.text.trim()} onClick={() => updateFact(fact.id, { status: "confirmed" })} className={secondaryButton}>对照原话后确认</button><button type="button" onClick={() => updateFact(fact.id, { status: "invalidated" })} className={secondaryButton}>这条不准确</button></div>
              </div>)}</div>
              <button type="button" onClick={addBlankFact} className="mt-5 text-sm font-semibold text-teal-800 underline-offset-4 hover:underline">＋ 手动添加一条候选事实</button>
              {usingDemo && <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4"><p className="text-xs font-bold text-rose-800">待判断的虚构候选句</p><p className="mt-1 font-medium">“{demo.unsafe_candidate}”</p><p className="mt-2 text-xs text-slate-600">它不会进入导出。请判断是否有原话依据。</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => setUnsafeDecision("invalidated")} className={secondaryButton}>标记为不实</button><button type="button" onClick={() => setUnsafeDecision("pending")} className={secondaryButton}>保留待核实</button></div><p className="mt-2 text-xs text-slate-600">当前判断：{unsafeDecision === "invalidated" ? "不实，已排除" : "待核实，不能导出"}</p></div>}
              <div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={() => moveTo(entryMode === "guided" ? "guide" : "entry")} className={secondaryButton}>← 返回修改</button><button type="button" onClick={goFromFacts} className={primaryButton}>继续整理亮点 →</button></div>
            </>}

            {step === "highlight" && <>
              <h2 id="step-title" className="mt-2 text-2xl font-semibold">从已确认事实选亮点</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">亮点只是整理角度，不会让未知结果变成确定结果。</p>
              <div className="mt-6 rounded-2xl bg-emerald-50 p-4"><p className="text-xs font-bold text-emerald-900">已确认的个人事实</p><ul className="mt-2 list-inside list-disc space-y-1 text-sm leading-6">{confirmedPersonal.map((fact) => <li key={fact.id}>{fact.text}</li>)}</ul></div>
              <label htmlFor="highlight-text" className="mt-6 block text-sm font-semibold">你想强调什么</label>
              <input id="highlight-text" className={`${fieldClass} mt-2`} value={highlight} onChange={(event) => setHighlight(event.target.value)} placeholder="例如：整理数据并用图表沟通" />
              <p className="mt-2 text-xs text-slate-500">这是手动编辑的原型字段，正式亮点数据结构等待 B/C 契约。</p>
              <div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={() => moveTo("facts")} className={secondaryButton}>← 返回事实</button><button type="button" onClick={() => moveTo("target")} className={primaryButton}>继续设置目标 →</button></div>
            </>}

            {step === "target" && <>
              <h2 id="step-title" className="mt-2 text-2xl font-semibold">这段话准备给谁看？</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">目标帮助你决定表达重点，不会改变已确认的事实。暂时不确定也可以继续。</p>
              <label htmlFor="target-text" className="mt-6 block text-sm font-semibold">求职或申请目标（可选）</label>
              <input id="target-text" className={`${fieldClass} mt-2`} value={target} onChange={(event) => setTarget(event.target.value)} placeholder="例如：数据分析实习；也可以留空" />
              <div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={() => moveTo("highlight")} className={secondaryButton}>← 返回亮点</button><button type="button" onClick={() => { setTarget(""); goToLine(); }} className={secondaryButton}>暂不确定</button><button type="button" onClick={goToLine} className={primaryButton}>继续写句子 →</button></div>
            </>}

            {step === "line" && <>
              <h2 id="step-title" className="mt-2 text-2xl font-semibold">自己把关最后一句</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">初稿只拼接已确认的个人事实。请根据目标手动调整语序，但不要加进无来源的角色、数字或结果。</p>
              <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm"><p className="font-semibold">依据</p><ul className="mt-2 list-inside list-disc space-y-1 leading-6">{confirmedPersonal.map((fact) => <li key={fact.id}>{fact.text} <span className="text-xs text-slate-500">({fact.sourceAnswerId})</span></li>)}</ul>{target && <p className="mt-3 text-xs text-slate-500">表达目标：{target}</p>}</div>
              <label htmlFor="final-line" className="mt-6 block text-sm font-semibold">可编辑的候选简历句</label>
              <textarea id="final-line" className={`${fieldClass} mt-2 min-h-32`} value={line} onChange={(event) => { setLine(event.target.value); setReviewed(false); }} placeholder="从已确认事实开始写" />
              <label className="mt-5 flex items-start gap-3 text-sm leading-6"><input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} className="mt-1 h-4 w-4 accent-teal-800" /><span>我已对照原话核实这句话，没有加入未经确认的数字、角色或成果。</span></label>
              <div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={() => moveTo("target")} className={secondaryButton}>← 返回目标</button><button type="button" onClick={goToExport} className={primaryButton}>预览并导出 →</button></div>
            </>}

            {step === "export" && <>
              <h2 id="step-title" className="mt-2 text-2xl font-semibold">这是你确认过的版本</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">复制或下载后仍可以返回修改。原型不保存到服务器，刷新后会丢失。</p>
              <div className="mt-6 rounded-2xl border border-teal-200 bg-teal-50 p-6"><p className="text-xs font-bold tracking-wide text-teal-900">最终预览</p><p className="mt-3 whitespace-pre-wrap text-lg leading-8">{line.trim()}</p></div>
              <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={copyLine} className={primaryButton}>复制纯文本</button><button type="button" onClick={downloadMarkdown} className={secondaryButton}>下载 Markdown</button></div>
              <div className="mt-8"><button type="button" onClick={() => { setReviewed(false); moveTo("line"); }} className="text-sm font-semibold text-teal-800 underline-offset-4 hover:underline">← 返回修改句子</button></div>
            </>}

            {notice && <p role="status" aria-live="polite" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">{notice}</p>}
          </section>
        </div>
      </div>
    </main>
  );
}
