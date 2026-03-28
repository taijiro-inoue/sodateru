"use client";

import { useState, useCallback } from "react";
import type { Product, DevCategory, CartItem } from "@/types";
import { PRODUCTS, DEV_MAP_DATA, MONTH_BANNERS, EXPERT_COMMENTS } from "@/lib/data";
import { getAgeLabel, formatPrice, calcAgeInMonths, DEV_CATEGORY_LABELS, DEV_CATEGORY_COLORS } from "@/lib/utils";
import { cn } from "@/lib/utils";

// ===== 月齢に近いバナーを取得 =====
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

// ===== コンポーネント =====
function Header({ cartCount, onRegister }: { cartCount: number; onRegister: () => void }) {
  return (
    <header className="bg-white border-b-2 border-primary-light sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl">🌱</div>
          <div>
            <div className="text-lg font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">そだてる</div>
            <div className="text-[10px] text-gray-400 -mt-1">月齢別おもちゃ・知育グッズ専門店</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => document.getElementById("section-map")?.scrollIntoView({ behavior: "smooth" })} className="hidden md:block text-sm font-semibold text-gray-500 hover:text-primary px-3 py-2 rounded-full hover:bg-gray-50 transition-all">📊 発達マップ</button>
          <button onClick={() => document.getElementById("section-shop")?.scrollIntoView({ behavior: "smooth" })} className="hidden md:block text-sm font-semibold text-gray-500 hover:text-primary px-3 py-2 rounded-full hover:bg-gray-50 transition-all">🛍 お店</button>
          <button onClick={onRegister} className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-primary-dark transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">👶 お子さんを登録</button>
          <button className="relative bg-accent-light text-gray-800 text-sm font-bold px-4 py-2 rounded-full hover:bg-accent transition-all">
            🛒 カート
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function DevEffectBars({ effects }: { effects: Product["effects"] }) {
  const cats: DevCategory[] = ["motor", "language", "cognitive", "social"];
  return (
    <div className="space-y-1.5">
      {cats.map((cat) => (
        <div key={cat} className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 w-8 flex-shrink-0">{DEV_CATEGORY_LABELS[cat]}</span>
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full", DEV_CATEGORY_COLORS[cat].fill)} style={{ width: `${effects[cat]}%` }} />
          </div>
          <span className="text-[11px] text-gray-400 w-6 text-right">{effects[cat]}</span>
        </div>
      ))}
    </div>
  );
}

function ProductCard({ product, onOpen, onAddCart }: { product: Product; onOpen: () => void; onAddCart: () => void }) {
  const [wished, setWished] = useState(false);
  return (
    <div onClick={onOpen} className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary-light">
      <div className="relative h-48 bg-gray-50 flex items-center justify-center">
        <span className="text-7xl">{product.emoji}</span>
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.badges.includes("new") && <span className="badge bg-primary text-white">NEW</span>}
          {product.badges.includes("popular") && <span className="badge bg-accent text-gray-800">人気</span>}
          {product.badges.includes("expert") && <span className="badge bg-brand-purple text-white">専門家推薦</span>}
        </div>
        <button onClick={(e) => { e.stopPropagation(); setWished(!wished); }} className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform">
          {wished ? "❤️" : "🤍"}
        </button>
      </div>
      <div className="p-4">
        <div className="text-xs font-bold text-primary mb-1">対象：{product.ageMin}〜{product.ageMax}ヶ月</div>
        <div className="font-bold text-gray-800 mb-3 leading-snug">{product.name}</div>
        <DevEffectBars effects={product.effects} />
        <div className="flex items-center justify-between mt-3">
          <div className="text-xl font-black">{formatPrice(product.price)}<span className="text-xs font-normal text-gray-400">（税込）</span></div>
          <button onClick={(e) => { e.stopPropagation(); onAddCart(); }} className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-primary-dark hover:scale-105 transition-all">＋カート</button>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ product, onClose, onAddCart }: { product: Product | null; onClose: () => void; onAddCart: (id: number) => void }) {
  const [tab, setTab] = useState<"effects" | "howto" | "review">("effects");
  if (!product) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 pb-0 flex justify-end"><button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-primary-light flex items-center justify-center transition-colors">✕</button></div>
        <div className="px-7 pb-7">
          <div className="h-48 bg-gray-50 rounded-2xl flex items-center justify-center text-8xl mb-5">{product.emoji}</div>
          <h2 className="text-2xl font-black mb-2">{product.name}</h2>
          <p className="text-sm font-bold text-primary mb-4">対象月齢：{product.ageMin}〜{product.ageMax}ヶ月</p>
          <div className="flex gap-1 bg-gray-50 p-1 rounded-xl mb-5">
            {(["effects", "howto", "review"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cn("flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all", tab === t ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600")}>
                {t === "effects" ? "発達効果" : t === "howto" ? "遊び方" : "口コミ"}
              </button>
            ))}
          </div>
          {tab === "effects" && (
            <div className="space-y-3">
              {product.effectDetails.map((e, i) => (
                <div key={i} className="flex gap-3 p-3.5 bg-gray-50 rounded-xl">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-xl flex-shrink-0 shadow-sm">{e.icon}</div>
                  <div><h4 className="font-bold text-sm mb-1">{e.label}</h4><p className="text-xs text-gray-500 leading-relaxed">{e.text}</p></div>
                </div>
              ))}
            </div>
          )}
          {tab === "howto" && (
            <ul className="space-y-2.5 pl-4 list-disc">
              {product.howto.map((h, i) => <li key={i} className="text-sm text-gray-600 leading-relaxed">{h}</li>)}
            </ul>
          )}
          {tab === "review" && (
            <div className="space-y-3">
              {product.reviews.map((r, i) => (
                <div key={i} className="p-3.5 bg-gray-50 rounded-xl">
                  <div className="flex justify-between mb-1.5"><span className="text-sm font-bold">{r.name}</span><span className="text-amber-400">{"⭐".repeat(r.stars)}</span></div>
                  <p className="text-sm text-gray-500 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between pt-5 mt-5 border-t border-gray-100">
            <div>
              <div className="text-3xl font-black">{formatPrice(product.price)}<span className="text-sm font-normal text-gray-400">（税込）</span></div>
              <div className="text-xs text-gray-400 mt-0.5">送料無料 ｜ 翌日配送対応</div>
            </div>
            <button onClick={() => { onAddCart(product.id); onClose(); }} className="bg-gradient-to-r from-primary to-orange-400 text-white font-bold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
              🛒 カートに追加
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChildRegisterModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"girl" | "boy" | "unset" | null>(null);
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [email, setEmail] = useState("");
  const ageMonths = birthYear && birthMonth ? calcAgeInMonths(Number(birthYear), Number(birthMonth)) : null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 pb-0 flex justify-end"><button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-primary-light flex items-center justify-center transition-colors">✕</button></div>
        <div className="px-7 pb-7">
          {/* ステップバー */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map((s) => <div key={s} className={cn("flex-1 h-1 rounded-full transition-colors", s <= step ? "bg-primary" : "bg-gray-200")} />)}
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-xl font-black mb-1">👶 お子さんの情報を教えてください</h2>
              <p className="text-sm text-gray-400 mb-5">月齢に合ったおもちゃをレコメンドするために使用します</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-600 block mb-1.5">ニックネーム</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="例：はるちゃん" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-primary outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-600 block mb-1.5">性別（任意）</label>
                  <div className="flex gap-2">
                    {([["girl", "👧 女の子"], ["boy", "👦 男の子"], ["unset", "🌈 未設定"]] as const).map(([val, label]) => (
                      <button key={val} onClick={() => setGender(val)} className={cn("flex-1 py-2.5 border-2 rounded-xl text-sm font-semibold transition-all", gender === val ? "border-primary bg-primary-light text-primary" : "border-gray-200 text-gray-500 hover:border-primary hover:text-primary")}>{label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-600 block mb-1.5">誕生日</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} placeholder="2024（年）" className="px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-primary outline-none transition-colors" />
                    <input type="number" value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} placeholder="3（月）" min={1} max={12} className="px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-primary outline-none transition-colors" />
                  </div>
                  {ageMonths !== null && (
                    <div className="mt-2 bg-primary-light text-primary text-sm font-bold text-center py-2 rounded-xl">
                      現在の月齢：{ageMonths}ヶ月（{Math.floor(ageMonths / 12)}歳{ageMonths % 12}ヶ月）
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full mt-5 bg-gradient-to-r from-primary to-orange-400 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">次へ →</button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-black mb-1">📧 通知を受け取る設定</h2>
              <p className="text-sm text-gray-400 mb-5">月齢更新のお知らせやおすすめ情報をお届けします</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-600 block mb-1.5">メールアドレス</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-primary outline-none transition-colors" />
                </div>
                <div className="space-y-3">
                  {[["🔔 月齢更新のお知らせ", true], ["📦 おすすめ商品の案内", true], ["🧠 専門家の発達コラム", false]].map(([label, defaultChecked], i) => (
                    <label key={i} className="flex items-center gap-3 text-sm cursor-pointer">
                      <input type="checkbox" defaultChecked={defaultChecked as boolean} className="w-4 h-4 accent-primary" />
                      <span className="text-gray-700">{label as string}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-gray-300 transition-colors">← 戻る</button>
                <button onClick={() => setStep(3)} className="flex-[2] bg-gradient-to-r from-primary to-orange-400 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">登録する 🎉</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-xl font-black mb-2">{name || "お子さん"}の登録完了！</h2>
              <p className="text-sm text-gray-400 mb-5 leading-relaxed">月齢に合わせたおすすめをご用意しました。<br />月齢が変わるたびに最新情報をお届けします。</p>
              {ageMonths !== null && (
                <div className="bg-primary-light rounded-xl p-4 mb-5">
                  <div className="text-xs font-bold text-primary mb-1">🌟 今月のおすすめ（{ageMonths}ヶ月）</div>
                  <div className="font-bold text-gray-800 text-sm">{getAgeLabel(ageMonths)}向けのおもちゃ</div>
                </div>
              )}
              <button onClick={() => { onClose(); document.getElementById("section-shop")?.scrollIntoView({ behavior: "smooth" }); }} className="w-full bg-gradient-to-r from-primary to-orange-400 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                🛍 おすすめを見る
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== メインページ =====
export default function Home() {
  const [age, setAge] = useState(12);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeMonth, setActiveMonth] = useState(11);
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [inputMode, setInputMode] = useState<"slider" | "birthday" | "category">("slider");

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const banner = getBannerForAge(activeMonth);
  const expertComment = getExpertComment(activeMonth);

  const addToCart = useCallback((id: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === id);
      if (existing) return prev.map((i) => i.product.id === id ? { ...i, quantity: i.quantity + 1 } : i);
      const product = PRODUCTS.find((p) => p.id === id)!;
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const searchByAge = () => {
    const filtered = PRODUCTS.filter((p) => age >= p.ageMin && age <= p.ageMax);
    setFilteredProducts(filtered.length > 0 ? filtered : PRODUCTS);
    setActiveMonth(age);
    document.getElementById("section-shop")?.scrollIntoView({ behavior: "smooth" });
  };

  const selectMonthRange = (val: number) => {
    setActiveMonth(val);
    setAge(val);
    const filtered = PRODUCTS.filter((p) => val >= p.ageMin && val <= p.ageMax);
    setFilteredProducts(filtered.length > 0 ? filtered : PRODUCTS);
  };

  const calcedAge = birthYear && birthMonth ? calcAgeInMonths(Number(birthYear), Number(birthMonth)) : null;

  const MONTH_RANGES = [
    { label: "0〜3ヶ月", val: 2 }, { label: "4〜6ヶ月", val: 5 },
    { label: "7〜9ヶ月", val: 8 }, { label: "10〜12ヶ月", val: 11 },
    { label: "1歳〜1歳半", val: 15 }, { label: "1歳半〜2歳", val: 21 },
    { label: "2〜3歳", val: 30 }, { label: "3〜4歳", val: 42 }, { label: "4〜6歳", val: 60 },
  ];

  return (
    <>
      <Header cartCount={cartCount} onRegister={() => setShowRegister(true)} />

      {/* HERO */}
      <section className="bg-gradient-to-br from-rose-50 via-teal-50 to-violet-50 py-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative max-w-2xl mx-auto">
          <span className="inline-block bg-primary-light text-primary text-sm font-bold px-4 py-1.5 rounded-full mb-5">🎉 専門家監修・0〜6歳対応</span>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            お子さんの<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">月齢</span>に合わせた<br />おもちゃが見つかる
          </h1>
          <p className="text-gray-500 text-lg mb-10">発達段階を科学的に分析。今この瞬間に必要な遊びと、<br className="hidden md:block" />脳の成長を促すおもちゃをご提案します。</p>

          {/* 月齢入力カード */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg mx-auto">
            <h2 className="font-bold text-lg mb-5">👶 お子さんの月齢を教えてください</h2>
            <div className="flex bg-gray-50 p-1 rounded-xl mb-6">
              {(["slider", "birthday", "category"] as const).map((mode) => (
                <button key={mode} onClick={() => setInputMode(mode)} className={cn("flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all", inputMode === mode ? "bg-white text-primary shadow-sm" : "text-gray-400")}>
                  {mode === "slider" ? "月齢で探す" : mode === "birthday" ? "誕生日から" : "発達領域から"}
                </button>
              ))}
            </div>

            {inputMode === "slider" && (
              <div className="mb-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-500">月齢</span>
                  <span><span className="text-4xl font-black text-primary">{age}</span><span className="text-base text-gray-500 font-semibold"> ヶ月</span></span>
                </div>
                <input type="range" min={0} max={72} value={age} onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #FF6B6B ${(age / 72) * 100}%, #E2E8F0 ${(age / 72) * 100}%)` }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  {["0ヶ月", "1歳", "2歳", "3歳", "4歳", "5歳", "6歳"].map((l) => <span key={l}>{l}</span>)}
                </div>
              </div>
            )}

            {inputMode === "birthday" && (
              <div className="mb-5">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div><label className="text-xs text-gray-400 block mb-1">誕生年</label><input type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} placeholder="2024" className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-primary outline-none" /></div>
                  <div><label className="text-xs text-gray-400 block mb-1">月</label><input type="number" value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} placeholder="3" min={1} max={12} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-primary outline-none" /></div>
                </div>
                {calcedAge !== null && (
                  <div className="bg-primary-light text-primary text-sm font-bold text-center py-2.5 rounded-xl">
                    現在の月齢：{calcedAge}ヶ月（{Math.floor(calcedAge / 12)}歳{calcedAge % 12}ヶ月）
                  </div>
                )}
              </div>
            )}

            {inputMode === "category" && (
              <div className="grid grid-cols-2 gap-3 mb-5">
                {(["motor", "language", "cognitive", "social"] as DevCategory[]).map((cat) => (
                  <button key={cat} onClick={() => { const sorted = [...PRODUCTS].sort((a, b) => b.effects[cat] - a.effects[cat]); setFilteredProducts(sorted); document.getElementById("section-shop")?.scrollIntoView({ behavior: "smooth" }); }}
                    className={cn("py-3 px-2 border-2 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5", DEV_CATEGORY_COLORS[cat].bg, DEV_CATEGORY_COLORS[cat].text, "border-transparent hover:border-current")}>
                    {cat === "motor" ? "🏃 運動・体の発達" : cat === "language" ? "💬 言語・コミュニケーション" : cat === "cognitive" ? "🧠 認知・思考力" : "🤝 社会性・情緒"}
                  </button>
                ))}
              </div>
            )}

            <button onClick={() => { if (inputMode === "birthday" && calcedAge !== null) { setAge(calcedAge); setActiveMonth(calcedAge); } searchByAge(); }} className="w-full bg-gradient-to-r from-primary to-orange-400 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
              🔍 この月齢のおすすめを見る
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[["1,200+", "取扱商品数"], ["73", "月齢段階"], ["15名", "専門家監修"], ["98%", "購入者満足度"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-primary">{num}</div>
              <div className="text-xs text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* 発達マップ */}
        <section id="section-map" className="mb-14">
          <div className="mb-6">
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">📊 Development Map</div>
            <div className="text-2xl font-black">月齢別 発達マップ</div>
            <div className="text-sm text-gray-400 mt-1">0〜6歳の発達マイルストーンとおすすめおもちゃを一覧で確認</div>
          </div>

          {/* 月齢チップ */}
          <div className="flex flex-wrap gap-2 mb-6">
            {MONTH_RANGES.map((r) => (
              <button key={r.val} onClick={() => selectMonthRange(r.val)}
                className={cn("px-4 py-2 rounded-full border-2 text-sm font-semibold transition-all whitespace-nowrap",
                  activeMonth === r.val ? "border-primary bg-primary text-white shadow-md" : "border-gray-200 text-gray-500 hover:border-primary hover:text-primary bg-white")}>
                {r.label}
              </button>
            ))}
          </div>

          {/* 月齢バナー */}
          <div className="bg-gradient-to-r from-rose-50 to-teal-50 rounded-2xl p-6 mb-6 flex items-start gap-5">
            <span className="text-5xl flex-shrink-0">{banner.emoji}</span>
            <div>
              <h3 className="text-lg font-black mb-3">{banner.title}</h3>
              <div className="flex flex-wrap gap-2">
                {banner.milestones.map((m) => (
                  <span key={m} className="bg-white px-3 py-1.5 rounded-full text-sm font-semibold text-gray-600 shadow-sm">{m}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 発達カテゴリカード */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {(["motor", "language", "cognitive", "social"] as DevCategory[]).map((cat) => (
              <div key={cat} className={cn("rounded-2xl p-4 text-center shadow-sm border-2 border-transparent hover:border-current hover:-translate-y-1 transition-all cursor-pointer", DEV_CATEGORY_COLORS[cat].bg, DEV_CATEGORY_COLORS[cat].text)}>
                <div className={cn("w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl bg-white shadow-sm")}>
                  {cat === "motor" ? "🏃" : cat === "language" ? "💬" : cat === "cognitive" ? "🧠" : "🤝"}
                </div>
                <div className="font-bold text-sm mb-1">{cat === "motor" ? "運動・体の発達" : cat === "language" ? "言語・コミュニケーション" : cat === "cognitive" ? "認知・思考力" : "社会性・情緒"}</div>
                <div className="text-xs opacity-70 leading-snug">{cat === "motor" ? "手指・全身の動きや協調性" : cat === "language" ? "言葉の発達・表現力・語彙力" : cat === "cognitive" ? "論理的思考・問題解決・創造力" : "感情理解・協調性・自己表現"}</div>
              </div>
            ))}
          </div>

          {/* 発達マップテーブル */}
          <div className="bg-white rounded-2xl shadow-card overflow-hidden overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3.5 text-left font-bold text-gray-700 bg-gray-50 border-b-2 border-gray-100">月齢</th>
                  <th className="px-4 py-3.5 text-left font-bold text-primary bg-primary-light border-b-2 border-gray-100">🏃 運動・体の発達</th>
                  <th className="px-4 py-3.5 text-left font-bold text-secondary bg-secondary-light border-b-2 border-gray-100">💬 言語</th>
                  <th className="px-4 py-3.5 text-left font-bold text-brand-purple bg-brand-purple-light border-b-2 border-gray-100">🧠 認知・思考</th>
                  <th className="px-4 py-3.5 text-left font-bold text-brand-green bg-brand-green-light border-b-2 border-gray-100">🤝 社会・情緒</th>
                  <th className="px-4 py-3.5 text-left font-bold text-gray-700 bg-gray-50 border-b-2 border-gray-100">おすすめ</th>
                </tr>
              </thead>
              <tbody>
                {DEV_MAP_DATA.map((row) => (
                  <tr key={row.month} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                    <td className="px-4 py-4 font-bold whitespace-nowrap"><span className="text-xl text-primary">{row.month}</span><br /><span className="text-xs text-gray-400">ヶ月</span></td>
                    <td className="px-4 py-4 align-top">{row.motor.map((m) => <div key={m} className="flex items-start gap-1.5 mb-1 text-xs"><span className="text-primary mt-0.5">▸</span>{m}</div>)}</td>
                    <td className="px-4 py-4 align-top">{row.language.map((m) => <div key={m} className="flex items-start gap-1.5 mb-1 text-xs"><span className="text-secondary mt-0.5">▸</span>{m}</div>)}</td>
                    <td className="px-4 py-4 align-top">{row.cognitive.map((m) => <div key={m} className="flex items-start gap-1.5 mb-1 text-xs"><span className="text-brand-purple mt-0.5">▸</span>{m}</div>)}</td>
                    <td className="px-4 py-4 align-top">{row.social.map((m) => <div key={m} className="flex items-start gap-1.5 mb-1 text-xs"><span className="text-brand-green mt-0.5">▸</span>{m}</div>)}</td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-wrap gap-1">
                        {row.toys.map((t) => (
                          <span key={t.name} className={cn("px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity",
                            t.cat === "motor" ? "bg-primary-light text-primary" : t.cat === "language" ? "bg-secondary-light text-secondary" : t.cat === "cognitive" ? "bg-brand-purple-light text-brand-purple" : "bg-brand-green-light text-brand-green")}>
                            {t.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 商品一覧 */}
        <section id="section-shop" className="mb-14">
          <div className="mb-6">
            <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">🛍 Recommended</div>
            <div className="text-2xl font-black">おすすめ商品</div>
            <div className="text-sm text-gray-400 mt-1">発達効果の高い厳選おもちゃ</div>
          </div>
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm text-gray-400">{filteredProducts.length}件の商品</span>
            <select onChange={(e) => {
              const val = e.target.value;
              const sorted = [...filteredProducts];
              if (val === "effect") sorted.sort((a, b) => Math.max(...Object.values(b.effects)) - Math.max(...Object.values(a.effects)));
              if (val === "price-asc") sorted.sort((a, b) => a.price - b.price);
              if (val === "price-desc") sorted.sort((a, b) => b.price - a.price);
              setFilteredProducts(sorted);
            }} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 bg-white">
              <option value="default">おすすめ順</option>
              <option value="effect">発達効果が高い順</option>
              <option value="price-asc">価格が安い順</option>
              <option value="price-desc">価格が高い順</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onOpen={() => setSelectedProduct(product)} onAddCart={() => addToCart(product.id)} />
            ))}
          </div>
        </section>

        {/* 専門家コメント */}
        <div className="bg-gradient-to-r from-violet-50 to-teal-50 rounded-2xl p-8 mb-14 flex gap-6 items-start">
          <div className="w-20 h-20 rounded-full bg-brand-purple flex items-center justify-center text-4xl flex-shrink-0">👩‍⚕️</div>
          <div>
            <div className="font-black text-lg mb-0.5">田中 美香 先生</div>
            <div className="text-xs text-gray-400 mb-3">小児科医・発達専門医 / 東京大学医学部附属病院</div>
            <p className="text-gray-600 leading-relaxed pl-4 border-l-4 border-brand-purple">{expertComment}</p>
          </div>
        </div>

        {/* メールマガジン */}
        <div className="bg-gradient-to-r from-primary-light to-accent-light rounded-2xl p-12 text-center mb-10">
          <h2 className="text-2xl font-black mb-3">📮 発達情報をメールでお届け</h2>
          <p className="text-gray-500 mb-7">月齢別の発達Tips・おすすめおもちゃ・専門家コラムを毎週お届けします</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input type="email" placeholder="メールアドレスを入力" className="flex-1 px-4 py-3.5 border-2 border-gray-200 rounded-xl text-sm focus:border-primary outline-none transition-colors" />
            <button className="bg-primary text-white font-bold px-6 py-3.5 rounded-xl hover:bg-primary-dark transition-colors whitespace-nowrap shadow-md">無料で登録</button>
          </div>
          <p className="text-xs text-gray-400 mt-3">🔒 スパムは送りません。いつでも配信解除できます。</p>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="text-white font-black text-lg mb-3">🌱 そだてる</div>
            <p className="text-sm leading-relaxed">0〜6歳の大切な成長期に、科学的根拠に基づいた最適なおもちゃをお届けします。</p>
          </div>
          {[["サービス", ["発達マップ", "月齢別レコメンド", "定期便", "ギフト"]], ["月齢から探す", ["0〜3ヶ月", "4〜12ヶ月", "1〜2歳", "3〜6歳"]], ["会社情報", ["運営会社", "専門家チーム", "採用情報"]]].map(([title, items]) => (
            <div key={title as string}>
              <h4 className="text-white text-sm font-bold mb-3">{title as string}</h4>
              <ul className="space-y-2">{(items as string[]).map((item) => <li key={item}><a href="#" className="text-sm hover:text-white transition-colors">{item}</a></li>)}</ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 max-w-6xl mx-auto">
          <p className="text-xs">© 2026 そだてる Inc. All rights reserved.</p>
          <p className="text-xs">プライバシーポリシー ｜ 特定商取引法 ｜ 利用規約</p>
        </div>
      </footer>

      {/* モーダル */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddCart={addToCart} />}
      {showRegister && <ChildRegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
}
