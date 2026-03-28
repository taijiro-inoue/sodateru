import type { Product, DevMapRow, MonthBanner } from "@/types";

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "レインボー積み木セット",
    emoji: "🧱",
    price: 4800,
    ageMin: 8,
    ageMax: 36,
    badges: ["popular", "expert"],
    effects: { motor: 85, language: 30, cognitive: 90, social: 60 },
    effectDetails: [
      { icon: "🧠", label: "思考力・認知発達", text: "色と形の分類、積む順序の考え方を通じて、論理的思考と空間認識力が育まれます。" },
      { icon: "🏃", label: "手指の発達", text: "ブロックをつかんで積む動作が、指先の巧緻性と手眼協調を効果的に鍛えます。" },
      { icon: "🤝", label: "社会性", text: "親子・友だち同士で積んだり壊したりする遊びがコミュニケーション力を育てます。" },
    ],
    howto: [
      "最初は2〜3個から始め、慣れてきたら増やしましょう",
      "色や形を言葉にしながら遊ぶと言語発達にも効果的です",
      "崩すことも大切な学び。「壊してもいいよ」と伝えましょう",
    ],
    reviews: [
      { name: "ままさん(12ヶ月)", text: "積んでは崩して…を何度も繰り返して大喜び！集中力がついた気がします！", stars: 5 },
      { name: "パパさん(18ヶ月)", text: "色の名前を覚えるのに大活躍。今は6個まで積めるようになりました。", stars: 5 },
    ],
    affiliateUrl: "https://www.amazon.co.jp/",
  },
  {
    id: 2,
    name: "やわらか知育ブロック（48ピース）",
    emoji: "🔷",
    price: 6200,
    ageMin: 12,
    ageMax: 48,
    badges: ["new"],
    effects: { motor: 75, language: 40, cognitive: 95, social: 70 },
    effectDetails: [
      { icon: "🧠", label: "創造力・空間認識", text: "STEM教育に最適。自由な構造物を作る過程で空間認識力と創造的思考が大きく伸びます。" },
      { icon: "🏃", label: "手指の発達", text: "パーツをはめ込む動作が指先の精細運動を鍛えます。" },
      { icon: "💬", label: "言語・表現", text: "「これは家だよ」と説明する場面が自然に生まれ、語彙と表現力が育ちます。" },
    ],
    howto: [
      "まずは大人が簡単な形を作って見せましょう",
      "「同じ色を集めよう」などミッションを与えると集中が増します",
      "完成したら写真を撮って記録するのもおすすめです",
    ],
    reviews: [
      { name: "Yuki(2歳6ヶ月)", text: "毎日違うものを作っていて、飽きません。カラフルで大好きです。", stars: 5 },
    ],
    affiliateUrl: "https://www.amazon.co.jp/",
  },
  {
    id: 3,
    name: "カラフルシロフォン（木製）",
    emoji: "🎵",
    price: 3200,
    ageMin: 6,
    ageMax: 36,
    badges: ["popular"],
    effects: { motor: 70, language: 80, cognitive: 65, social: 55 },
    effectDetails: [
      { icon: "💬", label: "音感・言語リズム", text: "音楽を通じてリズム感と音感が育まれ、言語習得に必要な「韻律感覚」が発達します。" },
      { icon: "🧠", label: "因果関係の理解", text: "叩くと音が出る。この「原因と結果」の理解が知的発達を促します。" },
      { icon: "🏃", label: "リズム運動", text: "手を叩く動作が両手の協調性とリズム感覚を育てます。" },
    ],
    howto: [
      "最初は自由に叩かせてあげましょう",
      "「ド・レ・ミ」と声に出しながら一緒に叩くと音楽的感性が育ちます",
    ],
    reviews: [
      { name: "harutoのママ", text: "毎朝起きたらすぐシロフォンを叩きに行きます（笑）音楽好きに育ちそう！", stars: 5 },
    ],
    affiliateUrl: "https://www.amazon.co.jp/",
  },
  {
    id: 4,
    name: "はじめての絵本セット（12冊）",
    emoji: "📚",
    price: 5800,
    ageMin: 0,
    ageMax: 24,
    badges: ["expert", "popular"],
    effects: { motor: 20, language: 98, cognitive: 75, social: 65 },
    effectDetails: [
      { icon: "💬", label: "言語爆発の準備", text: "0歳からの読み聞かせは語彙数に劇的な差をつけます。専門家が月齢別に厳選した12冊セット。" },
      { icon: "🧠", label: "想像力・記憶力", text: "ストーリーを追うことで記憶力と想像力が同時に鍛えられます。" },
      { icon: "🤝", label: "親子の絆", text: "読み聞かせの時間は親子の絆を深める最高のコミュニケーションです。" },
    ],
    howto: [
      "毎日同じ時間に読む習慣をつけましょう（寝る前がおすすめ）",
      "同じ本を何度も読むことで記憶と愛着が育ちます",
    ],
    reviews: [
      { name: "Aきゅんのパパ", text: "3ヶ月から読み始めてボロボロになるまで読みました。語彙力が豊かです。", stars: 5 },
    ],
    affiliateUrl: "https://www.amazon.co.jp/",
  },
  {
    id: 5,
    name: "手押し車（立ち歩き練習）",
    emoji: "🦺",
    price: 8900,
    ageMin: 9,
    ageMax: 18,
    badges: ["popular"],
    effects: { motor: 95, language: 25, cognitive: 40, social: 50 },
    effectDetails: [
      { icon: "🏃", label: "歩行発達", text: "つかまり立ちから独歩へ。体幹バランスを安全にサポートし、自信を持って歩行練習できます。" },
      { icon: "🧠", label: "自信・達成感", text: "「できた！」の体験が積み重なり、自己効力感が育まれます。" },
    ],
    howto: [
      "最初は大人が後ろから支えながら練習しましょう",
      "滑りにくいマット上で練習するのが安全です",
    ],
    reviews: [
      { name: "やまもとファミリー", text: "10ヶ月で立って、11ヶ月には一人で歩けるようになりました！", stars: 5 },
    ],
    affiliateUrl: "https://www.amazon.co.jp/",
  },
  {
    id: 6,
    name: "おままごとキッチンセット",
    emoji: "🍳",
    price: 12800,
    ageMin: 18,
    ageMax: 72,
    badges: ["popular", "new"],
    effects: { motor: 60, language: 85, cognitive: 70, social: 95 },
    effectDetails: [
      { icon: "🤝", label: "社会性・役割理解", text: "お客さんとお店屋さんを演じることで社会的な役割と関係性を学びます。" },
      { icon: "💬", label: "言語・コミュニケーション", text: "ごっこ遊びの会話が語彙と表現力を爆発的に増やします。" },
      { icon: "🧠", label: "見立て・象徴思考", text: "「これはカレーのつもり」と見立てる能力が抽象的思考力の基礎を作ります。" },
    ],
    howto: [
      "最初は大人が一緒に遊んで「おいしいね」などのやりとりを見せましょう",
      "「何作ってるの？」と質問が言語発達を促します",
    ],
    reviews: [
      { name: "はなちゃんのパパ", text: "2歳から5歳の今でも毎日遊んでいます。長く使えるおもちゃです。", stars: 5 },
    ],
    affiliateUrl: "https://www.amazon.co.jp/",
  },
];

export const DEV_MAP_DATA: DevMapRow[] = [
  { month: "0〜3", ageMin: 0, ageMax: 3, motor: ["首がすわる", "手足をバタバタ動かす", "追視する"], language: ["泣き声で意思表示", "喃語が始まる", "声を出す"], cognitive: ["顔を認識する", "光に反応する", "コントラストに注目"], social: ["あやすと微笑む", "視線を合わせる"], toys: [{ name: "モビール", cat: "motor" }, { name: "ガラガラ", cat: "motor" }, { name: "音楽メリー", cat: "language" }] },
  { month: "4〜6", ageMin: 4, ageMax: 6, motor: ["寝返りをする", "支えなしで座れる", "物をつかむ"], language: ["あー・うーと声を出す", "笑い声", "感情を声で表す"], cognitive: ["物を口で確かめる", "手を見つめる", "鏡に興味を持つ"], social: ["見知らぬ人に警戒", "社会的微笑み"], toys: [{ name: "タミータイムマット", cat: "motor" }, { name: "カラフルリング", cat: "cognitive" }, { name: "布絵本", cat: "language" }] },
  { month: "7〜9", ageMin: 7, ageMax: 9, motor: ["ハイハイする", "つかまり立ち", "指でつまむ"], language: ["パパ・ママと言う", "バイバイをまねる"], cognitive: ["かくれんぼを楽しむ", "物の永続性を理解", "因果関係に気づく"], social: ["人見知りが強くなる", "感情豊かになる"], toys: [{ name: "積み木", cat: "cognitive" }, { name: "プッシュカー", cat: "motor" }, { name: "音の出る絵本", cat: "language" }] },
  { month: "10〜12", ageMin: 10, ageMax: 12, motor: ["つたい歩き", "初めての一歩", "細かい指使い"], language: ["意味ある言葉が出る", "指さしをする"], cognitive: ["道具を使う", "模倣遊びを楽しむ"], social: ["愛着対象に甘える", "他児に興味を持つ"], toys: [{ name: "手押し車", cat: "motor" }, { name: "型はめパズル", cat: "cognitive" }, { name: "絵本（1冊目）", cat: "language" }] },
  { month: "13〜18", ageMin: 13, ageMax: 18, motor: ["歩行が安定する", "スプーンを使う"], language: ["語彙が急増", "二語文が出る", "歌をまねる"], cognitive: ["見立て遊びをする", "ブロックを積む"], social: ["並行遊びをする"], toys: [{ name: "乗り物おもちゃ", cat: "motor" }, { name: "カラーブロック", cat: "cognitive" }, { name: "おままごとセット", cat: "social" }] },
  { month: "19〜24", ageMin: 19, ageMax: 24, motor: ["走る・跳ぶ", "ボールを投げる"], language: ["文章で話す", "質問をする"], cognitive: ["ごっこ遊びが豊かに", "パズルを楽しむ"], social: ["友達と遊ぶ"], toys: [{ name: "ボール遊びセット", cat: "motor" }, { name: "パズル（4〜8ピース）", cat: "cognitive" }, { name: "お人形", cat: "social" }] },
  { month: "25〜36", ageMin: 25, ageMax: 36, motor: ["三輪車に乗る", "ハサミを使う"], language: ["3〜4語の文章", "質問攻め（なぜ？）"], cognitive: ["数を数える", "色・形を分類", "絵を描く"], social: ["ルールのある遊び"], toys: [{ name: "三輪車", cat: "motor" }, { name: "お絵かきボード", cat: "cognitive" }, { name: "ままごとセット（豪華）", cat: "social" }] },
  { month: "37〜48", ageMin: 37, ageMax: 48, motor: ["スキップができる", "細かい工作"], language: ["複雑な文章", "文字への興味"], cognitive: ["論理的思考", "工作・創造"], social: ["ルールを守る"], toys: [{ name: "レゴ（基本セット）", cat: "cognitive" }, { name: "カードゲーム", cat: "social" }, { name: "楽器おもちゃ", cat: "language" }] },
  { month: "49〜72", ageMin: 49, ageMax: 72, motor: ["縄跳び・ボール遊び", "折り紙・工作"], language: ["読み書きの練習", "ストーリー作り"], cognitive: ["戦略的思考", "STEM教育"], social: ["チームで遊ぶ"], toys: [{ name: "ボードゲーム", cat: "social" }, { name: "プログラミング玩具", cat: "cognitive" }, { name: "科学実験キット", cat: "cognitive" }] },
];

export const MONTH_BANNERS: Record<number, MonthBanner> = {
  2:  { emoji: "👁",  title: "0〜3ヶ月｜感覚の芽生え期",     milestones: ["👁 追視が始まる", "✋ 手をにぎる", "😊 社会的微笑み", "👂 音に反応する"] },
  5:  { emoji: "🤸", title: "4〜6ヶ月｜好奇心爆発期",        milestones: ["🤸 寝返りをする", "👐 物をつかむ", "🗣 喃語が始まる", "🪞 鏡に興味"] },
  8:  { emoji: "🐣", title: "7〜9ヶ月｜探索・移動期",        milestones: ["🐣 ハイハイする", "🏠 つかまり立ち", "🙈 かくれんぼ", "👋 バイバイを真似る"] },
  11: { emoji: "👶", title: "10〜12ヶ月｜言葉の準備期",      milestones: ["👶 初めての一歩", "🗣 パパ・ママと言う", "👆 指さしをする", "🔧 道具を使う"] },
  15: { emoji: "🚶", title: "1歳〜1歳半｜歩行・語彙爆発期",  milestones: ["🚶 歩行が安定", "📢 語彙が急増", "🏗 積み木を積む", "🎭 見立て遊び"] },
  21: { emoji: "🏃", title: "1歳半〜2歳｜自己主張期",        milestones: ["🏃 走る・跳ぶ", "💬 二語文が出る", "🎨 お絵かき", "👨‍👩‍👧 並行遊び"] },
  30: { emoji: "🌟", title: "2〜3歳｜質問攻め期",            milestones: ["🌟 なぜ？なに？が爆発", "🎠 三輪車に乗る", "🔢 数を数える", "🎭 ごっこ遊び"] },
  42: { emoji: "🎨", title: "3〜4歳｜想像力全開期",          milestones: ["🎨 複雑な絵を描く", "📖 ストーリーを話す", "🧩 論理的思考", "👫 ルールのある遊び"] },
  60: { emoji: "🏆", title: "4〜6歳｜就学準備期",            milestones: ["🏆 読み書きへの興味", "🎯 戦略的思考", "🤝 チームで遊ぶ", "💻 デジタル学習"] },
};

export const EXPERT_COMMENTS: Record<number, string> = {
  2:  "生後0〜3ヶ月は視覚・聴覚・触覚が急速に発達する時期です。高コントラストの模様や音の出るおもちゃで感覚刺激を与えましょう。",
  5:  "4〜6ヶ月は「つかむ」という行為が始まります。この時期の手指刺激は後の細かい運動発達の基礎となります。",
  8:  "7〜9ヶ月はハイハイが全身の協調運動を発達させます。十分な床運動の空間を確保し、探索意欲を刺激しましょう。",
  11: "12ヶ月は「物の永続性」を理解し始める重要な時期です。かくれんぼや積み木など、記憶力と予測能力が大きく育ちます。",
  15: "1歳〜1歳半は語彙爆発の直前期です。あらゆるものに言葉のラベルを貼るように話しかけましょう。",
  21: "2歳前後は自我の芽生えと「イヤイヤ期」が重なります。選択肢を与えて自己決定感を育てることが感情コントロールの発達を促します。",
  30: "2〜3歳は「なぜ？」「なに？」の質問攻め期。丁寧に答えることで科学的思考の基礎が育ちます。",
  42: "3〜4歳は想像力と創造力の黄金期。決まった遊び方のないオープンエンドなおもちゃが可能性を最大化します。",
  60: "就学前の4〜6歳は「実行機能」が急発達する時期です。ルールのあるゲームやパズルで前頭葉を積極的に鍛えましょう。",
};
