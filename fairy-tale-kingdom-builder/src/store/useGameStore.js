import { create } from "zustand";
import { persist } from "zustand/middleware";

export const MODULE_ORDER = ["listening", "speaking", "reading", "writing"];
export const MODULE_SECONDS = 600; // 10 minutes per module => 40 min daily loop
export const GRID_COLS = 8;
export const GRID_ROWS = 6;

export const MODULE_META = {
  listening: { label: "Listening", icon: "👂", color: "#bfe3ff" },
  speaking: { label: "Speaking", icon: "🎤", color: "#ffd6e8" },
  reading: { label: "Reading", icon: "📖", color: "#c9b6ff" },
  writing: { label: "Writing", icon: "✍️", color: "#bff0d8" },
};

const initialProgress = () => ({
  listening: false,
  speaking: false,
  reading: false,
  writing: false,
});

export const useGameStore = create(
  persist(
    (set, get) => ({
      // --- Currency & resources ---
      mana: 60,
      runes: 0,

      // --- Daily loop ---
      day: 1,
      activeModule: "listening",
      secondsLeft: MODULE_SECONDS,
      completed: initialProgress(),

      // --- Kingdom ---
      ownedAssets: [],
      placedItems: [], // {uid, assetId, col, row, rotation}

      // --- Progression ---
      tier: 1,
      tierName: "Crystal Meadow Academy",
      raidActive: false,
      raidCleared: false,

      // --- UI flash for particle origin ---
      lastReward: null, // {type:'mana'|'rune', amount, at}

      addMana: (n = 1) =>
        set((s) => ({
          mana: s.mana + n,
          lastReward: { type: "mana", amount: n, at: Date.now() },
        })),

      addRune: (n = 1) =>
        set((s) => ({
          runes: s.runes + n,
          lastReward: { type: "rune", amount: n, at: Date.now() },
        })),

      tick: () =>
        set((s) => ({ secondsLeft: Math.max(0, s.secondsLeft - 1) })),

      setActiveModule: (mod) =>
        set(() => ({ activeModule: mod, secondsLeft: MODULE_SECONDS })),

      completeModule: (mod) => {
        const s = get();
        const completed = { ...s.completed, [mod]: true };
        const idx = MODULE_ORDER.indexOf(mod);
        const next = MODULE_ORDER[idx + 1];
        set({
          completed,
          activeModule: next ?? mod,
          secondsLeft: MODULE_SECONDS,
        });
        return next ?? null;
      },

      // Advance from timer expiry: lock current, move to next
      forceAdvance: () => {
        const s = get();
        const idx = MODULE_ORDER.indexOf(s.activeModule);
        const next = MODULE_ORDER[idx + 1];
        set({
          completed: { ...s.completed, [s.activeModule]: true },
          activeModule: next ?? s.activeModule,
          secondsLeft: MODULE_SECONDS,
        });
      },

      allModulesDone: () => {
        const c = get().completed;
        return MODULE_ORDER.every((m) => c[m]);
      },

      goToNextDay: () =>
        set((s) => ({
          day: Math.min(7, s.day + 1),
          activeModule: "listening",
          secondsLeft: MODULE_SECONDS,
          completed: initialProgress(),
        })),

      // --- Bazaar / Kingdom ---
      buyAsset: (asset) => {
        const s = get();
        if (s.ownedAssets.includes(asset.id)) return false;
        if (s.mana < asset.cost) return false;
        set({ mana: s.mana - asset.cost, ownedAssets: [...s.ownedAssets, asset.id] });
        return true;
      },

      placeItem: (assetId, col, row) =>
        set((s) => ({
          placedItems: [
            ...s.placedItems,
            { uid: `${assetId}-${Date.now()}`, assetId, col, row, rotation: 0 },
          ],
        })),

      moveItem: (uid, col, row) =>
        set((s) => ({
          placedItems: s.placedItems.map((p) =>
            p.uid === uid ? { ...p, col, row } : p
          ),
        })),

      rotateItem: (uid) =>
        set((s) => ({
          placedItems: s.placedItems.map((p) =>
            p.uid === uid ? { ...p, rotation: (p.rotation + 90) % 360 } : p
          ),
        })),

      removeItem: (uid) =>
        set((s) => ({ placedItems: s.placedItems.filter((p) => p.uid !== uid) })),

      // --- Raid ---
      startRaid: () => set({ raidActive: true }),
      endRaid: () => set({ raidActive: false }),

      winRaid: () =>
        set((s) => ({
          raidActive: false,
          raidCleared: true,
          mana: s.mana + 500,
          tier: 2,
          tierName: "Sky Castle Academy",
          day: 1,
          activeModule: "listening",
          secondsLeft: MODULE_SECONDS,
          completed: initialProgress(),
        })),

      hardReset: () =>
        set({
          mana: 60,
          runes: 0,
          day: 1,
          activeModule: "listening",
          secondsLeft: MODULE_SECONDS,
          completed: initialProgress(),
          ownedAssets: [],
          placedItems: [],
          tier: 1,
          tierName: "Crystal Meadow Academy",
          raidActive: false,
          raidCleared: false,
        }),
    }),
    {
      name: "ftkb-save-v1",
      partialize: (s) => ({
        mana: s.mana,
        runes: s.runes,
        day: s.day,
        activeModule: s.activeModule,
        completed: s.completed,
        ownedAssets: s.ownedAssets,
        placedItems: s.placedItems,
        tier: s.tier,
        tierName: s.tierName,
        raidCleared: s.raidCleared,
      }),
    }
  )
);
