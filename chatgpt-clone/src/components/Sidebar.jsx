import { useState } from "react";
import {
  PlusIcon,
  TrashIcon,
  EditIcon,
  SettingsIcon,
  CloseIcon,
  CheckIcon,
} from "./icons.jsx";

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onRename,
  onOpenSettings,
  open,
  onClose,
  providerLabel,
}) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");

  const startEdit = (c) => {
    setEditingId(c.id);
    setDraft(c.title);
  };
  const commitEdit = () => {
    if (editingId) onRename(editingId, draft.trim() || "New chat");
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed z-30 flex h-full w-72 flex-col bg-sidebar text-gray-200 transition-transform duration-200 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2 p-3">
          <button
            onClick={onNew}
            className="flex flex-1 items-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 text-sm font-medium transition hover:bg-white/10"
          >
            <PlusIcon width={18} height={18} />
            New chat
          </button>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-white/10 md:hidden"
            aria-label="Close sidebar"
          >
            <CloseIcon width={18} height={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-2">
          {conversations.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-gray-500">
              No conversations yet.
            </p>
          )}
          {conversations.map((c) => {
            const isActive = c.id === activeId;
            const isEditing = c.id === editingId;
            return (
              <div
                key={c.id}
                className={`group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                {isEditing ? (
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit();
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    onBlur={commitEdit}
                    className="min-w-0 flex-1 rounded bg-transparent text-gray-100 outline-none ring-1 ring-accent-500"
                  />
                ) : (
                  <button
                    onClick={() => onSelect(c.id)}
                    className="min-w-0 flex-1 truncate text-left"
                    title={c.title}
                  >
                    {c.title}
                  </button>
                )}

                <div
                  className={`flex shrink-0 items-center gap-0.5 ${
                    isActive ? "" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {isEditing ? (
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={commitEdit}
                      className="rounded p-1 text-gray-400 hover:text-gray-100"
                      title="Save"
                    >
                      <CheckIcon width={15} height={15} />
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(c)}
                      className="rounded p-1 text-gray-400 hover:text-gray-100"
                      title="Rename"
                    >
                      <EditIcon width={15} height={15} />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(c.id)}
                    className="rounded p-1 text-gray-400 hover:text-red-400"
                    title="Delete"
                  >
                    <TrashIcon width={15} height={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={onOpenSettings}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition hover:bg-white/10"
          >
            <SettingsIcon width={18} height={18} />
            <span className="flex-1 text-left">Settings</span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-gray-300">
              {providerLabel}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
