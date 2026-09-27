import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "留学生履历赋能平台 · 开发基线",
  description: "团队第 1 天环境检查首页",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
