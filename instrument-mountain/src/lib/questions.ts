import type { QuizQuestion } from "./types";
import { INSTRUMENTS, IMAGE_INSTRUMENTS, CATEGORY_LABEL } from "./instruments";

// ---- 決定論的シャッフル（保存データと整合させるため id をシードに使う）----
function hashString(s: string): number {
  let h = 1779033703 ^ s.length;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors(
  correctName: string,
  pool: string[],
  count: number,
  seed: number,
): string[] {
  const others = pool.filter((n) => n !== correctName);
  return seededShuffle(others, seed).slice(0, count);
}

const ALL_NAMES = INSTRUMENTS.map((i) => i.name);

// ---- 画像クイズ・シルエットクイズを自動生成 ----
function buildVisualQuestions(): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  for (const inst of IMAGE_INSTRUMENTS) {
    // 同カテゴリ優先で紛らわしい選択肢を作る
    const sameCat = INSTRUMENTS.filter(
      (i) => i.category === inst.category && i.name !== inst.name,
    ).map((i) => i.name);
    const distractorPool = [...new Set([...sameCat, ...ALL_NAMES])];

    for (const type of ["image", "silhouette"] as const) {
      const id = `${type}_${inst.id}`;
      const seed = hashString(id);
      const distractors = pickDistractors(inst.name, distractorPool, 3, seed);
      const choices = seededShuffle([inst.name, ...distractors], seed + 7);
      out.push({
        id,
        type,
        prompt:
          type === "image"
            ? "この楽器は何ですか？"
            : "このシルエットの楽器は何ですか？",
        choices,
        answerIndex: choices.indexOf(inst.name),
        instrumentId: inst.id,
        explanation: `${inst.name}：${inst.description}`,
      });
    }
  }
  return out;
}

// ---- 知識クイズ（手書き・楽器のみ）----
const KNOWLEDGE: QuizQuestion[] = [
  {
    id: "k_piano_keys",
    type: "knowledge",
    prompt: "標準的なピアノの鍵盤数は？",
    choices: ["88", "76", "61", "49"],
    answerIndex: 0,
    instrumentId: "piano",
    explanation: "標準的なピアノの鍵盤数は88鍵です。",
  },
  {
    id: "k_violin_strings",
    type: "knowledge",
    prompt: "バイオリンの弦の数は？",
    choices: ["4本", "5本", "6本", "3本"],
    answerIndex: 0,
    instrumentId: "violin",
    explanation: "バイオリンの弦は G・D・A・E の4本です。",
  },
  {
    id: "k_guitar_strings",
    type: "knowledge",
    prompt: "標準的なギターの弦の数は？",
    choices: ["6本", "4本", "5本", "12本"],
    answerIndex: 0,
    instrumentId: "guitar",
    explanation: "標準的なギターの弦は6本です。",
  },
  {
    id: "k_lowest_string",
    type: "knowledge",
    prompt: "弦楽器の中で最も低い音を出すのは？",
    choices: ["コントラバス", "チェロ", "ビオラ", "バイオリン"],
    answerIndex: 0,
    instrumentId: "contrabass",
    explanation: "コントラバスは弦楽器で最も大きく、最も低い音を出します。",
  },
  {
    id: "k_orch_tuning",
    type: "knowledge",
    prompt: "オーケストラのチューニングで基準音(A)を出す楽器は？",
    choices: ["オーボエ", "フルート", "トランペット", "ティンパニ"],
    answerIndex: 0,
    instrumentId: "oboe",
    explanation: "オーボエが基準音(A)を出し、それに合わせて全体が調律します。",
  },
  {
    id: "k_double_reed",
    type: "knowledge",
    prompt: "次のうちダブルリードの楽器は？",
    choices: ["オーボエ", "クラリネット", "フルート", "サックス"],
    answerIndex: 0,
    instrumentId: "oboe",
    explanation: "オーボエとファゴットは2枚のリードを使うダブルリード楽器です。",
  },
  {
    id: "k_single_reed",
    type: "knowledge",
    prompt: "1枚のリードで音を出す木管楽器は？",
    choices: ["クラリネット", "オーボエ", "ファゴット", "フルート"],
    answerIndex: 0,
    instrumentId: "clarinet",
    explanation: "クラリネットとサックスはシングルリード楽器です。",
  },
  {
    id: "k_flute_air",
    type: "knowledge",
    prompt: "リードを使わず息を吹き当てて音を出す楽器は？",
    choices: ["フルート", "クラリネット", "オーボエ", "サックス"],
    answerIndex: 0,
    instrumentId: "flute",
    explanation: "フルートはエアリード楽器で、リードを使いません。",
  },
  {
    id: "k_slide",
    type: "knowledge",
    prompt: "スライドを伸縮させて音程を変える金管楽器は？",
    choices: ["トロンボーン", "トランペット", "ホルン", "チューバ"],
    answerIndex: 0,
    instrumentId: "trombone",
    explanation: "トロンボーンはスライドで音程を変える珍しい金管楽器です。",
  },
  {
    id: "k_brass_low",
    type: "knowledge",
    prompt: "金管楽器の中で最も低い音を支えるのは？",
    choices: ["チューバ", "ホルン", "トランペット", "トロンボーン"],
    answerIndex: 0,
    instrumentId: "tuba",
    explanation: "チューバは金管楽器で最も大きく、低音の土台を担います。",
  },
  {
    id: "k_sax_wood",
    type: "knowledge",
    prompt: "金属製なのに「木管楽器」に分類されるのは？",
    choices: ["サックス", "トランペット", "ホルン", "チューバ"],
    answerIndex: 0,
    instrumentId: "saxophone",
    explanation: "サックスはリードで音を出すため木管楽器に分類されます。",
  },
  {
    id: "k_timpani_pitch",
    type: "knowledge",
    prompt: "ペダルで音程を変えられる打楽器は？",
    choices: ["ティンパニ", "スネアドラム", "シンバル", "トライアングル"],
    answerIndex: 0,
    instrumentId: "timpani",
    explanation: "ティンパニはペダルで皮の張力を変え、音程を調整します。",
  },
  {
    id: "k_snare_wire",
    type: "knowledge",
    prompt: "裏面に響き線(スナッピー)を張った打楽器は？",
    choices: ["スネアドラム", "ティンパニ", "マリンバ", "シンバル"],
    answerIndex: 0,
    instrumentId: "snaredrum",
    explanation: "スネアドラムは響き線が独特のザラっとした音を生みます。",
  },
  {
    id: "k_marimba_wood",
    type: "knowledge",
    prompt: "木製の音板をマレットで叩く鍵盤打楽器は？",
    choices: ["マリンバ", "ティンパニ", "シンバル", "スネアドラム"],
    answerIndex: 0,
    instrumentId: "marimba",
    explanation: "マリンバは木製音板の下に共鳴管を持つ鍵盤打楽器です。",
  },
  {
    id: "k_shamisen_strings",
    type: "knowledge",
    prompt: "三味線の弦の数は？",
    choices: ["3本", "2本", "4本", "6本"],
    answerIndex: 0,
    instrumentId: "shamisen",
    explanation: "三味線は3本の弦をバチで弾く日本の楽器です。",
  },
  {
    id: "k_erhu_strings",
    type: "knowledge",
    prompt: "中国の擦弦楽器「二胡」の弦の数は？",
    choices: ["2本", "1本", "3本", "4本"],
    answerIndex: 0,
    instrumentId: "erhu",
    explanation: "二胡は2本の弦の間に弓を通して弾きます。",
  },
  {
    id: "k_sitar_country",
    type: "knowledge",
    prompt: "シタールはどこの国の楽器？",
    choices: ["インド", "日本", "中国", "スペイン"],
    answerIndex: 0,
    instrumentId: "sitar",
    explanation: "シタールはインドの撥弦楽器で、多数の共鳴弦を持ちます。",
  },
  {
    id: "k_koto_strings",
    type: "knowledge",
    prompt: "一般的な箏(こと)の弦の数は？",
    choices: ["13本", "6本", "21本", "9本"],
    answerIndex: 0,
    instrumentId: "koto",
    explanation: "一般的な箏は13本の弦を持ち、柱(じ)で調弦します。",
  },
  {
    id: "k_bagpipe_country",
    type: "knowledge",
    prompt: "袋に空気をためて鳴らす、スコットランドで有名な楽器は？",
    choices: ["バグパイプ", "オカリナ", "パンフルート", "シタール"],
    answerIndex: 0,
    instrumentId: "bagpipe",
    explanation: "バグパイプは持続するドローン音が特徴の管楽器です。",
  },
  {
    id: "k_didgeridoo",
    type: "knowledge",
    prompt: "オーストラリア先住民の、長い筒で低音を出す管楽器は？",
    choices: ["ディジュリドゥ", "バグパイプ", "パンフルート", "リコーダー"],
    answerIndex: 0,
    instrumentId: "didgeridoo",
    explanation: "ディジュリドゥは循環呼吸で音を途切れさせず奏でます。",
  },
  {
    id: "k_harp_strings",
    type: "knowledge",
    prompt: "コンサートハープのおおよその弦の数は？",
    choices: ["47本", "13本", "6本", "88本"],
    answerIndex: 0,
    instrumentId: "harp",
    explanation: "コンサートハープは47本前後の弦を持ちます。",
  },
  {
    id: "k_organ_king",
    type: "knowledge",
    prompt: "「楽器の王様」と呼ばれる鍵盤楽器は？",
    choices: ["パイプオルガン", "ピアノ", "チェンバロ", "アコーディオン"],
    answerIndex: 0,
    instrumentId: "organ",
    explanation: "パイプオルガンはその壮大さから王様と呼ばれます。",
  },
  {
    id: "k_harpsichord",
    type: "knowledge",
    prompt: "弦をはじいて音を出す、バロック期の鍵盤楽器は？",
    choices: ["チェンバロ", "ピアノ", "オルガン", "アコーディオン"],
    answerIndex: 0,
    instrumentId: "harpsichord",
    explanation: "チェンバロは弦をはじく機構を持つ鍵盤楽器です。",
  },
  {
    id: "k_accordion_bellows",
    type: "knowledge",
    prompt: "蛇腹(ベローズ)で空気を送って鳴らす楽器は？",
    choices: ["アコーディオン", "オルガン", "ピアノ", "ハープ"],
    answerIndex: 0,
    instrumentId: "accordion",
    explanation: "アコーディオンは蛇腹の開閉でリードを鳴らします。",
  },
  {
    id: "k_banjo_genre",
    type: "knowledge",
    prompt: "丸い太鼓状の胴を持ち、ブルーグラスで活躍する弦楽器は？",
    choices: ["バンジョー", "ウクレレ", "シタール", "ハープ"],
    answerIndex: 0,
    instrumentId: "banjo",
    explanation: "バンジョーは明るく歯切れのよい音色が特徴です。",
  },
  {
    id: "k_ukulele_origin",
    type: "knowledge",
    prompt: "ハワイ生まれの小型4弦楽器は？",
    choices: ["ウクレレ", "バンジョー", "シタール", "二胡"],
    answerIndex: 0,
    instrumentId: "ukulele",
    explanation: "ウクレレはポルトガルの楽器がハワイに伝わって生まれました。",
  },
  {
    id: "k_recorder_school",
    type: "knowledge",
    prompt: "縦に構えて吹く、学校でもおなじみの木管楽器は？",
    choices: ["リコーダー", "フルート", "クラリネット", "トランペット"],
    answerIndex: 0,
    instrumentId: "recorder",
    explanation: "リコーダーには大きさの違う種類があります。",
  },
  {
    id: "k_horn_hand",
    type: "knowledge",
    prompt: "右手をベルに入れて音色を調整する金管楽器は？",
    choices: ["ホルン", "トランペット", "トロンボーン", "チューバ"],
    answerIndex: 0,
    instrumentId: "horn",
    explanation: "ホルンは渦巻く管と柔らかい音色が特徴です。",
  },
  {
    id: "k_marakas",
    type: "knowledge",
    prompt: "中に粒を入れて振り鳴らす、ラテン音楽の打楽器は？",
    choices: ["マラカス", "カスタネット", "タンバリン", "トライアングル"],
    answerIndex: 0,
    instrumentId: "marakas",
    explanation: "マラカスはもとひょうたんに種を入れて作られました。",
  },
  {
    id: "k_castanets",
    type: "knowledge",
    prompt: "貝殻状の木片を打ち合わせる、スペイン舞踊の打楽器は？",
    choices: ["カスタネット", "マラカス", "タンバリン", "シンバル"],
    answerIndex: 0,
    instrumentId: "castanets",
    explanation: "カスタネットはフラメンコのリズムに欠かせません。",
  },
  {
    id: "k_tambourine",
    type: "knowledge",
    prompt: "枠に金属円盤(ジングル)が付いた、振っても叩いても鳴る打楽器は？",
    choices: ["タンバリン", "カスタネット", "マラカス", "トライアングル"],
    answerIndex: 0,
    instrumentId: "tambourine",
    explanation: "タンバリンの金属円盤はジングルと呼ばれます。",
  },
  {
    id: "k_djembe",
    type: "knowledge",
    prompt: "西アフリカ生まれの、手で叩くゴブレット型の太鼓は？",
    choices: ["ジャンベ", "ティンパニ", "スネアドラム", "マリンバ"],
    answerIndex: 0,
    instrumentId: "djembe",
    explanation: "ジャンベは手で多彩な音を出せる片面太鼓です。",
  },
  {
    id: "k_triangle",
    type: "knowledge",
    prompt: "三角形の金属棒を叩く、澄んだ余韻の打楽器は？",
    choices: ["トライアングル", "シンバル", "カスタネット", "マラカス"],
    answerIndex: 0,
    instrumentId: "triangle",
    explanation: "片側が開いた三角形で自由に響くようになっています。",
  },
  {
    id: "k_cymbals",
    type: "knowledge",
    prompt: "2枚の金属円盤を打ち合わせる打楽器は？",
    choices: ["シンバル", "トライアングル", "マリンバ", "ティンパニ"],
    answerIndex: 0,
    instrumentId: "cymbals",
    explanation: "合わせシンバルとサスペンドシンバルがあります。",
  },
  {
    id: "k_xylophone_meaning",
    type: "knowledge",
    prompt: "ギリシャ語で「木の音」を意味する鍵盤打楽器は？",
    choices: ["シロフォン", "マリンバ", "ティンパニ", "シンバル"],
    answerIndex: 0,
    instrumentId: "xylophone",
    explanation: "シロフォンはマリンバより高く硬い音色を持ちます。",
  },
  {
    id: "k_ocarina_meaning",
    type: "knowledge",
    prompt: "イタリア語で「小さなガチョウ」を意味する卵形の笛は？",
    choices: ["オカリナ", "リコーダー", "パンフルート", "フルート"],
    answerIndex: 0,
    instrumentId: "ocarina",
    explanation: "オカリナは土や陶器で作られ素朴な音色を持ちます。",
  },
  {
    id: "k_panflute",
    type: "knowledge",
    prompt: "長さの違う管を束ねた、南米アンデスの笛は？",
    choices: ["パンフルート", "オカリナ", "リコーダー", "バグパイプ"],
    answerIndex: 0,
    instrumentId: "panflute",
    explanation: "管の長さの違いで音程が決まります。",
  },
  {
    id: "k_viola_pitch",
    type: "knowledge",
    prompt: "バイオリンよりひと回り大きく、低めの音色を持つ弦楽器は？",
    choices: ["ビオラ", "チェロ", "コントラバス", "ハープ"],
    answerIndex: 0,
    instrumentId: "viola",
    explanation: "ビオラはバイオリンより5度低く調弦されます。",
  },
  {
    id: "k_cello_voice",
    type: "knowledge",
    prompt: "「人間の声に最も近い」と言われる弦楽器は？",
    choices: ["チェロ", "バイオリン", "コントラバス", "ハープ"],
    answerIndex: 0,
    instrumentId: "cello",
    explanation: "チェロは豊かな中低音で人の声に近いと言われます。",
  },
  {
    id: "k_fagotto",
    type: "knowledge",
    prompt: "長い管を二つ折りにした低音のダブルリード楽器は？",
    choices: ["ファゴット", "オーボエ", "クラリネット", "チューバ"],
    answerIndex: 0,
    instrumentId: "fagotto",
    explanation: "ファゴットはバスーンとも呼ばれます。",
  },
  {
    id: "k_trumpet_high",
    type: "knowledge",
    prompt: "金管楽器で最も高い音域を担当することが多いのは？",
    choices: ["トランペット", "チューバ", "トロンボーン", "ホルン"],
    answerIndex: 0,
    instrumentId: "trumpet",
    explanation: "トランペットは3つのバルブを持つ金管楽器です。",
  },
  {
    id: "k_woodwind_group",
    type: "knowledge",
    prompt: "次のうち「木管楽器」はどれ？",
    choices: ["クラリネット", "トランペット", "ティンパニ", "ピアノ"],
    answerIndex: 0,
    instrumentId: "clarinet",
    explanation: "クラリネットはリードを使う木管楽器です。",
  },
  {
    id: "k_brass_group",
    type: "knowledge",
    prompt: "次のうち「金管楽器」はどれ？",
    choices: ["ホルン", "フルート", "マリンバ", "ハープ"],
    answerIndex: 0,
    instrumentId: "horn",
    explanation: "ホルンは唇の振動で音を出す金管楽器です。",
  },
  {
    id: "k_string_group",
    type: "knowledge",
    prompt: "次のうち「弦楽器」はどれ？",
    choices: ["ハープ", "オーボエ", "ティンパニ", "トランペット"],
    answerIndex: 0,
    instrumentId: "harp",
    explanation: "ハープは多数の弦を張った弦楽器です。",
  },
  {
    id: "k_perc_pitch",
    type: "knowledge",
    prompt: "打楽器の中でも明確な音程を出せるのは？",
    choices: ["ティンパニ", "スネアドラム", "シンバル", "カスタネット"],
    answerIndex: 0,
    instrumentId: "timpani",
    explanation: "ティンパニは音程を調整できる珍しい打楽器です。",
  },
  {
    id: "k_piano_mechanism",
    type: "knowledge",
    prompt: "ピアノはどうやって音を出す？",
    choices: ["ハンマーで弦を打つ", "弦をはじく", "弦をこする", "息を吹き込む"],
    answerIndex: 0,
    instrumentId: "piano",
    explanation: "ピアノはハンマーで弦を打って音を出します。",
  },
  {
    id: "k_didgeridoo_breath",
    type: "knowledge",
    prompt: "音を途切れさせない「循環呼吸」で演奏される楽器は？",
    choices: ["ディジュリドゥ", "フルート", "ピアノ", "ハープ"],
    answerIndex: 0,
    instrumentId: "didgeridoo",
    explanation: "ディジュリドゥは循環呼吸で連続した低音を出します。",
  },
  {
    id: "k_jazz_bass",
    type: "knowledge",
    prompt: "ジャズで「ウッドベース」とも呼ばれる楽器は？",
    choices: ["コントラバス", "チェロ", "ビオラ", "ハープ"],
    answerIndex: 0,
    instrumentId: "contrabass",
    explanation: "コントラバスはジャズでウッドベースと呼ばれます。",
  },
  {
    id: "k_sax_inventor",
    type: "knowledge",
    prompt: "サックスの名前の由来となった発明者は？",
    choices: ["アドルフ・サックス", "ストラディバリ", "ベーム", "グァルネリ"],
    answerIndex: 0,
    instrumentId: "saxophone",
    explanation: "サックスは発明者アドルフ・サックスにちなみます。",
  },
  {
    id: "k_koto_bridge",
    type: "knowledge",
    prompt: "箏(こと)で音程を調整するために動かす部品は？",
    choices: ["柱(じ)", "フレット", "バルブ", "ペダル"],
    answerIndex: 0,
    instrumentId: "koto",
    explanation: "箏は柱(じ)を動かして調弦します。",
  },
];

// ---- 100問の問題バンクを組み立て ----
function buildQuestionBank(): QuizQuestion[] {
  const visual = buildVisualQuestions(); // 画像 + シルエット
  const bank = [...visual, ...KNOWLEDGE];

  // 不足分を「分類クイズ」で補い、ちょうど100問にする
  if (bank.length < 100) {
    const catLabels = Object.values(CATEGORY_LABEL);
    const used = new Set(bank.map((q) => q.id));
    for (const inst of INSTRUMENTS) {
      if (bank.length >= 100) break;
      const id = `cat_${inst.id}`;
      if (used.has(id)) continue;
      const correct = CATEGORY_LABEL[inst.category];
      const seed = hashString(id);
      const choices = seededShuffle(catLabels, seed).slice(0, 4);
      if (!choices.includes(correct)) choices[0] = correct;
      const shuffled = seededShuffle(choices, seed + 3);
      bank.push({
        id,
        type: "knowledge",
        prompt: `「${inst.name}」は何楽器に分類される？`,
        choices: shuffled,
        answerIndex: shuffled.indexOf(correct),
        instrumentId: inst.id,
        explanation: `${inst.name}は${correct}に分類されます。`,
      });
    }
  }

  return bank.slice(0, 100);
}

export const QUESTION_BANK: QuizQuestion[] = buildQuestionBank();

export const QUESTION_BY_ID: Record<string, QuizQuestion> = Object.fromEntries(
  QUESTION_BANK.map((q) => [q.id, q]),
);

// まだ解いていない問題を優先して1問選ぶ
export function pickQuestion(
  answeredIds: string[],
  preferType?: QuizQuestion["type"],
): QuizQuestion {
  const answered = new Set(answeredIds);
  let pool = QUESTION_BANK.filter((q) => !answered.has(q.id));
  if (pool.length === 0) pool = QUESTION_BANK; // 全部解いたら復習
  if (preferType) {
    const typed = pool.filter((q) => q.type === preferType);
    if (typed.length > 0) pool = typed;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
