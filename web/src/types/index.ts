// 発達カテゴリ
export type DevCategory = "motor" | "language" | "cognitive" | "social";

// 発達効果スコア
export type DevEffects = Record<DevCategory, number>;

// 商品
export interface Product {
  id: number;
  name: string;
  emoji: string;
  price: number;
  ageMin: number;
  ageMax: number;
  badges: ProductBadge[];
  effects: DevEffects;
  effectDetails: EffectDetail[];
  howto: string[];
  reviews: Review[];
  affiliateUrl?: string; // Amazon等のアフィリエイトURL
}

export type ProductBadge = "new" | "popular" | "expert" | "sale";

export interface EffectDetail {
  icon: string;
  label: string;
  text: string;
}

export interface Review {
  name: string;
  text: string;
  stars: number;
}

// 発達マップ行
export interface DevMapRow {
  month: string;
  ageMin: number;
  ageMax: number;
  motor: string[];
  language: string[];
  cognitive: string[];
  social: string[];
  toys: { name: string; cat: DevCategory }[];
}

// 月齢バナー
export interface MonthBanner {
  emoji: string;
  title: string;
  milestones: string[];
}

// 子供プロフィール（ローカル保存）
export interface ChildProfile {
  nickname: string;
  gender: "girl" | "boy" | "unset";
  birthYear: number;
  birthMonth: number;
}

// カートアイテム
export interface CartItem {
  product: Product;
  quantity: number;
}
