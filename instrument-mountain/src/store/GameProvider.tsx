"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import type { GameState, QuizQuestion, Resources } from "@/lib/types";
import {
  createInitialState,
  computeBonuses,
  totalPopulation,
  generateExpedition,
  rollResident,
  rollResourceReward,
  rollTreasure,
  quizResourceReward,
  mergeResourcesInto,
  mergeResidentsInto,
  canBuildVillage,
  RESOURCE_LABEL,
  RESOURCE_GLYPH,
  type Bonuses,
} from "@/lib/game";
import { VILLAGE_BY_ID } from "@/lib/villages";
import { saveGame, loadGame, clearSave } from "@/lib/storage";
import { RESIDENT_BY_KEY } from "@/lib/villages";
import { INSTRUMENT_BY_ID } from "@/lib/instruments";

export interface EventReward {
  title: string;
  detail: string;
  glyph: string;
}

export interface QuizResult {
  correct: boolean;
  answerIndex: number;
  reward?: Partial<Resources>;
  discoveredName?: string;
  explanation?: string;
}

interface GameContextValue {
  state: GameState | null;
  ready: boolean;
  bonuses: Bonuses;
  population: number;
  newGame: (name: string, isGuest: boolean) => void;
  loadSaved: () => boolean;
  reset: () => void;
  startExpedition: (areaId: string) => void;
  chooseRoute: (routeId: string) => void;
  answerQuiz: (q: QuizQuestion, choiceIndex: number) => QuizResult;
  resolveEvent: () => EventReward;
  nextNode: () => void;
  finishExpedition: () => void;
  abandonExpedition: () => void;
  buildVillage: (villageId: string) => boolean;
  canBuild: (villageId: string) => boolean;
}

interface RState {
  ready: boolean;
  game: GameState | null;
}

type Action =
  | { type: "INIT"; game: GameState | null }
  | { type: "SET"; game: GameState | null };

function reducer(s: RState, action: Action): RState {
  switch (action.type) {
    case "INIT":
      return { ready: true, game: action.game };
    case "SET":
      return { ready: s.ready, game: action.game };
    default:
      return s;
  }
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [rs, dispatch] = useReducer(reducer, { ready: false, game: null });
  const state = rs.game;
  const ready = rs.ready;
  const stateRef = useRef<GameState | null>(null);

  // 初回マウント時にセーブを読み込む（あれば）
  useEffect(() => {
    const saved = loadGame();
    stateRef.current = saved ?? null;
    dispatch({ type: "INIT", game: saved ?? null });
  }, []);

  // ハンドラから最新状態を同期参照できるよう ref を更新
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // 自動セーブ
  useEffect(() => {
    if (state) saveGame(state);
  }, [state]);

  const set = useCallback((next: GameState) => {
    stateRef.current = next;
    dispatch({ type: "SET", game: next });
  }, []);

  const newGame = useCallback(
    (name: string, isGuest: boolean) => {
      set(createInitialState(name, isGuest));
    },
    [set],
  );

  const loadSaved = useCallback(() => {
    const saved = loadGame();
    if (saved) {
      set(saved);
      return true;
    }
    return false;
  }, [set]);

  const reset = useCallback(() => {
    clearSave();
    stateRef.current = null;
    dispatch({ type: "SET", game: null });
  }, []);

  const startExpedition = useCallback(
    (areaId: string) => {
      const s = stateRef.current;
      if (!s) return;
      const b = computeBonuses(s.residents);
      const expedition = generateExpedition(areaId, b.rareEventsUnlocked);
      set({ ...s, expedition });
    },
    [set],
  );

  const chooseRoute = useCallback(
    (routeId: string) => {
      const s = stateRef.current;
      if (!s || !s.expedition) return;
      set({
        ...s,
        expedition: { ...s.expedition, chosenRouteId: routeId, currentNodeIndex: 0 },
      });
    },
    [set],
  );

  const answerQuiz = useCallback(
    (q: QuizQuestion, choiceIndex: number): QuizResult => {
      const s = stateRef.current;
      if (!s) return { correct: false, answerIndex: q.answerIndex };
      const correct = choiceIndex === q.answerIndex;
      const b = computeBonuses(s.residents);

      let resources = s.resources;
      const discovered = [...s.discoveredInstruments];
      let discoveredName: string | undefined;
      let reward: Partial<Resources> | undefined;

      if (correct) {
        reward = quizResourceReward(b);
        resources = mergeResourcesInto(resources, reward);
        if (q.instrumentId && !discovered.includes(q.instrumentId)) {
          discovered.push(q.instrumentId);
          discoveredName = INSTRUMENT_BY_ID[q.instrumentId]?.name;
        }
      }

      const answeredQuestionIds = s.answeredQuestionIds.includes(q.id)
        ? s.answeredQuestionIds
        : [...s.answeredQuestionIds, q.id];

      // 現在のクイズノードを解決済みにする
      let expedition = s.expedition;
      if (expedition && expedition.chosenRouteId) {
        const route = expedition.routes.find((r) => r.id === expedition!.chosenRouteId);
        if (route) {
          const node = route.nodes[expedition.currentNodeIndex];
          if (node && !node.resolved) {
            node.resolved = true;
            const loot = {
              resources: reward
                ? addPartial(expedition.loot.resources, reward)
                : expedition.loot.resources,
              residents: expedition.loot.residents,
              instruments:
                discoveredName && q.instrumentId
                  ? [...expedition.loot.instruments, q.instrumentId]
                  : expedition.loot.instruments,
            };
            expedition = { ...expedition, loot };
          }
        }
      }

      set({
        ...s,
        resources,
        discoveredInstruments: discovered,
        answeredQuestionIds,
        stats: {
          ...s.stats,
          correct: s.stats.correct + (correct ? 1 : 0),
          wrong: s.stats.wrong + (correct ? 0 : 1),
        },
        expedition,
      });

      return {
        correct,
        answerIndex: q.answerIndex,
        reward,
        discoveredName,
        explanation: q.explanation,
      };
    },
    [set],
  );

  const resolveEvent = useCallback((): EventReward => {
    const s = stateRef.current;
    if (!s || !s.expedition || !s.expedition.chosenRouteId)
      return { title: "", detail: "", glyph: "" };
    const exp = s.expedition;
    const route = exp.routes.find((r) => r.id === exp.chosenRouteId)!;
    const node = route.nodes[exp.currentNodeIndex];
    const b = computeBonuses(s.residents);

    let resources = s.resources;
    let residents = s.residents;
    let loot = {
      resources: { ...exp.loot.resources },
      residents: { ...exp.loot.residents },
      instruments: [...exp.loot.instruments],
    };
    let result: EventReward = { title: "", detail: "", glyph: node.glyph };

    if (node.type === "resource") {
      const r = rollResourceReward(exp.areaId, b);
      resources = mergeResourcesInto(resources, r);
      loot = { ...loot, resources: addPartial(loot.resources, r) };
      result = { title: "資源を獲得！", detail: describeResources(r), glyph: "📦" };
    } else if (node.type === "treasure") {
      const r = rollTreasure(exp.areaId, b);
      resources = mergeResourcesInto(resources, r);
      loot = { ...loot, resources: addPartial(loot.resources, r) };
      result = { title: "宝箱を発見！", detail: describeResources(r), glyph: "🎁" };
    } else if (node.type === "resident") {
      const key = rollResident(exp.areaId);
      residents = mergeResidentsInto(residents, key);
      loot.residents = { ...loot.residents, [key]: (loot.residents[key] ?? 0) + 1 };
      const def = RESIDENT_BY_KEY[key];
      result = {
        title: "迷子の音楽家を発見！",
        detail: `${def.glyph} ${def.name} が仲間になった（${def.effect}）`,
        glyph: "🧑‍🎤",
      };
    } else if (node.type === "special") {
      // レアイベント: 資源 + たまにレア住民(指揮者)
      const r = rollTreasure(exp.areaId, b);
      resources = mergeResourcesInto(resources, r);
      loot = { ...loot, resources: addPartial(loot.resources, r) };
      let detail = "音楽祭が開かれた！ " + describeResources(r);
      if (Math.random() < 0.5) {
        residents = mergeResidentsInto(residents, "conductor");
        loot.residents = { ...loot.residents, conductor: (loot.residents.conductor ?? 0) + 1 };
        detail += " ＋ 🪄 特別住民「指揮者」が加入！";
      }
      result = { title: "特殊イベント：音楽祭！", detail, glyph: "✨" };
    }

    node.resolved = true;
    set({ ...s, resources, residents, expedition: { ...exp, loot } });
    return result;
  }, [set]);

  const nextNode = useCallback(() => {
    const s = stateRef.current;
    if (!s || !s.expedition || !s.expedition.chosenRouteId) return;
    const exp = s.expedition;
    const route = exp.routes.find((r) => r.id === exp.chosenRouteId)!;
    const next = Math.min(exp.currentNodeIndex + 1, route.nodes.length - 1);
    set({ ...s, expedition: { ...exp, currentNodeIndex: next } });
  }, [set]);

  const finishExpedition = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    set({
      ...s,
      expedition: null,
      stats: { ...s.stats, expeditionsCompleted: s.stats.expeditionsCompleted + 1 },
    });
  }, [set]);

  const abandonExpedition = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    set({ ...s, expedition: null });
  }, [set]);

  const buildVillage = useCallback(
    (villageId: string) => {
      const s = stateRef.current;
      if (!s) return false;
      if (!canBuildVillage(s, villageId)) return false;
      const v = VILLAGE_BY_ID[villageId];
      const resources = { ...s.resources };
      resources.wood -= v.requirements.wood;
      resources.stone -= v.requirements.stone;
      const unlockedAreas = v.unlocks && !s.unlockedAreas.includes(v.unlocks)
        ? [...s.unlockedAreas, v.unlocks]
        : s.unlockedAreas;
      set({
        ...s,
        resources,
        builtVillages: [...s.builtVillages, villageId],
        unlockedAreas,
        currentVillageId: villageId,
      });
      return true;
    },
    [set],
  );

  const canBuild = useCallback((villageId: string) => {
    const s = stateRef.current;
    return s ? canBuildVillage(s, villageId) : false;
  }, []);

  const bonuses = state ? computeBonuses(state.residents) : computeBonuses(emptyResidentsForBonus());
  const population = state ? totalPopulation(state.residents) : 0;

  const value: GameContextValue = {
    state,
    ready,
    bonuses,
    population,
    newGame,
    loadSaved,
    reset,
    startExpedition,
    chooseRoute,
    answerQuiz,
    resolveEvent,
    nextNode,
    finishExpedition,
    abandonExpedition,
    buildVillage,
    canBuild,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

// ---- helpers ----
function describeResources(r: Partial<Resources>): string {
  return (Object.keys(r) as (keyof Resources)[])
    .filter((k) => (r[k] ?? 0) > 0)
    .map((k) => `${RESOURCE_GLYPH[k]}${RESOURCE_LABEL[k]} +${r[k]}`)
    .join("  ");
}

function addPartial(
  base: Partial<Resources>,
  add: Partial<Resources>,
): Partial<Resources> {
  const out: Partial<Resources> = { ...base };
  (Object.keys(add) as (keyof Resources)[]).forEach((k) => {
    out[k] = (out[k] ?? 0) + (add[k] ?? 0);
  });
  return out;
}

function emptyResidentsForBonus() {
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
