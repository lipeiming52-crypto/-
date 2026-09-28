export type Stage = "experience" | "guide" | "facts";
export type Ownership = "personal" | "team" | "unknown";
export type FactStatus = "candidate" | "confirmed" | "rejected";
export type Fact = {
  id: string;
  text: string;
  sourceAnswerId: string;
  ownership: Ownership;
  status: FactStatus;
  sourceVersion: number;
};
export type Draft = {
  stage: Stage;
  scene: string;
  title: string;
  answers: string[];
  skipped: boolean[];
  questionIndex: number;
  sourceVersion: number;
  facts: Fact[];
};

export const questions = [
  "这件事里，你亲手做了哪一步？",
  "其他人分别做了什么？哪些是团队成果？",
  "你知道哪些结果？不记得或无法确认的部分是什么？",
];

export const emptyDraft = (): Draft => ({
  stage: "experience",
  scene: "",
  title: "",
  answers: ["", "", ""],
  skipped: [false, false, false],
  questionIndex: 0,
  sourceVersion: 1,
  facts: [],
});

export const answerId = (index: number) => `answer-local-00${index + 1}`;

export function isDraft(value: unknown): value is Draft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<Draft>;
  return (draft.stage === "experience" || draft.stage === "guide" || draft.stage === "facts") &&
    typeof draft.scene === "string" && typeof draft.title === "string" &&
    Array.isArray(draft.answers) && draft.answers.length === questions.length && draft.answers.every((item) => typeof item === "string") &&
    Array.isArray(draft.skipped) && draft.skipped.length === questions.length && draft.skipped.every((item) => typeof item === "boolean") &&
    typeof draft.questionIndex === "number" && draft.questionIndex >= 0 && draft.questionIndex < questions.length &&
    typeof draft.sourceVersion === "number" && draft.sourceVersion >= 1 && Array.isArray(draft.facts) &&
    draft.facts.every((item) => item && typeof item.id === "string" && typeof item.text === "string" &&
      typeof item.sourceAnswerId === "string" && typeof item.sourceVersion === "number" &&
      (item.ownership === "personal" || item.ownership === "team" || item.ownership === "unknown") &&
      (item.status === "candidate" || item.status === "confirmed" || item.status === "rejected"));
}

export function risks(fact: Fact, source: string): string[] {
  const flags: string[] = [];
  if (!source.trim()) flags.push("缺少原话来源");
  const numbers = fact.text.match(/\d+(?:\.\d+)?%?/g) ?? [];
  if (numbers.some((number) => !source.includes(number))) flags.push("新数字没有原话依据");
  if (/(主导|负责人|领导|leader)/i.test(fact.text) && !/(主导|负责人|领导|leader)/i.test(source)) flags.push("头衔或主导角色未获证实");
  if (/(获奖|一等奖|冠军|优秀奖)/.test(fact.text) && !/(获奖|一等奖|冠军|优秀奖)/.test(source)) flags.push("奖项没有原话依据");
  if (fact.ownership === "personal" && /(我们|团队|小组)/.test(source) && !/我/.test(source)) flags.push("团队成果被写成个人行动");
  return flags;
}
