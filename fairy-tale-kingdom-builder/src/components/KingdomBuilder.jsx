import { useState } from "react";
import { motion } from "framer-motion";
import {
  useGameStore,
  GRID_COLS,
  GRID_ROWS,
} from "../store/useGameStore";
import { BAZAAR_ASSETS } from "../data/content";
import RoyalBazaar from "./RoyalBazaar";

const assetById = (id) => BAZAAR_ASSETS.find((a) => a.id === id);

export default function KingdomBuilder() {
  const owned = useGameStore((s) => s.ownedAssets);
  const placed = useGameStore((s) => s.placedItems);
  const placeItem = useGameStore((s) => s.placeItem);
  const moveItem = useGameStore((s) => s.moveItem);
  const rotateItem = useGameStore((s) => s.rotateItem);
  const removeItem = useGameStore((s) => s.removeItem);

  const [bazaar, setBazaar] = useState(false);
  const [dragOver, setDragOver] = useState(null);

  const handleDrop = (e, col, row) => {
    e.preventDefault();
    setDragOver(null);
    const uid = e.dataTransfer.getData("uid");
    const assetId = e.dataTransfer.getData("assetId");
    const occupied = placed.some(
      (p) => p.col === col && p.row === row && p.uid !== uid
    );
    if (occupied) return;
    if (uid) moveItem(uid, col, row);
    else if (assetId) placeItem(assetId, col, row);
  };

  const cells = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const item = placed.find((p) => p.col === c && p.row === r);
      const isOver = dragOver === `${c}-${r}`;
      cells.push(
        <div
          key={`${c}-${r}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(`${c}-${r}`);
          }}
          onDragLeave={() => setDragOver(null)}
          onDrop={(e) => handleDrop(e, c, r)}
          className={`relative aspect-square rounded-lg border border-white/40 grid place-items-center transition-colors ${
            isOver ? "bg-fairy-rose/30" : "bg-white/20"
          }`}
        >
          {item && (
            <motion.div
              layout
              draggable
              onDragStart={(e) => e.dataTransfer.setData("uid", item.uid)}
              onClick={() => rotateItem(item.uid)}
              onDoubleClick={() => removeItem(item.uid)}
              className="text-2xl sm:text-3xl cursor-grab active:cursor-grabbing"
              style={{ transform: `rotate(${item.rotation}deg)` }}
              title="Click to rotate · double-click to remove · drag to move"
            >
              {assetById(item.assetId)?.emoji}
            </motion.div>
          )}
        </div>
      );
    }
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-center gap-3 justify-between">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-fairy-ink">
            🏰 My Fairy Kingdom
          </h2>
          <p className="text-sm text-fairy-ink/60">
            Drag treasures onto the grid. Your layout saves automatically.
          </p>
        </div>
        <button
          className="fairy-btn fairy-btn-primary"
          onClick={() => setBazaar(true)}
        >
          🛍️ Open Royal Bazaar
        </button>
      </div>

      <div className="card">
        <div
          className="grid gap-1 sm:gap-1.5 rounded-2xl p-2 sm:p-3"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0,1fr))`,
            background:
              "repeating-linear-gradient(45deg,#dff3e3,#dff3e3 16px,#d4eedd 16px,#d4eedd 32px)",
          }}
        >
          {cells}
        </div>
      </div>

      {/* Owned asset tray */}
      <div className="card">
        <h3 className="font-display font-bold text-fairy-ink/90 mb-2">
          🎒 Your Treasures
        </h3>
        {owned.length === 0 ? (
          <p className="text-sm text-fairy-ink/60">
            You don't own anything yet. Earn Mana in lessons, then visit the Royal
            Bazaar!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {owned.map((id) => {
              const a = assetById(id);
              return (
                <div
                  key={id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("assetId", id)}
                  className="flex items-center gap-2 rounded-2xl bg-white/80 border-2 border-white px-3 py-2 cursor-grab active:cursor-grabbing shadow-sm"
                  title={`Drag ${a.name} onto the grid`}
                >
                  <span className="text-2xl">{a.emoji}</span>
                  <span className="text-sm font-bold text-fairy-ink">
                    {a.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <RoyalBazaar open={bazaar} onClose={() => setBazaar(false)} />
    </div>
  );
}
