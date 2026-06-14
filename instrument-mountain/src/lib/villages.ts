import type { VillageDef, ResidentDef } from "./types";

// 村の進行: ふもと → 弦楽器村 → 管楽器村 → 打楽器村 → 民族楽器村 → オーケストラ都市
export const VILLAGES: VillageDef[] = [
  {
    id: "foothills",
    name: "ふもとの村",
    theme: "開拓の出発点。すべての登山はここから始まる。",
    glyph: "🏕️",
    requirements: { wood: 0, stone: 0, population: 0 },
    reward: "弦楽器エリア解放",
    unlocks: "strings",
  },
  {
    id: "strings_village",
    name: "弦楽器村",
    theme: "ギタリスト・バイオリニスト・チェリストが暮らす村。",
    glyph: "🎻",
    requirements: { wood: 100, stone: 50, population: 10 },
    reward: "管楽器エリア解放",
    unlocks: "winds",
  },
  {
    id: "winds_village",
    name: "管楽器村",
    theme: "フルート奏者・サックス奏者・クラリネット奏者が暮らす村。",
    glyph: "🎺",
    requirements: { wood: 300, stone: 150, population: 25 },
    reward: "打楽器エリア解放",
    unlocks: "percussion",
  },
  {
    id: "percussion_village",
    name: "打楽器村",
    theme: "ドラマー・マリンバ奏者・ティンパニ奏者が暮らす村。",
    glyph: "🥁",
    requirements: { wood: 700, stone: 400, population: 50 },
    reward: "民族楽器エリア解放",
    unlocks: "ethnic",
  },
  {
    id: "ethnic_village",
    name: "民族楽器村",
    theme: "三味線奏者・二胡奏者・シタール奏者が暮らす村。",
    glyph: "🪕",
    requirements: { wood: 1200, stone: 700, population: 80 },
    reward: "オーケストラ都市解放",
    unlocks: "orchestra",
  },
  {
    id: "orchestra_city",
    name: "オーケストラ都市",
    theme: "全ジャンルの音楽家が集う、山頂の巨大都市。最終目標。",
    glyph: "🏙️",
    requirements: { wood: 2500, stone: 1500, population: 150 },
    reward: "ゲームクリア！",
    unlocks: null,
  },
];

export const VILLAGE_BY_ID: Record<string, VillageDef> = Object.fromEntries(
  VILLAGES.map((v) => [v.id, v]),
);

// エリアID → 表示名
export const AREA_LABEL: Record<string, string> = {
  foothills: "ふもと",
  strings: "弦楽器エリア",
  winds: "管楽器エリア",
  percussion: "打楽器エリア",
  ethnic: "民族楽器エリア",
  orchestra: "山頂エリア",
};

export const RESIDENTS: ResidentDef[] = [
  { key: "guitarist", name: "ギタリスト", glyph: "🎸", effect: "人気度 +10%" },
  { key: "pianist", name: "ピアニスト", glyph: "🎹", effect: "クイズ報酬 +10%" },
  { key: "drummer", name: "ドラマー", glyph: "🥁", effect: "資源獲得量 +10%" },
  { key: "violinist", name: "バイオリニスト", glyph: "🎻", effect: "レアイベント解放" },
  { key: "conductor", name: "指揮者", glyph: "🪄", effect: "全体ボーナス +5%" },
  { key: "flutist", name: "フルート奏者", glyph: "🪈", effect: "クイズ報酬 +5%" },
  { key: "saxophonist", name: "サックス奏者", glyph: "🎷", effect: "人気度 +5%" },
  { key: "clarinetist", name: "クラリネット奏者", glyph: "🎶", effect: "資源獲得量 +5%" },
  { key: "marimbist", name: "マリンバ奏者", glyph: "🎵", effect: "資源獲得量 +5%" },
  { key: "timpanist", name: "ティンパニ奏者", glyph: "🥁", effect: "全体ボーナス +3%" },
  { key: "shamisen", name: "三味線奏者", glyph: "🪕", effect: "レアイベント解放" },
  { key: "erhu", name: "二胡奏者", glyph: "🎻", effect: "クイズ報酬 +5%" },
  { key: "sitar", name: "シタール奏者", glyph: "🎼", effect: "人気度 +5%" },
];

export const RESIDENT_BY_KEY: Record<string, ResidentDef> = Object.fromEntries(
  RESIDENTS.map((r) => [r.key, r]),
);
