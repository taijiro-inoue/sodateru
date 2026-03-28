import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "そだてる | 月齢別おもちゃ・知育グッズ専門店",
  description:
    "0〜6歳のお子さんの月齢に合わせた最適なおもちゃをご提案。専門家監修の発達マップで、科学的根拠に基づいた知育グッズが見つかります。",
  keywords: ["おもちゃ", "知育", "月齢", "0歳", "1歳", "2歳", "発達", "育児"],
  openGraph: {
    title: "そだてる | 月齢別おもちゃ専門店",
    description: "月齢に合わせたおもちゃが見つかるECサイト",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
