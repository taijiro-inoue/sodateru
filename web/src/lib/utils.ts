import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// TailwindCSS クラス結合ユーティリティ
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 月齢 → ラベル変換
export function getAgeLabel(month: number): string {
  if (month <= 3) return "0〜3ヶ月";
  if (month <= 6) return "4〜6ヶ月";
  if (month <= 9) return "7〜9ヶ月";
  if (month <= 12) return "10〜12ヶ月";
  if (month <= 18) return "1歳〜1歳半";
  if (month <= 24) return "1歳半〜2歳";
  if (month <= 36) return "2〜3歳";
  if (month <= 48) return "3〜4歳";
  return "4〜6歳";
}

// 誕生日 → 月齢計算
export function calcAgeInMonths(birthYear: number, birthMonth: number): number {
  const now = new Date();
  const months =
    (now.getFullYear() - birthYear) * 12 + (now.getMonth() + 1 - birthMonth);
  return Math.max(0, Math.min(months, 84));
}

// 価格フォーマット
export function formatPrice(price: number): string {
  return `¥${price.toLocaleString("ja-JP")}`;
}

// 発達カテゴリの日本語名
export const DEV_CATEGORY_LABELS = {
  motor: "運動",
  language: "言語",
  cognitive: "認知",
  social: "社会",
} as const;

export const DEV_CATEGORY_COLORS = {
  motor: { bg: "bg-primary-light", text: "text-primary", fill: "bg-primary" },
  language: { bg: "bg-secondary-light", text: "text-secondary", fill: "bg-secondary" },
  cognitive: { bg: "bg-brand-purple-light", text: "text-brand-purple", fill: "bg-brand-purple" },
  social: { bg: "bg-brand-green-light", text: "text-brand-green", fill: "bg-brand-green" },
} as const;
