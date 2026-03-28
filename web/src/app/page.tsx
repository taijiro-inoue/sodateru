"use client";

import { useState, useCallback, useEffect } from "react";
import {
  ShoppingCart, Heart, X, Plus, Minus, Menu, Star,
  ChevronRight, Package, Sparkles, ArrowUp,
} from "lucide-react";
import type { Product, DevCategory, CartItem, DevMapRow } from "@/types";
import { PRODUCTS, DEV_MAP_DATA, MONTH_BANNERS, EXPERT_COMMENTS } from "@/lib/data";
import {
  getAgeLabel, formatPrice, calcAgeInMonths,
  DEV_CATEGORY_LABELS, DEV_CATEGORY_COLORS, cn,
} from "@/lib/utils";

// ===== 月齢に近いバナー・コメントを取得 =====
function getBannerForAge(age: number) {
  const keys = Object.keys(MONTH_BANNERS).map(Number).sort((a, b) => a - b);
  const key = keys.reduce((prev, curr) =>
    Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev
  );
  return MONTH_BANNERS[key];
}
function getExpertComment(age: number) {
  const keys = Object.keys(EXPERT_COMMENTS).map(Number).sort((a, b) => a - b);
  const key = keys.reduce((prev, curr) =>
    Math.abs(curr - age) < Math.abs(prev - age) ? curr : prev
  );
  return EXPERT_COMMENTS[key];
}

// ===== Toast =====
interface ToastItem { id: number; message: string; emoji: string; }

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const showToast = useCallback((message: string, emoji = "✅") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, emoji }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);
  return { toasts, showToast };
}

// ===== Scroll reveal =====
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.06 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ===== StarRating =====
function StarRating({ stars, count }: { stars: number; count?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= stars ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}
        />
      ))}
      {count !== undefined && (
        <span className="text-xs text-gray-400 ml-1">({count})</span>
      )}
    </div>
  );
}

// ===== DevMapAccordion (mobile) =====
function DevMapAccordion({ data, activeMonth }: { data: DevMapRow[]; activeMonth: number }) {
  const activeRow = data.find((r) => activeMonth >= r.ageMin && activeMonth <= r.ageMax);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(activeRow?.month ?? data[0].month);

  useEffect(() => {
    const row = data.find((r) => activeMonth >= r.ageMin && activeMonth <= r.ageMax);
    if (row) setExpandedMonth(row.month);
  }, [activeMonth, data]);

  const catConfig = [
    { key: "motor" as DevCategory, label: "🏃 運動", items: (r: DevMapRow) => r.motor, color: "text-primary bg-primary-light" },
    { key: "language" as DevCategory, label: "💬 言語", items: (r: DevMapRow) => r.language, color: "text-secondary bg-secondary-light" },
    { key: "cognitive" as DevCategory, label: "🧠 認知", items: (r: DevMapRow) => r.cognitive, color: "text-brand-purple bg-brand-purple-light" },
    { key: "social" as DevCategory, label: "🤝 社会", items: (r: DevMapRow) => r.social, color: "text-brand-green bg-brand-green-light" },
  ];

  return (
    <div className="space-y-2">
      {data.map((row) => {
        const isActive = activeMonth >= row.ageMin && activeMonth <= row.ageMax;
        const isExpanded = expandedMonth === row.month;
        return (
          <div
            key={row.month}
            className={cn(
              "rounded-2xl border-2 overflow-hidden transition-all bg-white",
              isActive ? "border-primary shadow-md" : "border-gray-100"
            )}
          >
            <button
              onClick={() => setExpandedMonth(isExpanded ? null : row.month)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left min-h-[56px]"
            >
              <div className="flex items-center gap-2.5">
                {isActive && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                <span className={cn("font-black text-lg", isActive ? "text-primary" : "text-gray-700")}>
                  {row.month}ヶ月
                </span>
                {isActive && (
                  <span className="text-xs font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                    現在
                  </span>
                )}
              </div>
              <ChevronRight
                size={18}
                className={cn("transition-transform text-gray-400 flex-shrink-0", isExpanded && "rotate-90")}
              />
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-50">
                <div className="grid grid-cols-2 gap-2">
                  {catConfig.map(({ label, items, color }) => (
                    <div key={label} className="space-y-1">
                      <span className={cn("inline-block px-2 py-0.5 rounded-md text-[11px] font-bold", color)}>
                        {label}
                      </span>
                      <ul className="space-y-0.5">
                        {items(row).map((item) => (
                          <li key={item} className="text-xs text-gray-600 flex items-start gap-1">
                            <span className="text-gray-300 mt-0.5 flex-shrink-0">▸</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {row.toys.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-gray-400 mb-1.5">おすすめおもちゃ</div>
                    <div className="flex flex-wrap gap-1">
                      {row.toys.map((t) => (
                        <span
                          key={t.name}
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-semibold",
                            t.cat === "motor" ? "bg-primary-light text-primary"
                              : t.cat === "language" ? "bg-secondary-light text-secondary"
                              : t.cat === "cognitive" ? "bg-brand-purple-light text-brand-purple"
                              : "bg-brand-green-light text-brand-green"
                          )}
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ===== ScrollToTop button =====
function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 right-4 sm:bottom-8 sm:right-6 z-40 w-11 h-11 bg-white border-2 border-gray-200 text-gray-500 rounded-full shadow-lg flex items-center justify-center hover:border-primary hover:text-primary hover:-translate-y-0.5 active:scale-95 transition-all"
      aria-label="トップへ戻る"
    >
      <ArrowUp size={18} />
    </button>
  );
}

// ===== Header =====
function Header({
  cartCount, wishCount, onCartOpen, onRegister,
}: {
  cartCount: number; wishCount: number; onCartOpen: () => void; onRegister: () => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b-2 border-primary-light sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer flex-shrink-0 min-w-0"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
              🌱
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                そだてる
              </div>
              <div className="text-[9px] sm:text-[10px] text-gray-400 -mt-0.5 hidden xs:block truncate">
                月齢別おもちゃ・知育グッズ専門店
              </div>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => document.getElementById("section-map")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm font-semibold text-gray-500 hover:text-primary px-3 py-2 rounded-full hover:bg-gray-50 transition-all"
            >
              📊 発達マップ
            </button>
            <button
              onClick={() => document.getElementById("section-shop")?.scrollIntoView({ behavior: "smooth" })}
              className="text-sm font-semibold text-gray-500 hover:text-primary px-3 py-2 rounded-full hover:bg-gray-50 transition-all"
            >
              🛍 お店
            </button>
            <button
              onClick={onRegister}
              className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-primary-dark transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 ml-1"
            >
              👶 お子さんを登録
            </button>
            <button className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
              <Heart size={20} className={wishCount > 0 ? "fill-primary text-primary" : "text-gray-400"} />
              {wishCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishCount}
                </span>
              )}
            </button>
            <button
              onClick={onCartOpen}
              className="relative bg-accent-light text-gray-800 text-sm font-bold px-4 py-2 rounded-full hover:bg-accent transition-all flex items-center gap-1.5"
            >
              <ShoppingCart size={16} />
              カート
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile right actions */}
          <div className="flex md:hidden items-center gap-0.5">
            <button
              onClick={onCartOpen}
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart size={20} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
            >
              <Menu size={20} className="text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl flex flex-col animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="font-black text-base bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                メニュー
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {[
                { label: "🔍 月齢から探す", id: "section-age-input" },
                { label: "📊 発達マップ", id: "section-map" },
                { label: "🛍 商品を見る", id: "section-shop" },
              ].map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 150);
                  }}
                  className="w-full text-left px-4 py-3.5 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 hover:text-primary transition-all flex items-center justify-between min-h-[52px]"
                >
                  {label}
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              ))}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => { setMobileMenuOpen(false); onRegister(); }}
                  className="w-full bg-gradient-to-r from-primary to-orange-400 text-white font-bold py-3.5 px-4 rounded-xl shadow-md min-h-[52px]"
                >
                  👶 お子さんを登録
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

// ===== DevEffectBars =====
function DevEffectBars({ effects }: { effects: Product["effects"] }) {
  const cats: DevCategory[] = ["motor", "language", "cognitive", "social"];
  return (
    <div className="space-y-2">
      {cats.map((cat) => (
        <div key={cat} className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 w-8 flex-shrink-0">{DEV_CATEGORY_LABELS[cat]}</span>
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", DEV_CATEGORY_COLORS[cat].fill)}
              style={{ width: `${effects[cat]}%` }}
            />
          </div>
          <span className="text-[11px] text-gray-400 w-6 text-right">{effects[cat]}</span>
        </div>
      ))}
    </div>
  );
}

// ===== ProductCard =====
function ProductCard({
  product, onOpen, onAddCart, wished, onWishToggle,
}: {
  product: Product; onOpen: () => void; onAddCart: () => void;
  wished: boolean; onWishToggle: () => void;
}) {
  const avgStars = product.reviews.length > 0
    ? Math.round(product.reviews.reduce((s, r) => s + r.stars, 0) / product.reviews.length)
    : 5;

  return (
    <div
      onClick={onOpen}
      className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary-light group"
    >
      {/* Image area */}
      <div className="relative h-44 sm:h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        <span className="text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-300 select-none">
          {product.emoji}
        </span>
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.badges.includes("new") && <span className="badge bg-primary text-white">NEW</span>}
          {product.badges.includes("popular") && <span className="badge bg-accent text-gray-800">人気</span>}
          {product.badges.includes("expert") && <span className="badge bg-brand-purple text-white">専門家推薦</span>}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onWishToggle(); }}
          className="absolute top-2 right-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="ウィッシュリスト"
        >
          <span className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm">
            <Heart size={16} className={wished ? "fill-primary text-primary" : "text-gray-300"} />
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4">
        <div className="text-xs font-bold text-primary mb-1">対象：{product.ageMin}〜{product.ageMax}ヶ月</div>
        <div className="font-bold text-gray-800 mb-1.5 leading-snug text-sm sm:text-base">{product.name}</div>
        <div className="mb-3">
          <StarRating stars={avgStars} count={product.reviews.length} />
        </div>
        <DevEffectBars effects={product.effects} />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div>
            <div className="text-lg sm:text-xl font-black">{formatPrice(product.price)}</div>
            <div className="text-[11px] text-gray-400">税込・送料無料</div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onAddCart(); }}
            className="bg-primary text-white text-sm font-bold px-3.5 py-2.5 rounded-lg hover:bg-primary-dark hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 min-h-[44px]"
          >
            <Plus size={14} />
            カート
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== ProductModal (bottom sheet on mobile) =====
function ProductModal({
  product, onClose, onAddCart,
}: {
  product: Product | null; onClose: () => void; onAddCart: (id: number) => void;
}) {
  const [tab, setTab] = useState<"effects" | "howto" | "review">("effects");
  if (!product) return null;

  const avgStars = product.reviews.length > 0
    ? Math.round(product.reviews.reduce((s, r) => s + r.stars, 0) / product.reviews.length)
    : 5;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-xl sm:mx-auto rounded-t-3xl sm:rounded-3xl max-h-[92svh] overflow-y-auto shadow-2xl animate-sheet-up sm:animate-modal-in">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Close (desktop) */}
        <div className="hidden sm:flex p-5 pb-0 justify-end">
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary-light transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Mobile header bar */}
        <div className="flex items-center justify-between px-5 py-3 sm:hidden border-b border-gray-100">
          <h2 className="font-black text-base leading-snug flex-1 pr-2">{product.name}</h2>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 sm:px-7 pb-6 sm:pb-8">
          {/* Emoji hero — shorter on mobile */}
          <div className="h-36 sm:h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-7xl sm:text-8xl my-4 select-none">
            {product.emoji}
          </div>

          {/* Title & meta */}
          <h2 className="hidden sm:block text-2xl font-black leading-snug mb-1">{product.name}</h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            <span className="text-xs sm:text-sm font-bold text-primary bg-primary-light px-3 py-1 rounded-full">
              対象：{product.ageMin}〜{product.ageMax}ヶ月
            </span>
            <StarRating stars={avgStars} count={product.reviews.length} />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-50 p-1 rounded-xl mb-4 sm:mb-5">
            {(["effects", "howto", "review"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all min-h-[44px]",
                  tab === t ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
                )}
              >
                {t === "effects" ? "🧪 発達効果" : t === "howto" ? "🎮 遊び方" : `💬 口コミ（${product.reviews.length}）`}
              </button>
            ))}
          </div>

          {/* Tab: effects */}
          {tab === "effects" && (
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4 mb-2">
                <div className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">発達スコア</div>
                <DevEffectBars effects={product.effects} />
              </div>
              {product.effectDetails.map((e, i) => (
                <div key={i} className="flex gap-3 p-3.5 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                    {e.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">{e.label}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{e.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab: howto */}
          {tab === "howto" && (
            <div className="space-y-3">
              {product.howto.map((h, i) => (
                <div key={i} className="flex gap-3 p-3.5 bg-gray-50 rounded-xl items-start">
                  <div className="w-7 h-7 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{h}</p>
                </div>
              ))}
            </div>
          )}

          {/* Tab: review */}
          {tab === "review" && (
            <div className="space-y-3">
              {product.reviews.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <div className="text-4xl mb-3">💬</div>
                  <div className="font-semibold text-gray-500 mb-1">まだ口コミがありません</div>
                  <div className="text-sm">最初のレビューを投稿してみましょう</div>
                </div>
              ) : (
                product.reviews.map((r, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold">{r.name}</span>
                      <StarRating stars={r.stars} />
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{r.text}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* CTA footer */}
          <div className="flex items-center justify-between pt-5 mt-5 border-t border-gray-100 safe-bottom">
            <div>
              <div className="text-2xl sm:text-3xl font-black">
                {formatPrice(product.price)}
                <span className="text-xs sm:text-sm font-normal text-gray-400">（税込）</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">送料無料 ｜ 翌日配送対応</div>
            </div>
            <button
              onClick={() => { onAddCart(product.id); onClose(); }}
              className="bg-gradient-to-r from-primary to-orange-400 text-white font-bold px-5 sm:px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2 min-h-[52px]"
            >
              <ShoppingCart size={16} />
              <span className="whitespace-nowrap">カートに追加</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== ChildRegisterModal (bottom sheet on mobile) =====
function ChildRegisterModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"girl" | "boy" | "unset" | null>(null);
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [email, setEmail] = useState("");
  const ageMonths = birthYear && birthMonth ? calcAgeInMonths(Number(birthYear), Number(birthMonth)) : null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-md sm:mx-auto rounded-t-3xl sm:rounded-3xl shadow-2xl animate-sheet-up sm:animate-modal-in max-h-[95svh] overflow-y-auto">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-5 sm:px-7 py-3 sm:py-5">
          <div /> {/* spacer */}
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-primary-light transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 sm:px-7 pb-6 sm:pb-7">
          {/* Progress */}
          <div className="flex gap-2 mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn("flex-1 h-1.5 rounded-full transition-all duration-500", s <= step ? "bg-primary" : "bg-gray-200")}
              />
            ))}
          </div>
          <div className="text-xs text-gray-400 mb-5">ステップ {step} / 3</div>

          {step === 1 && (
            <div>
              <h2 className="text-lg sm:text-xl font-black mb-1">👶 お子さんの情報を教えてください</h2>
              <p className="text-sm text-gray-400 mb-5">月齢に合ったおもちゃをレコメンドするために使用します</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-600 block mb-1.5">ニックネーム</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例：はるちゃん"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-base focus:border-primary outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-600 block mb-1.5">性別（任意）</label>
                  <div className="flex gap-2">
                    {([["girl", "👧 女の子"], ["boy", "👦 男の子"], ["unset", "🌈 未設定"]] as const).map(([val, label]) => (
                      <button
                        key={val}
                        onClick={() => setGender(val)}
                        className={cn(
                          "flex-1 min-h-[48px] border-2 rounded-xl text-sm font-semibold transition-all",
                          gender === val ? "border-primary bg-primary-light text-primary" : "border-gray-200 text-gray-500 hover:border-primary hover:text-primary"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-600 block mb-1.5">誕生日</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      placeholder="2024（年）"
                      className="px-4 py-3.5 border-2 border-gray-200 rounded-xl text-base focus:border-primary outline-none transition-colors"
                    />
                    <input
                      type="number"
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      placeholder="3（月）"
                      min={1}
                      max={12}
                      className="px-4 py-3.5 border-2 border-gray-200 rounded-xl text-base focus:border-primary outline-none transition-colors"
                    />
                  </div>
                  {ageMonths !== null && (
                    <div className="mt-2 bg-primary-light text-primary text-sm font-bold text-center py-2.5 rounded-xl animate-toast-in">
                      現在の月齢：{ageMonths}ヶ月（{Math.floor(ageMonths / 12)}歳{ageMonths % 12}ヶ月）
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full mt-5 bg-gradient-to-r from-primary to-orange-400 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all min-h-[52px]"
              >
                次へ →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg sm:text-xl font-black mb-1">📧 通知を受け取る設定</h2>
              <p className="text-sm text-gray-400 mb-5">月齢更新のお知らせやおすすめ情報をお届けします</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-600 block mb-1.5">メールアドレス</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-base focus:border-primary outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  {[["🔔 月齢更新のお知らせ", true], ["📦 おすすめ商品の案内", true], ["🧠 専門家の発達コラム", false]].map(([label, defaultChecked], i) => (
                    <label key={i} className="flex items-center gap-3 text-sm cursor-pointer p-3.5 rounded-xl hover:bg-gray-50 transition-colors min-h-[52px]">
                      <input type="checkbox" defaultChecked={defaultChecked as boolean} className="w-5 h-5 accent-primary flex-shrink-0" />
                      <span className="text-gray-700">{label as string}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 min-h-[52px] border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-gray-300 transition-colors"
                >
                  ← 戻る
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-[2] min-h-[52px] bg-gradient-to-r from-primary to-orange-400 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  登録する 🎉
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-xl font-black mb-2">{name || "お子さん"}の登録完了！</h2>
              <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                月齢に合わせたおすすめをご用意しました。<br />
                月齢が変わるたびに最新情報をお届けします。
              </p>
              {ageMonths !== null && (
                <div className="bg-primary-light rounded-xl p-4 mb-5">
                  <div className="text-xs font-bold text-primary mb-1">🌟 今月のおすすめ（{ageMonths}ヶ月）</div>
                  <div className="font-bold text-gray-800 text-sm">{getAgeLabel(ageMonths)}向けのおもちゃ</div>
                </div>
              )}
              <button
                onClick={() => { onClose(); document.getElementById("section-shop")?.scrollIntoView({ behavior: "smooth" }); }}
                className="w-full bg-gradient-to-r from-primary to-orange-400 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all min-h-[52px]"
              >
                🛍 おすすめを見る
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== CartDrawer =====
function CartDrawer({
  cart, onClose, onRemove, onQuantityChange,
}: {
  cart: CartItem[];
  onClose: () => void;
  onRemove: (id: number) => void;
  onQuantityChange: (id: number, qty: number) => void;
}) {
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const totalCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full sm:max-w-sm bg-white shadow-2xl flex flex-col h-full animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
          <div className="font-black text-lg flex items-center gap-2">
            <ShoppingCart size={20} className="text-primary" />
            カート
            {totalCount > 0 && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalCount}点
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5 sm:px-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <Package size={52} className="text-gray-200 mb-4" />
              <div className="font-bold text-gray-500 mb-1.5">カートは空です</div>
              <div className="text-sm text-gray-400 mb-6">おすすめ商品を見てみましょう</div>
              <button
                onClick={() => {
                  onClose();
                  document.getElementById("section-shop")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-primary text-white font-bold px-5 py-3 rounded-xl text-sm hover:bg-primary-dark transition-colors flex items-center gap-1.5 min-h-[48px]"
              >
                <Sparkles size={14} />
                商品を見る
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 p-3.5 bg-gray-50 rounded-xl">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm select-none">
                    {item.product.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-800 leading-snug mb-1 truncate">
                      {item.product.name}
                    </div>
                    <div className="text-sm font-black text-primary mb-2">
                      {formatPrice(item.product.price)}
                    </div>
                    {/* Quantity */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onQuantityChange(item.product.id, item.quantity - 1)}
                        className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full bg-white border border-gray-200 hover:border-primary hover:text-primary transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
                        className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full bg-white border border-gray-200 hover:border-primary hover:text-primary transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(item.product.id)}
                    className="min-w-[36px] min-h-[36px] flex items-center justify-center self-start text-gray-300 hover:text-primary transition-colors mt-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 px-5 sm:px-6 py-5 space-y-3 bg-white safe-bottom">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-gray-500">小計（{totalCount}点）</span>
              <span className="text-2xl font-black">{formatPrice(subtotal)}</span>
            </div>
            <div className="text-xs text-gray-400 text-right -mt-1">送料無料・税込</div>
            <button className="w-full bg-gradient-to-r from-primary to-orange-400 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[52px]">
              レジに進む
              <ChevronRight size={16} />
            </button>
            <button
              onClick={onClose}
              className="w-full text-gray-400 text-sm hover:text-gray-600 transition-colors py-2 min-h-[44px]"
            >
              買い物を続ける
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== ToastContainer =====
function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 sm:bottom-6 z-[60] flex flex-col gap-2 items-center sm:items-end pointer-events-none w-[calc(100%-2rem)] sm:w-auto max-w-xs">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-gray-900 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-toast-in w-full sm:w-auto"
        >
          <span className="text-base">{toast.emoji}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

// ===== EmptyProducts =====
function EmptyProducts({ age, onReset }: { age: number; onReset: () => void }) {
  return (
    <div className="col-span-full py-14 text-center px-4">
      <div className="text-5xl mb-4 select-none">🔍</div>
      <h3 className="text-base sm:text-lg font-black text-gray-700 mb-2">
        {age}ヶ月対応の商品が見つかりませんでした
      </h3>
      <p className="text-sm text-gray-400 mb-7 leading-relaxed">
        この月齢に直接対応した商品はありませんが、<br />
        近い月齢のおすすめ商品もご覧ください
      </p>
      <button
        onClick={onReset}
        className="bg-primary text-white font-bold px-6 py-3.5 rounded-xl shadow-md hover:bg-primary-dark hover:-translate-y-0.5 active:scale-95 transition-all inline-flex items-center gap-2 min-h-[52px]"
      >
        <Sparkles size={16} />
        すべての商品を見る
      </button>
    </div>
  );
}

// ===== MAIN PAGE =====
const MONTH_RANGES = [
  { label: "0〜3ヶ月", val: 2 }, { label: "4〜6ヶ月", val: 5 },
  { label: "7〜9ヶ月", val: 8 }, { label: "10〜12ヶ月", val: 11 },
  { label: "1歳〜1歳半", val: 15 }, { label: "1歳半〜2歳", val: 21 },
  { label: "2〜3歳", val: 30 }, { label: "3〜4歳", val: 42 }, { label: "4〜6歳", val: 60 },
];

export default function Home() {
  const [age, setAge] = useState(12);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(PRODUCTS);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [activeMonth, setActiveMonth] = useState(11);
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [inputMode, setInputMode] = useState<"slider" | "birthday" | "category">("slider");

  const { toasts, showToast } = useToast();
  useScrollReveal();

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const banner = getBannerForAge(activeMonth);
  const expertComment = getExpertComment(activeMonth);

  // Prevent body scroll when overlays open
  useEffect(() => {
    const anyOpen = showCart || !!selectedProduct || showRegister;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showCart, selectedProduct, showRegister]);

  const addToCart = useCallback((id: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === id);
      if (existing) return prev.map((i) => i.product.id === id ? { ...i, quantity: i.quantity + 1 } : i);
      const product = PRODUCTS.find((p) => p.id === id)!;
      return [...prev, { product, quantity: 1 }];
    });
    const product = PRODUCTS.find((p) => p.id === id);
    if (product) showToast(`${product.name} をカートに追加しました`, "🛒");
  }, [showToast]);

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.product.id !== id));
    } else {
      setCart((prev) => prev.map((i) => i.product.id === id ? { ...i, quantity: qty } : i));
    }
  }, []);

  const toggleWishlist = useCallback((id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        showToast("ウィッシュリストから削除しました", "💔");
      } else {
        next.add(id);
        showToast("ウィッシュリストに追加しました", "❤️");
      }
      return next;
    });
  }, [showToast]);

  const searchByAge = useCallback(() => {
    const filtered = PRODUCTS.filter((p) => age >= p.ageMin && age <= p.ageMax);
    setFilteredProducts(filtered);
    setIsFiltered(true);
    setActiveMonth(age);
    document.getElementById("section-shop")?.scrollIntoView({ behavior: "smooth" });
  }, [age]);

  const resetFilter = useCallback(() => {
    setFilteredProducts(PRODUCTS);
    setIsFiltered(false);
  }, []);

  const selectMonthRange = useCallback((val: number) => {
    setActiveMonth(val);
    setAge(val);
    const filtered = PRODUCTS.filter((p) => val >= p.ageMin && val <= p.ageMax);
    setFilteredProducts(filtered);
    setIsFiltered(true);
  }, []);

  const calcedAge = birthYear && birthMonth ? calcAgeInMonths(Number(birthYear), Number(birthMonth)) : null;

  return (
    <>
      <Header
        cartCount={cartCount}
        wishCount={wishlist.size}
        onCartOpen={() => setShowCart(true)}
        onRegister={() => setShowRegister(true)}
      />

      {/* ===== HERO ===== */}
      <section className="bg-gradient-to-br from-rose-50 via-amber-50 to-teal-50 min-h-[85svh] flex items-center justify-center px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 animate-float pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 sm:w-96 h-72 sm:h-96 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2 animate-float-slow pointer-events-none" />

        <div className="relative max-w-2xl mx-auto py-16 sm:py-20">
          <span className="inline-block bg-white border border-primary text-primary text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-4 sm:mb-5">
            🌱 専門家監修・0〜6歳対応
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-4 sm:mb-5">
            お子さんの<br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">月齢</span>に合わせた<br />
            おもちゃが見つかる
          </h1>
          <p className="text-gray-500 text-base sm:text-lg mb-8 sm:mb-10 px-2">
            発達段階を科学的に分析。今この瞬間に必要な遊びと、脳の成長を促すおもちゃをご提案します。
          </p>
          <button
            onClick={() => document.getElementById("section-age-input")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-orange-400 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all text-base sm:text-lg min-h-[56px]"
          >
            🔍 月齢から探す
            <ChevronRight size={20} />
          </button>
          <p className="text-xs text-gray-400 mt-4">1,200点以上の商品から・15名の専門家監修</p>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <div className="bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[["1,200+", "取扱商品数"], ["73", "月齢段階"], ["15名", "専門家監修"], ["98%", "購入者満足度"]].map(([num, label]) => (
            <div key={label} className="text-center py-1">
              <div className="text-xl sm:text-2xl font-black text-primary">{num}</div>
              <div className="text-xs text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== そだてるとは？ ===== */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 reveal">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1">
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
              What is そだてる？
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-5 leading-snug">
              月齢別・発達科学に基づいた、おもちゃ選びの新しいカタチ。
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-4">
              子どもの発達には「旬の時期」があります。そだてるは、小児科医・作業療法士・言語聴覚士など15名の専門家と共に、73段階の月齢データベースを構築。お子さんの「今」に最もフィットするおもちゃをご提案します。
            </p>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              運動・言語・認知・社会性の4領域を科学的にスコア化し、発達効果が一目でわかる。毎日のあそびを、成長のチャンスに変えましょう。
            </p>
          </div>
          <div className="w-full md:w-72 grid grid-cols-2 gap-3">
            {[
              { emoji: "🧠", label: "発達科学", sub: "73段階の月齢データ" },
              { emoji: "👩‍⚕️", label: "専門家監修", sub: "小児科医・療法士が監修" },
              { emoji: "📊", label: "効果が見える", sub: "4領域の発達スコア" },
              { emoji: "🛒", label: "Amazon連携", sub: "すぐ購入できる" },
            ].map(({ emoji, label, sub }) => (
              <div key={label} className="bg-gray-50 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="font-bold text-sm text-gray-800 mb-0.5">{label}</div>
                <div className="text-xs text-gray-400">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 選ばれる理由 ===== */}
      <section className="bg-gray-50 py-16 sm:py-20 px-4 sm:px-6 reveal">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Reasons</div>
            <h2 className="text-2xl sm:text-3xl font-black">そだてるが選ばれる4つの理由</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { num: "01", emoji: "🎯", title: "月齢ぴったりの提案", desc: "73段階の月齢データベースで、お子さんの今にフィットしたおもちゃだけをご提案します。" },
              { num: "02", emoji: "📊", title: "発達効果が見える", desc: "運動・言語・認知・社会性の4領域をスコア化。効果が数字で一目でわかります。" },
              { num: "03", emoji: "👩‍⚕️", title: "専門家監修", desc: "小児科医・作業療法士・言語聴覚士など15名の専門家がすべての商品を監修しています。" },
              { num: "04", emoji: "🛒", title: "Amazonで即購入", desc: "在庫リスクなし。そのままAmazonへ。翌日配送でお子さんの手元に届きます。" },
            ].map(({ num, emoji, title, desc }) => (
              <div key={num} className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="text-4xl font-black text-gray-100 absolute top-4 right-4 select-none leading-none">{num}</div>
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-black text-base mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 利用シーン ===== */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 reveal">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Scene</div>
            <h2 className="text-2xl sm:text-3xl font-black">こんな場面で使われています</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                gradient: "from-rose-100 to-pink-50",
                emoji: "🎁",
                title: "出産祝いに",
                desc: "生まれた月齢を入力するだけで、その子に合ったおもちゃをプレゼントできます。贈り物に迷ったときにもぴったり。",
              },
              {
                gradient: "from-amber-100 to-yellow-50",
                emoji: "🎂",
                title: "誕生日プレゼントに",
                desc: "誕生日の月齢に合わせて選ぶから、「もう使えない」「早すぎた」を防げます。発達を促す最高のギフトを。",
              },
              {
                gradient: "from-teal-100 to-emerald-50",
                emoji: "🌱",
                title: "自分の子どものために",
                desc: "「うちの子、発達は大丈夫？」そんな疑問を解消。月齢別の発達マップで今の段階を確認しながら選べます。",
              },
            ].map(({ gradient, emoji, title, desc }) => (
              <div key={title} className={`bg-gradient-to-br ${gradient} rounded-2xl p-7 text-center`}>
                <div className="text-5xl mb-4">{emoji}</div>
                <h3 className="font-black text-lg mb-3">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 月齢入力 ===== */}
      <section id="section-age-input" className="bg-gradient-to-br from-rose-50 via-teal-50 to-violet-50 py-16 sm:py-20 px-4 sm:px-6 reveal">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Find Toys</div>
            <h2 className="text-2xl sm:text-3xl font-black">お子さんの月齢を入力して、ぴったりのおもちゃを探す</h2>
          </div>

          {/* 月齢入力カード */}
          <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-8 max-w-lg mx-auto">
            <h3 className="font-bold text-base sm:text-lg mb-4 sm:mb-5">👶 お子さんの月齢を教えてください</h3>

            {/* Mode tabs */}
            <div className="flex bg-gray-50 p-1 rounded-xl mb-5 sm:mb-6">
              {(["slider", "birthday", "category"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setInputMode(mode)}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all min-h-[44px]",
                    inputMode === mode ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-500"
                  )}
                >
                  {mode === "slider" ? "月齢で探す" : mode === "birthday" ? "誕生日から" : "発達領域から"}
                </button>
              ))}
            </div>

            {/* Slider mode */}
            {inputMode === "slider" && (
              <div className="mb-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">現在の月齢</span>
                  <span>
                    <span className="text-3xl sm:text-4xl font-black text-primary">{age}</span>
                    <span className="text-sm sm:text-base text-gray-500 font-semibold"> ヶ月</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={72}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #FF6B6B ${(age / 72) * 100}%, #E2E8F0 ${(age / 72) * 100}%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  {["0", "1歳", "2歳", "3歳", "4歳", "5歳", "6歳"].map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </div>
                <div className="mt-3 text-center">
                  <span className="bg-primary-light text-primary text-xs font-bold px-3 py-1.5 rounded-full">
                    {getAgeLabel(age)}
                  </span>
                </div>
              </div>
            )}

            {/* Birthday mode */}
            {inputMode === "birthday" && (
              <div className="mb-5">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">誕生年</label>
                    <input
                      type="number"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      placeholder="2024"
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-base focus:border-primary outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">月</label>
                    <input
                      type="number"
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      placeholder="3"
                      min={1}
                      max={12}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-base focus:border-primary outline-none transition-colors"
                    />
                  </div>
                </div>
                {calcedAge !== null && (
                  <div className="bg-primary-light text-primary text-sm font-bold text-center py-2.5 rounded-xl animate-toast-in">
                    現在の月齢：{calcedAge}ヶ月（{Math.floor(calcedAge / 12)}歳{calcedAge % 12}ヶ月）
                  </div>
                )}
              </div>
            )}

            {/* Category mode */}
            {inputMode === "category" && (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-5">
                {(["motor", "language", "cognitive", "social"] as DevCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      const sorted = [...PRODUCTS].sort((a, b) => b.effects[cat] - a.effects[cat]);
                      setFilteredProducts(sorted);
                      setIsFiltered(false);
                      document.getElementById("section-shop")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={cn(
                      "py-3 px-2 border-2 rounded-xl text-xs sm:text-sm font-bold transition-all hover:-translate-y-0.5 active:scale-95 min-h-[56px]",
                      DEV_CATEGORY_COLORS[cat].bg, DEV_CATEGORY_COLORS[cat].text,
                      "border-transparent hover:border-current"
                    )}
                  >
                    {cat === "motor" ? "🏃 運動・体の発達"
                      : cat === "language" ? "💬 言語・コミュニケーション"
                      : cat === "cognitive" ? "🧠 認知・思考力"
                      : "🤝 社会性・情緒"}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                if (inputMode === "birthday" && calcedAge !== null) {
                  setAge(calcedAge);
                  setActiveMonth(calcedAge);
                }
                searchByAge();
              }}
              className="w-full bg-gradient-to-r from-primary to-orange-400 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all min-h-[52px]"
            >
              🔍 この月齢のおすすめを見る
            </button>
          </div>
        </div>
      </section>

      {/* ===== 3ステップで見つかる ===== */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 reveal">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">How to Use</div>
            <h2 className="text-2xl sm:text-3xl font-black">3ステップでおもちゃが見つかる</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { step: "STEP 01", emoji: "👶", title: "月齢を入力", desc: "スライダーを動かすか誕生日を入力するだけ。すぐにお子さんの月齢を設定できます。" },
              { step: "STEP 02", emoji: "📊", title: "発達効果を確認", desc: "4つの発達スコアと専門家コメントで、なぜそのおもちゃが良いかを確認できます。" },
              { step: "STEP 03", emoji: "🛒", title: "Amazonで購入", desc: "そのままAmazonへ。翌日配送で手元に届きます。在庫切れの心配もありません。" },
            ].map(({ step, emoji, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-md">
                  {emoji}
                </div>
                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{step}</div>
                <h3 className="font-black text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* ===== 発達マップ ===== */}
        <section id="section-map" className="mb-10 sm:mb-14 reveal">
          <div className="mb-5 sm:mb-6">
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">📊 Development Map</div>
            <div className="text-xl sm:text-2xl font-black">月齢別 発達マップ</div>
            <div className="text-sm text-gray-400 mt-1">0〜6歳の発達マイルストーンとおすすめおもちゃを一覧で確認</div>
          </div>

          {/* Month chips — horizontal scroll on mobile */}
          <div className="relative mb-5 sm:mb-6">
            <div className="flex overflow-x-auto gap-2 pb-2 -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-hide sm:flex-wrap">
              {MONTH_RANGES.map((r) => (
                <button
                  key={r.val}
                  onClick={() => selectMonthRange(r.val)}
                  className={cn(
                    "px-3.5 sm:px-4 py-2 rounded-full border-2 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 min-h-[40px]",
                    activeMonth === r.val
                      ? "border-primary bg-primary text-white shadow-md scale-105"
                      : "border-gray-200 text-gray-500 hover:border-primary hover:text-primary bg-white"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-2 w-10 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none sm:hidden" />
          </div>

          {/* Banner */}
          <div className="bg-gradient-to-r from-rose-50 to-teal-50 rounded-2xl p-4 sm:p-6 mb-5 sm:mb-6 flex items-start gap-3 sm:gap-5">
            <span className="text-4xl sm:text-5xl flex-shrink-0 select-none">{banner.emoji}</span>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-black mb-2 sm:mb-3">{banner.title}</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {banner.milestones.map((m) => (
                  <span key={m} className="bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold text-gray-600 shadow-sm">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Dev category cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
            {(["motor", "language", "cognitive", "social"] as DevCategory[]).map((cat) => (
              <div
                key={cat}
                className={cn(
                  "rounded-2xl p-3.5 sm:p-4 text-center shadow-sm border-2 border-transparent hover:border-current hover:-translate-y-1 transition-all cursor-pointer",
                  DEV_CATEGORY_COLORS[cat].bg, DEV_CATEGORY_COLORS[cat].text
                )}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl mx-auto mb-2.5 sm:mb-3 flex items-center justify-center text-xl sm:text-2xl bg-white shadow-sm">
                  {cat === "motor" ? "🏃" : cat === "language" ? "💬" : cat === "cognitive" ? "🧠" : "🤝"}
                </div>
                <div className="font-bold text-xs sm:text-sm mb-1">
                  {cat === "motor" ? "運動・体の発達" : cat === "language" ? "言語・コミュニケーション" : cat === "cognitive" ? "認知・思考力" : "社会性・情緒"}
                </div>
                <div className="text-[10px] sm:text-xs opacity-70 leading-snug">
                  {cat === "motor" ? "手指・全身の動きや協調性"
                    : cat === "language" ? "言葉の発達・表現力・語彙力"
                    : cat === "cognitive" ? "論理的思考・問題解決・創造力"
                    : "感情理解・協調性・自己表現"}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: accordion / Desktop: table */}
          <div className="md:hidden">
            <DevMapAccordion data={DEV_MAP_DATA} activeMonth={activeMonth} />
          </div>

          <div className="hidden md:block">
            <div className="bg-white rounded-2xl shadow-card overflow-x-auto">
            <table className="border-collapse text-sm" style={{ minWidth: "600px", width: "100%" }}>
                <thead>
                  <tr>
                    <th className="px-4 py-3.5 text-left font-bold text-gray-700 bg-gray-50 border-b-2 border-gray-100 whitespace-nowrap">月齢</th>
                    <th className="px-4 py-3.5 text-left font-bold text-primary bg-primary-light border-b-2 border-gray-100 whitespace-nowrap">🏃 運動</th>
                    <th className="px-4 py-3.5 text-left font-bold text-secondary bg-secondary-light border-b-2 border-gray-100 whitespace-nowrap">💬 言語</th>
                    <th className="px-4 py-3.5 text-left font-bold text-brand-purple bg-brand-purple-light border-b-2 border-gray-100 whitespace-nowrap">🧠 認知</th>
                    <th className="px-4 py-3.5 text-left font-bold text-brand-green bg-brand-green-light border-b-2 border-gray-100 whitespace-nowrap">🤝 社会</th>
                    <th className="px-4 py-3.5 text-left font-bold text-gray-700 bg-gray-50 border-b-2 border-gray-100 whitespace-nowrap">おすすめ</th>
                  </tr>
                </thead>
                <tbody>
                  {DEV_MAP_DATA.map((row) => {
                    const isActive = activeMonth >= row.ageMin && activeMonth <= row.ageMax;
                    return (
                      <tr
                        key={row.month}
                        className={cn(
                          "transition-colors border-b border-gray-100 last:border-0",
                          isActive ? "bg-primary-light/40" : "hover:bg-gray-50"
                        )}
                      >
                        <td className="px-4 py-4 font-bold whitespace-nowrap">
                          {isActive && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-1.5 mb-0.5 align-middle" />
                          )}
                          <span className={cn("text-base sm:text-xl", isActive ? "text-primary" : "text-gray-700")}>{row.month}</span>
                          <br />
                          <span className="text-xs text-gray-400">ヶ月</span>
                        </td>
                        <td className="px-4 py-4 align-top">
                          {row.motor.map((m) => (
                            <div key={m} className="flex items-start gap-1.5 mb-1 text-xs"><span className="text-primary mt-0.5 flex-shrink-0">▸</span>{m}</div>
                          ))}
                        </td>
                        <td className="px-4 py-4 align-top">
                          {row.language.map((m) => (
                            <div key={m} className="flex items-start gap-1.5 mb-1 text-xs"><span className="text-secondary mt-0.5 flex-shrink-0">▸</span>{m}</div>
                          ))}
                        </td>
                        <td className="px-4 py-4 align-top">
                          {row.cognitive.map((m) => (
                            <div key={m} className="flex items-start gap-1.5 mb-1 text-xs"><span className="text-brand-purple mt-0.5 flex-shrink-0">▸</span>{m}</div>
                          ))}
                        </td>
                        <td className="px-4 py-4 align-top">
                          {row.social.map((m) => (
                            <div key={m} className="flex items-start gap-1.5 mb-1 text-xs"><span className="text-brand-green mt-0.5 flex-shrink-0">▸</span>{m}</div>
                          ))}
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="flex flex-wrap gap-1">
                            {row.toys.map((t) => (
                              <span
                                key={t.name}
                                className={cn(
                                  "px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
                                  t.cat === "motor" ? "bg-primary-light text-primary"
                                    : t.cat === "language" ? "bg-secondary-light text-secondary"
                                    : t.cat === "cognitive" ? "bg-brand-purple-light text-brand-purple"
                                    : "bg-brand-green-light text-brand-green"
                                )}
                              >
                                {t.name}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div> {/* end hidden md:block */}
        </section>

        {/* ===== 商品一覧 ===== */}
        <section id="section-shop" className="mb-10 sm:mb-14 reveal">
          <div className="mb-5 sm:mb-6">
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">🛍 Recommended</div>
            <div className="text-xl sm:text-2xl font-black">おすすめ商品</div>
            <div className="text-sm text-gray-400 mt-1">発達効果の高い厳選おもちゃ</div>
          </div>

          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-5 gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-400">
                {isFiltered ? `${age}ヶ月（${getAgeLabel(age)}）対応：` : ""}
                {filteredProducts.length}件の商品
              </span>
              {isFiltered && (
                <button
                  onClick={resetFilter}
                  className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5 min-h-[36px]"
                >
                  フィルターをクリア
                  <X size={11} />
                </button>
              )}
            </div>
            <select
              onChange={(e) => {
                const val = e.target.value;
                const sorted = [...filteredProducts];
                if (val === "effect") sorted.sort((a, b) => Math.max(...Object.values(b.effects)) - Math.max(...Object.values(a.effects)));
                if (val === "price-asc") sorted.sort((a, b) => a.price - b.price);
                if (val === "price-desc") sorted.sort((a, b) => b.price - a.price);
                setFilteredProducts(sorted);
              }}
              className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 bg-white focus:border-primary outline-none cursor-pointer min-h-[44px] w-full sm:w-auto"
            >
              <option value="default">おすすめ順</option>
              <option value="effect">発達効果が高い順</option>
              <option value="price-asc">価格が安い順</option>
              <option value="price-desc">価格が高い順</option>
            </select>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {filteredProducts.length === 0 ? (
              <EmptyProducts age={age} onReset={resetFilter} />
            ) : (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpen={() => setSelectedProduct(product)}
                  onAddCart={() => addToCart(product.id)}
                  wished={wishlist.has(product.id)}
                  onWishToggle={() => toggleWishlist(product.id)}
                />
              ))
            )}
          </div>
        </section>

        {/* ===== 専門家コメント ===== */}
        <div className="bg-gradient-to-r from-violet-50 to-teal-50 rounded-2xl p-5 sm:p-8 mb-10 sm:mb-14 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start reveal">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-purple flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0 select-none">
            👩‍⚕️
          </div>
          <div>
            <div className="font-black text-base sm:text-lg mb-0.5">田中 美香 先生</div>
            <div className="text-xs text-gray-400 mb-3">小児科医・発達専門医 / 東京大学医学部附属病院</div>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed pl-4 border-l-4 border-brand-purple">
              {expertComment}
            </p>
          </div>
        </div>

        {/* ===== メールマガジン ===== */}
        <div className="bg-gradient-to-r from-primary-light to-accent-light rounded-2xl p-7 sm:p-12 text-center mb-8 sm:mb-10 reveal">
          <h2 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3">📮 発達情報をメールでお届け</h2>
          <p className="text-gray-500 text-sm sm:text-base mb-5 sm:mb-7">
            月齢別の発達Tips・おすすめおもちゃ・専門家コラムを毎週お届けします
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="メールアドレスを入力"
              className="flex-1 px-4 py-3.5 border-2 border-gray-200 rounded-xl text-base focus:border-primary outline-none transition-colors bg-white min-h-[52px]"
            />
            <button className="bg-primary text-white font-bold px-6 py-3.5 rounded-xl hover:bg-primary-dark transition-colors whitespace-nowrap shadow-md min-h-[52px]">
              無料で登録
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">🔒 スパムは送りません。いつでも配信解除できます。</p>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-800 text-gray-400 py-10 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="text-white font-black text-lg mb-3">🌱 そだてる</div>
            <p className="text-sm leading-relaxed">
              0〜6歳の大切な成長期に、科学的根拠に基づいた最適なおもちゃをお届けします。
            </p>
          </div>
          {[
            ["サービス", ["発達マップ", "月齢別レコメンド", "定期便", "ギフト"]],
            ["月齢から探す", ["0〜3ヶ月", "4〜12ヶ月", "1〜2歳", "3〜6歳"]],
            ["会社情報", ["運営会社", "専門家チーム", "採用情報"]],
          ].map(([title, items]) => (
            <div key={title as string}>
              <h4 className="text-white text-sm font-bold mb-3">{title as string}</h4>
              <ul className="space-y-2">
                {(items as string[]).map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm hover:text-white transition-colors inline-block py-0.5">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 max-w-6xl mx-auto">
          <p className="text-xs">© 2026 そだてる Inc. All rights reserved.</p>
          <p className="text-xs text-center sm:text-right">プライバシーポリシー ｜ 特定商取引法 ｜ 利用規約</p>
        </div>
      </footer>

      {/* ===== Overlays ===== */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddCart={addToCart} />
      )}
      {showRegister && <ChildRegisterModal onClose={() => setShowRegister(false)} />}
      {showCart && (
        <CartDrawer
          cart={cart}
          onClose={() => setShowCart(false)}
          onRemove={removeFromCart}
          onQuantityChange={updateQuantity}
        />
      )}

      <ToastContainer toasts={toasts} />
      <ScrollToTop />
    </>
  );
}
