// 楽器の山 - 型定義

export type InstrumentCategory =
  | "strings" // 弦楽器
  | "winds" // 管楽器
  | "percussion" // 打楽器
  | "keyboard" // 鍵盤楽器
  | "ethnic"; // 民族楽器

export interface Instrument {
  id: string;
  name: string; // 日本語名
  reading: string; // よみがな
  category: InstrumentCategory;
  glyph: string; // 表示用の絵文字
  hasImage: boolean; // 画像・シルエットクイズに使えるか
  description: string; // 図鑑の説明
  fact: string; // 豆知識
}

export type QuizType = "image" | "silhouette" | "knowledge";

export interface QuizQuestion {
  id: string;
  type: QuizType;
  prompt: string;
  choices: string[];
  answerIndex: number;
  instrumentId?: string; // 関連楽器（図鑑登録用）
  explanation?: string;
}

// 基本資源 + レア資源
export type ResourceKey =
  | "wood" // 木材
  | "stone" // 石材
  | "food" // 食料
  | "blueprint" // 設計図
  | "parts" // 楽器パーツ
  | "score"; // 古代楽譜

export type Resources = Record<ResourceKey, number>;

export type ResidentKey =
  | "guitarist" // ギタリスト
  | "pianist" // ピアニスト
  | "drummer" // ドラマー
  | "violinist" // バイオリニスト
  | "conductor" // 指揮者
  | "flutist" // フルート奏者
  | "saxophonist" // サックス奏者
  | "clarinetist" // クラリネット奏者
  | "marimbist" // マリンバ奏者
  | "timpanist" // ティンパニ奏者
  | "shamisen" // 三味線奏者
  | "erhu" // 二胡奏者
  | "sitar"; // シタール奏者

export type Residents = Record<ResidentKey, number>;

export interface ResidentDef {
  key: ResidentKey;
  name: string;
  glyph: string;
  effect: string; // 効果の説明
}

export interface VillageDef {
  id: string;
  name: string;
  theme: string;
  glyph: string;
  // 建設条件
  requirements: {
    wood: number;
    stone: number;
    population: number;
  };
  reward: string; // 解放報酬の説明
  unlocks: string | null; // 次に解放されるエリアID
}

// 登山イベントの種類
export type EventType =
  | "quiz"
  | "resource"
  | "resident"
  | "treasure"
  | "special"
  | "summit";

export interface ExpeditionNode {
  id: string;
  type: EventType;
  label: string;
  glyph: string;
  resolved: boolean;
}

export interface ExpeditionRoute {
  id: string;
  name: string;
  glyph: string;
  description: string;
  nodes: ExpeditionNode[];
}

export interface Expedition {
  areaId: string;
  areaName: string;
  routes: ExpeditionRoute[];
  chosenRouteId: string | null;
  currentNodeIndex: number;
  loot: {
    resources: Partial<Resources>;
    residents: Partial<Residents>;
    instruments: string[];
  };
}

export interface GameState {
  version: number;
  playerName: string;
  isGuest: boolean;
  resources: Resources;
  residents: Residents;
  builtVillages: string[]; // 建設済みの村ID
  unlockedAreas: string[]; // 解放済みエリアID
  currentVillageId: string; // 現在の拠点
  discoveredInstruments: string[]; // 図鑑に登録された楽器ID
  answeredQuestionIds: string[];
  stats: {
    correct: number;
    wrong: number;
    expeditionsCompleted: number;
  };
  expedition: Expedition | null;
  lastSaved: number;
}
