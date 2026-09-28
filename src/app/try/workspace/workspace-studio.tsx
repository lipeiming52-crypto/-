"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import demo from "../../../../mocks/experience.json";
import { answerId, emptyDraft, isDraft, questions, risks, type Draft, type Fact, type Ownership, type Stage } from "./workspace-model";

const storageKey = "resume-platform-a-workspace-v1";
const primary = "min-h-11 rounded-xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-45";
const secondary = "min-h-11 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-800 disabled:opacity-45";
const field = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base leading-6 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-100";

type ExerciseState = "normal" | "loading" | "error" | "conflict";

function sceneLabel(scene: string) {
  return ({ course_project: "课程项目", internship: "实习", campus: "校园活动", other: "其他经历" } as Record<string, string>)[scene] ?? "尚未选择";
}

export default function WorkspaceStudio() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [ready, setReady] = useState(false);
  const [exercise, setExercise] = useState<ExerciseState>("normal");
  const [notice, setNotice] = useState("");
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = window.sessionStorage.getItem(storageKey);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (isDraft(parsed)) setDraft(parsed);
        }
      } catch {
        // A broken or unavailable browser store leaves the current in-memory draft editable.
      }
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready || saveFailed) return;
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(draft));
    } catch {
      // Browser storage may be disabled. The warning below is the only save claim.
    }
  }, [draft, ready, saveFailed]);

  function updateDraft(change: (current: Draft) => Draft) {
    setDraft(change);
    setNotice("");
  }

  function loadDemo() {
    const answer = demo.source_answer.text;
    setDraft({
      stage: "facts", scene: "course_project", title: "虚构课程问卷项目",
      answers: [answer, "小组一起汇报，课程成绩属于整个小组。", "具体分数不记得，结果未知。"],
      skipped: [false, false, false], questionIndex: 0, sourceVersion: 1,
      facts: demo.facts.map((item) => ({ id: item.id, text: item.text, sourceAnswerId: answerId(0), ownership: item.ownership as Ownership, status: "candidate", sourceVersion: 1 })),
    });
    setExercise("normal");
    setSaveFailed(false);
    setNotice("已载入虚构样例。候选事实仍须逐条核实；本页不会自动确认为真。");
  }

  function reset() {
    window.sessionStorage.removeItem(storageKey);
    setDraft(emptyDraft());
    setExercise("normal");
    setSaveFailed(false);
    setNotice("本标签页的演练草稿已清除。");
  }

  function changeAnswer(index: number, text: string) {
    updateDraft((current) => ({
      ...current,
      answers: current.answers.map((item, itemIndex) => itemIndex === index ? text : item),
      skipped: current.skipped.map((item, itemIndex) => itemIndex === index ? false : item),
      sourceVersion: current.sourceVersion + 1,
      facts: current.facts.map((fact) => ({ ...fact, status: fact.status === "rejected" ? "rejected" : "candidate" })),
    }));
  }

  function skipAnswer() {
    updateDraft((current) => ({
      ...current,
      answers: current.answers.map((item, index) => index === current.questionIndex ? "" : item),
      skipped: current.skipped.map((item, index) => index === current.questionIndex ? true : item),
      sourceVersion: current.sourceVersion + 1,
      facts: current.facts.map((fact) => ({ ...fact, status: fact.status === "rejected" ? "rejected" : "candidate" })),
      questionIndex: Math.min(questions.length - 1, current.questionIndex + 1),
      stage: current.questionIndex === questions.length - 1 ? "facts" : "guide",
    }));
  }

  function updateFact(id: string, changes: Partial<Fact>) {
    updateDraft((current) => ({ ...current, facts: current.facts.map((fact) => fact.id === id ? { ...fact, ...changes, status: "candidate" } : fact) }));
  }

  function addFact(text = "", sourceAnswerId = answerId(0), ownership: Ownership = "unknown") {
    updateDraft((current) => ({ ...current, facts: [...current.facts, {
      id: `fact-local-${Date.now()}-${current.facts.length}`, text, sourceAnswerId, ownership,
      status: "candidate", sourceVersion: current.sourceVersion,
    }] }));
  }

  function addRiskExamples() {
    updateDraft((current) => ({ ...current, facts: [...current.facts, ...[
      { text: "获得 95 分", sourceAnswerId: answerId(0), ownership: "personal" as Ownership },
      { text: "主导课程项目", sourceAnswerId: answerId(0), ownership: "personal" as Ownership },
      { text: "获得一等奖", sourceAnswerId: answerId(0), ownership: "personal" as Ownership },
      { text: "小组获得课程成绩", sourceAnswerId: answerId(1), ownership: "personal" as Ownership },
    ].map((item, index) => ({ ...item, id: `fact-risk-${Date.now()}-${index}`, status: "candidate" as const, sourceVersion: current.sourceVersion }))] }));
    setNotice("已加入四条虚构风险候选：新数字、主导角色、奖项和团队归属。它们不会自动确认。");
  }

  function confirmFact(fact: Fact) {
    const source = draft.answers[questions.findIndex((_, index) => answerId(index) === fact.sourceAnswerId)] ?? "";
    if (fact.sourceVersion !== draft.sourceVersion) {
      setNotice("原话已修改。请对照新原话，再点击“按当前原话重新核实”。");
      return;
    }
    if (!fact.text.trim() || risks(fact, source).length > 0) {
      setNotice("请先补全事实与来源，并处理醒目的风险提示。候选不会自动变成已确认。");
      return;
    }
    updateDraft((current) => ({ ...current, facts: current.facts.map((item) => item.id === fact.id ? { ...item, status: "confirmed" } : item) }));
    setNotice("这条事实已在前端演练中标记为本人确认；正式确认仍须 B 的服务端状态机。");
  }

  function go(stage: Stage) {
    setDraft((current) => ({ ...current, stage }));
    setNotice("");
  }

  const index = draft.questionIndex;
  const answered = draft.answers.filter((answer) => answer.trim()).length;
  const confirmed = draft.facts.filter((fact) => fact.status === "confirmed" && fact.ownership === "personal").length;

  return <main className="min-h-screen bg-[#f6f5f1] px-4 py-6 text-slate-900 sm:px-8 sm:py-10">
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm"><Link href="/" className="text-slate-600 underline-offset-4 hover:underline">← 返回首页</Link><span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900">A · Day 07–09 前端演练</span></div>
      <header className="mt-7 rounded-3xl bg-slate-900 p-7 text-white sm:p-10">
        <p className="text-xs font-bold tracking-[0.22em] text-teal-300">经历 → 逐题回忆 → 事实核实</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">先保留原话，再确认事实。</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">这是仅供虚构材料演练的前端工作页。草稿只留在当前浏览器标签页，刷新可恢复；尚未接入账户、数据库、AI 或团队共享 API。请勿输入真实身份信息或敏感经历。</p>
      </header>
      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
        <span className="font-semibold text-slate-700">演练草稿：</span><span className="text-slate-600">{!ready ? "正在读取本标签页" : saveFailed ? "模拟保存失败；当前输入仍可编辑，刷新会失去新改动" : "保存在本标签页；刷新可恢复"}</span>
        <button type="button" onClick={loadDemo} className="font-semibold text-teal-800 underline-offset-4 hover:underline">载入虚构样例</button>
        <button type="button" onClick={reset} className="font-semibold text-slate-600 underline-offset-4 hover:underline">清除演练草稿</button>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold tracking-[0.15em] text-slate-500">当前路径</p>
          <ol className="mt-4 space-y-2 text-sm">{([{ id: "experience", label: "选择经历" }, { id: "guide", label: "逐题回忆" }, { id: "facts", label: "核实事实" }] as const).map((step, stepIndex) => <li key={step.id}><button type="button" onClick={() => go(step.id)} className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left ${draft.stage === step.id ? "bg-teal-50 font-semibold text-teal-900" : "text-slate-600 hover:bg-slate-50"}`}><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-xs">{stepIndex + 1}</span>{step.label}</button></li>)}</ol>
          <div className="mt-5 border-t border-slate-100 pt-4 text-xs leading-6 text-slate-500">已答 {answered}/{questions.length} 题 · 已确认个人事实 {confirmed} 条。前端确认不等于服务端入库。</div>
          <div className="mt-5 border-t border-slate-100 pt-4"><label htmlFor="exercise-state" className="text-xs font-semibold text-slate-600">异常状态演练</label><select id="exercise-state" value={exercise} onChange={(event) => { const value = event.target.value as ExerciseState; setExercise(value); setSaveFailed(value === "error"); }} className={`${field} mt-2 text-sm`}><option value="normal">正常</option><option value="loading">加载中</option><option value="error">保存失败</option><option value="conflict">版本冲突</option></select><p className="mt-2 text-xs leading-5 text-slate-500">此控件只模拟页面反馈，不代表真实 API 已返回对应错误。</p></div>
        </aside>
        <section className="min-h-[570px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="workspace-title">
          {exercise === "loading" && <div role="status" className="mb-5 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">正在读取演练数据……当前输入保持可见且可编辑。</div>}
          {exercise === "error" && <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">演练保存失败。当前输入仍在页面中；恢复正常后可再次保存。真实 API 错误码待 B 提供。</div>}
          {exercise === "conflict" && <div role="alert" className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">演练版本冲突：请先对照较新内容，当前输入不会被覆盖。正式冲突处理需要 B 的版本字段和响应。</div>}

          {draft.stage === "experience" && <>
            <p className="text-xs font-bold tracking-[0.16em] text-teal-700">01 / 经历</p><h2 id="workspace-title" className="mt-2 text-2xl font-semibold">选一件具体的事</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">只要能回忆你的实际行动就可以。暂时不必写成简历语言。</p>
            <label htmlFor="scene" className="mt-7 block text-sm font-semibold">经历场景</label><select id="scene" className={`${field} mt-2`} value={draft.scene} onChange={(event) => updateDraft((current) => ({ ...current, scene: event.target.value }))}><option value="">请选择</option><option value="course_project">课程项目</option><option value="internship">实习</option><option value="campus">校园活动</option><option value="other">其他经历</option></select>
            <label htmlFor="experience-title" className="mt-5 block text-sm font-semibold">给自己看的简短标题</label><input id="experience-title" className={`${field} mt-2`} value={draft.title} onChange={(event) => updateDraft((current) => ({ ...current, title: event.target.value }))} maxLength={100} placeholder="例如：课程问卷项目" />
            <div className="mt-8"><button type="button" className={primary} onClick={() => { if (!draft.scene || !draft.title.trim()) { setNotice("请选择场景并写一个简短标题，再继续回忆。"); return; } go("guide"); }}>开始逐题回忆 →</button></div>
          </>}

          {draft.stage === "guide" && <>
            <p className="text-xs font-bold tracking-[0.16em] text-teal-700">02 / 问答 · {index + 1}/{questions.length}</p><h2 id="workspace-title" className="mt-2 text-2xl font-semibold">一次只想一件事</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{sceneLabel(draft.scene)} · {draft.title || "未命名经历"}。答不出来可以跳过；未知结果不要猜测。</p>
            <div className="mt-6 flex gap-2" aria-label="问题进度">{questions.map((question, questionIndex) => <span key={question} className={`h-2 flex-1 rounded-full ${questionIndex <= index ? "bg-teal-700" : "bg-slate-200"}`} />)}</div>
            <label htmlFor="answer" className="mt-8 block text-lg font-semibold">{questions[index]}</label><textarea id="answer" className={`${field} mt-3 min-h-52`} value={draft.answers[index]} onChange={(event) => changeAnswer(index, event.target.value)} maxLength={3000} placeholder="写你记得的原话；不确定可以留空并跳过" />
            {draft.skipped[index] && <p className="mt-2 text-xs text-amber-800">这题标记为跳过，随时可以回来补充。</p>}
            <div className="mt-8 flex flex-wrap gap-3"><button type="button" className={secondary} onClick={() => index === 0 ? go("experience") : updateDraft((current) => ({ ...current, questionIndex: index - 1 }))}>← {index === 0 ? "返回经历" : "上一题"}</button><button type="button" className={secondary} onClick={skipAnswer}>跳过这题</button><button type="button" className={primary} onClick={() => updateDraft((current) => ({ ...current, questionIndex: Math.min(questions.length - 1, index + 1), stage: index === questions.length - 1 ? "facts" : "guide" }))}>{index === questions.length - 1 ? "查看事实 →" : "下一题 →"}</button></div>
          </>}

          {draft.stage === "facts" && <>
            <p className="text-xs font-bold tracking-[0.16em] text-teal-700">03 / 事实核实</p><h2 id="workspace-title" className="mt-2 text-2xl font-semibold">把每条候选放回原话旁边</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">左边是回答，右边是待核实事实。修改原话后，旧确认会失效；缺来源、未证实数字、头衔、奖项和团队归属会醒目提示。</p>
            {answered === 0 && <div role="status" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">目前没有原话。请返回问答补充，或先查看空白状态；没有来源的事实不能确认。</div>}
            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              <div className="space-y-3"><h3 className="text-sm font-semibold">原话与来源编号</h3>{questions.map((question, questionIndex) => <div key={question} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">{answerId(questionIndex)} · {question}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{draft.answers[questionIndex] || <span className="text-slate-400">{draft.skipped[questionIndex] ? "已跳过" : "尚未填写"}</span>}</p><button type="button" onClick={() => updateDraft((current) => ({ ...current, stage: "guide", questionIndex: questionIndex }))} className="mt-3 text-xs font-semibold text-teal-800 underline-offset-4 hover:underline">返回修改这题</button></div>)}</div>
              <div className="space-y-3"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-semibold">候选事实 · {draft.facts.length}</h3><button type="button" onClick={() => addFact()} className="text-xs font-semibold text-teal-800 underline-offset-4 hover:underline">＋ 手动添加</button></div>
                {draft.facts.length === 0 && <div role="status" className="rounded-xl border border-dashed border-slate-300 p-5 text-sm leading-6 text-slate-600">还没有候选事实。可手动添加；模型抽取尚未接入，不会自动生成。</div>}
                {draft.facts.map((fact, factIndex) => {
                  const sourceIndex = questions.findIndex((_, questionIndex) => answerId(questionIndex) === fact.sourceAnswerId);
                  const source = draft.answers[sourceIndex] ?? "";
                  const flags = risks(fact, source);
                  const stale = fact.sourceVersion !== draft.sourceVersion;
                  return <div key={fact.id} className="rounded-xl border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-semibold">候选 {factIndex + 1}</p><span className={`rounded-full px-2 py-1 text-xs font-semibold ${fact.status === "confirmed" ? "bg-emerald-100 text-emerald-900" : fact.status === "rejected" ? "bg-slate-100 text-slate-600" : "bg-amber-100 text-amber-900"}`}>{fact.status === "confirmed" ? "本人已确认（仅演练）" : fact.status === "rejected" ? "已否定" : "待核实"}</span></div>
                    <label htmlFor={`fact-text-${fact.id}`} className="mt-4 block text-xs font-semibold text-slate-600">事实内容</label><textarea id={`fact-text-${fact.id}`} className={`${field} mt-1 min-h-24`} value={fact.text} onChange={(event) => updateFact(fact.id, { text: event.target.value })} placeholder="只保留原话可支持的内容" />
                    <div className="mt-3 grid gap-3 sm:grid-cols-2"><div><label htmlFor={`fact-source-${fact.id}`} className="block text-xs font-semibold text-slate-600">source_answer_id</label><select id={`fact-source-${fact.id}`} className={`${field} mt-1 text-sm`} value={fact.sourceAnswerId} onChange={(event) => updateFact(fact.id, { sourceAnswerId: event.target.value })}><option value="">无来源</option>{questions.map((question, questionIndex) => <option key={question} value={answerId(questionIndex)}>{answerId(questionIndex)}</option>)}</select></div><div><label htmlFor={`fact-owner-${fact.id}`} className="block text-xs font-semibold text-slate-600">归属</label><select id={`fact-owner-${fact.id}`} className={`${field} mt-1 text-sm`} value={fact.ownership} onChange={(event) => updateFact(fact.id, { ownership: event.target.value as Ownership })}><option value="unknown">未知</option><option value="personal">个人行动</option><option value="team">团队成果</option></select></div></div>
                    {stale && <div role="alert" className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs leading-5 text-amber-950">原话版本已变化，旧确认失效。对照当前原话后再重新核实。</div>}
                    {flags.length > 0 && <div role="alert" className="mt-3 rounded-lg border border-rose-300 bg-rose-50 p-3 text-xs leading-5 text-rose-950"><strong>高风险提示：</strong>{flags.join("；")}。请修改候选或来源后再确认。</div>}
                    <div className="mt-4 flex flex-wrap gap-2">{stale && <button type="button" className={secondary} onClick={() => updateFact(fact.id, { sourceVersion: draft.sourceVersion })}>按当前原话重新核实</button>}<button type="button" className={secondary} onClick={() => confirmFact(fact)}>对照原话后确认</button><button type="button" className={secondary} onClick={() => updateDraft((current) => ({ ...current, facts: current.facts.map((item) => item.id === fact.id ? { ...item, status: "rejected" } : item) }))}>这条不准确</button></div>
                  </div>;
                })}
                <button type="button" onClick={addRiskExamples} className="text-xs font-semibold text-rose-800 underline-offset-4 hover:underline">加入四类虚构风险样例</button>
              </div>
            </div>
            <div className="mt-8"><button type="button" onClick={() => updateDraft((current) => ({ ...current, stage: "guide", questionIndex: 0 }))} className={secondary}>← 返回问答修改</button></div>
          </>}
          {notice && <p role="status" aria-live="polite" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">{notice}</p>}
        </section>
      </div>
      <p className="mt-6 text-xs leading-6 text-slate-500">风险提示是 A 的前端演练规则，不能替代 C 的 Fact Validator；“本人已确认”仅在本标签页内生效，不能替代 B 的 owner/version 校验。</p>
    </div>
  </main>;
}
