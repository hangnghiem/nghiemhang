import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { BAZAAR_ASSETS } from "../data/content";
import { chime } from "../utils/audio";

export default function RoyalBazaar({ open, onClose }) {
  const mana = useGameStore((s) => s.mana);
  const owned = useGameStore((s) => s.ownedAssets);
  const buyAsset = useGameStore((s) => s.buyAsset);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4 bg-fairy-dark/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            className="w-full max-w-2xl rounded-3xl glass p-6 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl font-extrabold text-fairy-ink">
                🛍️ Royal Bazaar
              </h2>
              <div className="flex items-center gap-3">
                <span className="pill bg-fairy-sky/70 text-fairy-ink">
                  ✨ {mana} Mana
                </span>
                <button onClick={onClose} className="fairy-btn !px-3 !py-2">
                  ✕
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BAZAAR_ASSETS.map((a) => {
                const isOwned = owned.includes(a.id);
                const canAfford = mana >= a.cost;
                return (
                  <div
                    key={a.id}
                    className="rounded-2xl bg-white/70 border border-white/70 p-3 text-center"
                  >
                    <div className="text-4xl mb-1 animate-floaty">{a.emoji}</div>
                    <div className="font-bold text-sm text-fairy-ink leading-tight h-9">
                      {a.name}
                    </div>
                    {isOwned ? (
                      <span className="pill bg-fairy-mint/60 mt-1">✓ Owned</span>
                    ) : (
                      <button
                        disabled={!canAfford}
                        onClick={() => {
                          if (buyAsset(a)) chime(true);
                        }}
                        className="fairy-btn !px-3 !py-2 text-sm mt-1 w-full"
                      >
                        ✨ {a.cost}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-fairy-ink/60 mt-4 text-center">
              Buy assets, then drag them onto your kingdom grid. Click a placed item
              to rotate it, double-click to remove.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
