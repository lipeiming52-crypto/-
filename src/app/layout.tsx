import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "留学生履历赋能平台 · 前端原型",
  description: "从经历到可核实简历句的早期交互原型",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
