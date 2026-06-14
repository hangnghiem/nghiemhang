import type {
  GameState,
  Resources,
  Residents,
  ResidentKey,
  ResourceKey,
  Expedition,
  ExpeditionRoute,
  ExpeditionNode,
  EventType,
} from "./types";
import { VILLAGES, AREA_LABEL } from "./villages";

export const SAVE_VERSION = 1;

export const RESOURCE_LABEL: Record<ResourceKey, string> = {
  wood: "木材",
  stone: "石材",
  food: "食料",
  blueprint: "設計図",
  parts: "楽器パーツ",
  score: "古代楽譜",
};

export const RESOURCE_GLYPH: Record<ResourceKey, string> = {
  wood: "🪵",
  stone: "🪨",
  food: "🍞",
  blueprint: "📐",
  parts: "🔩",
  score: "📜",
};

export function emptyResources(): Resources {
  return { wood: 0, stone: 0, food: 0, blueprint: 0, parts: 0, score: 0 };
}

export function emptyResidents(): Residents {
  return {
    guitarist: 0,
    pianist: 0,
    drummer: 0,
    violinist: 0,
    conductor: 0,
    flutist: 0,
    saxophonist: 0,
    clarinetist: 0,
    marimbist: 0,
    timpanist: 0,
    shamisen: 0,
    erhu: 0,
    sitar: 0,
  };
}

export function createInitialState(playerName: string, isGuest: boolean): GameState {
  return {
    version: SAVE_VERSION,
    playerName: playerName || "開拓団リーダー",
    isGuest,
    resources: { ...emptyResources(), wood: 20, stone: 10, food: 10 },
    residents: emptyResidents(),
    builtVillages: ["foothills"],
    unlockedAreas: ["foothills", "strings"],
    currentVillageId: "foothills",
    discoveredInstruments: [],
    answeredQuestionIds: [],
    stats: { correct: 0, wrong: 0, expeditionsCompleted: 0 },
    expedition: null,
    lastSaved: Date.now(),
  };
}

export function totalPopulation(residents: Residents): number {
  return Object.values(residents).reduce((a, b) => a + b, 0);
}

export interface Bonuses {
  resource: number; // 資源獲得量倍率
  quizReward: number; // クイズ報酬倍率
  popularity: number; // 人気度倍率
  overall: number; // 全体ボーナス（加算値）
  rareEventsUnlocked: boolean;
}

export function computeBonuses(r: Residents): Bonuses {
  const overall = 0.05 * r.conductor + 0.03 * r.timpanist;
  return {
    resource: 1 + 0.1 * r.drummer + 0.05 * r.clarinetist + 0.05 * r.marimbist + overall,
    quizReward: 1 + 0.1 * r.pianist + 0.05 * r.flutist + 0.05 * r.erhu + overall,
    popularity: 1 + 0.1 * r.guitarist + 0.05 * r.saxophonist + 0.05 * r.sitar + overall,
    overall,
    rareEventsUnlocked: r.violinist > 0 || r.shamisen > 0,
  };
}

// ---- 村建設 ----
export function nextBuildableVillage(state: GameState) {
  return VILLAGES.find((v) => !state.builtVillages.includes(v.id)) ?? null;
}

export function canBuildVillage(state: GameState, villageId: string): boolean {
  const v = VILLAGES.find((x) => x.id === villageId);
  if (!v) return false;
  if (state.builtVillages.includes(v.id)) return false;
  const pop = totalPopulation(state.residents);
  return (
    state.resources.wood >= v.requirements.wood &&
    state.resources.stone >= v.requirements.stone &&
    pop >= v.requirements.population
  );
}

// ---- 登山ルート生成 ----
const AREA_ORDER = ["foothills", "strings", "winds", "percussion", "ethnic", "orchestra"];

const NODE_META: Record<EventType, { label: string; glyph: string }> = {
  quiz: { label: "楽器クイズ", glyph: "❓" },
  resource: { label: "資源獲得", glyph: "📦" },
  resident: { label: "住民発見", glyph: "🧑‍🎤" },
  treasure: { label: "宝箱", glyph: "🎁" },
  special: { label: "特殊イベント", glyph: "✨" },
  summit: { label: "山頂", glyph: "🏔️" },
};

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeNode(type: EventType, idx: number): ExpeditionNode {
  const meta = NODE_META[type];
  return {
    id: `${type}_${idx}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    label: meta.label,
    glyph: meta.glyph,
    resolved: false,
  };
}

function buildRoute(
  id: string,
  name: string,
  glyph: string,
  description: string,
  length: number,
  rareUnlocked: boolean,
): ExpeditionRoute {
  const types: EventType[] = [];
  // 最初は必ずクイズ
  types.push("quiz");
  const pool: EventType[] = ["quiz", "quiz", "resource", "resident", "treasure"];
  if (rareUnlocked) pool.push("special");
  for (let i = 1; i < length; i++) {
    types.push(rand(pool));
  }
  types.push("summit");
  return {
    id,
    name,
    glyph,
    description,
    nodes: types.map((t, i) => makeNode(t, i)),
  };
}

const ROUTE_FLAVORS: Record<string, { name: string; glyph: string; desc: string }[]> = {
  foothills: [
    { name: "なだらかな小道", glyph: "🌿", desc: "歩きやすい初心者向けルート" },
    { name: "森の近道", glyph: "🌲", desc: "木々の間を抜ける資源豊富なルート" },
  ],
  strings: [
    { name: "弦の谷ルート", glyph: "🎻", desc: "弦楽器の音が響く渓谷" },
    { name: "響きの尾根", glyph: "🎸", desc: "風が弦を鳴らす尾根道" },
  ],
  winds: [
    { name: "風笛の峠ルート", glyph: "🎺", desc: "強い風が吹き抜ける峠" },
    { name: "息吹の洞窟", glyph: "🪈", desc: "洞窟に音が反響するルート" },
  ],
  percussion: [
    { name: "鼓動の岩場", glyph: "🥁", desc: "足音が太鼓のように響く岩場" },
    { name: "雷鳴の崖ルート", glyph: "⚡", desc: "打楽器のような雷が鳴る崖" },
  ],
  ethnic: [
    { name: "古道の巡礼路", glyph: "🪕", desc: "各地の民族楽器が眠る古道" },
    { name: "異郷の隠れ道", glyph: "🏮", desc: "遠い国の音楽が聞こえる道" },
  ],
  orchestra: [
    { name: "頂への大階段", glyph: "🎼", desc: "山頂都市へ続く荘厳な道" },
    { name: "栄光の稜線", glyph: "🏙️", desc: "全楽器の音が交わる最終ルート" },
  ],
};

export function generateExpedition(areaId: string, rareUnlocked: boolean): Expedition {
  const flavors = ROUTE_FLAVORS[areaId] ?? ROUTE_FLAVORS.foothills;
  const areaIndex = Math.max(0, AREA_ORDER.indexOf(areaId));
  const length = 4 + Math.min(areaIndex, 4); // エリアが上がるほど長い
  const routes = flavors.map((f, i) =>
    buildRoute(`${areaId}_r${i}`, f.name, f.glyph, f.desc, length, rareUnlocked),
  );
  return {
    areaId,
    areaName: AREA_LABEL[areaId] ?? areaId,
    routes,
    chosenRouteId: null,
    currentNodeIndex: 0,
    loot: { resources: {}, residents: {}, instruments: [] },
  };
}

// ---- 報酬ロール ----
const RESIDENT_POOL_BY_AREA: Record<string, ResidentKey[]> = {
  foothills: ["guitarist", "pianist", "drummer"],
  strings: ["guitarist", "violinist", "pianist"],
  winds: ["flutist", "saxophonist", "clarinetist", "conductor"],
  percussion: ["drummer", "marimbist", "timpanist"],
  ethnic: ["shamisen", "erhu", "sitar", "violinist"],
  orchestra: ["conductor", "pianist", "violinist", "drummer", "guitarist"],
};

export function rollResident(areaId: string): ResidentKey {
  const pool = RESIDENT_POOL_BY_AREA[areaId] ?? RESIDENT_POOL_BY_AREA.foothills;
  // たまにレアな指揮者
  if (Math.random() < 0.08) return "conductor";
  return rand(pool);
}

export function rollResourceReward(
  areaId: string,
  bonuses: Bonuses,
): Partial<Resources> {
  const areaIndex = Math.max(0, AREA_ORDER.indexOf(areaId));
  const scale = 1 + areaIndex * 0.6;
  const base = (lo: number, hi: number) =>
    Math.round((lo + Math.random() * (hi - lo)) * scale * bonuses.resource);
  return {
    wood: base(15, 35),
    stone: base(8, 20),
    food: base(6, 16),
  };
}

export function rollTreasure(areaId: string, bonuses: Bonuses): Partial<Resources> {
  const areaIndex = Math.max(0, AREA_ORDER.indexOf(areaId));
  const scale = 1 + areaIndex * 0.7;
  const out: Partial<Resources> = {
    wood: Math.round((20 + Math.random() * 40) * scale * bonuses.resource),
    stone: Math.round((15 + Math.random() * 30) * scale * bonuses.resource),
  };
  // レア資源のチャンス
  const roll = Math.random();
  if (roll < 0.4) out.blueprint = 1;
  else if (roll < 0.7) out.parts = 1 + Math.floor(Math.random() * 2);
  else if (roll < 0.85) out.score = 1;
  return out;
}

export function quizResourceReward(bonuses: Bonuses): Partial<Resources> {
  const amt = (lo: number, hi: number) =>
    Math.round((lo + Math.random() * (hi - lo)) * bonuses.quizReward);
  return { wood: amt(8, 16), food: amt(4, 10) };
}

export function mergeResourcesInto(target: Resources, add: Partial<Resources>): Resources {
  const out = { ...target };
  (Object.keys(add) as ResourceKey[]).forEach((k) => {
    out[k] = (out[k] ?? 0) + (add[k] ?? 0);
  });
  return out;
}

export function mergeResidentsInto(target: Residents, key: ResidentKey, n = 1): Residents {
  return { ...target, [key]: target[key] + n };
}

export function formatResourceDelta(delta: Partial<Resources>): string {
  return (Object.keys(delta) as ResourceKey[])
    .filter((k) => (delta[k] ?? 0) !== 0)
    .map((k) => `${RESOURCE_GLYPH[k]}${RESOURCE_LABEL[k]} +${delta[k]}`)
    .join("  ");
}
