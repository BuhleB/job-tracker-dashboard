import { useState } from "react";
import type { Application, Status } from "../types";
import { VALID_TRANSITIONS, STATUS_LABELS } from "../types";
import { StatusBadge } from "./StatusBadge";

interface Props {
  application: Application;
  onStatusChange: (id: number, status: Status) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function ApplicationRow({ application: app, onStatusChange, onDelete }: Props) {
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const transitions = VALID_TRANSITIONS[app.status];
  const today = new Date().toISOString().split("T")[0];
  const isOverdue =
    app.follow_up_date &&
    app.follow_up_date < today &&
    !["accepted", "rejected", "withdrawn"].includes(app.status);

  async function handleStatus(status: Status) {
    setLoading(true);
    try {
      await onStatusChange(app.id, status);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await onDelete(app.id);
    } finally {
      setLoading(false);
      setShowDelete(false);
    }
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-4 hover:border-accent/30 transition-colors group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-ink truncate">{app.company}</span>
            <StatusBadge status={app.status} />
            {isOverdue && (
              <span className="text-xs text-amber-400 font-medium">· follow-up overdue</span>
            )}
          </div>
          <p className="text-sm text-muted mt-0.5">{app.role_title}</p>
          <div className="flex gap-4 mt-2 text-xs text-muted font-mono">
            <span>Applied {app.date_applied}</span>
            {app.follow_up_date && (
              <span className={isOverdue ? "text-amber-400" : ""}>
                Follow up {app.follow_up_date}
              </span>
            )}
          </div>
          {app.notes && (
            <p className="mt-2 text-xs text-muted bg-surfaceHover rounded-lg px-3 py-2 border border-border">
              {app.notes}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {transitions.length > 0 && (
            <select
              disabled={loading}
              onChange={(e) => handleStatus(e.target.value as Status)}
              value=""
              className="text-xs bg-surfaceHover border border-border text-muted rounded-lg px-2 py-1.5 cursor-pointer hover:border-accent/50 transition-colors disabled:opacity-50 focus:outline-none focus:border-accent"
            >
              <option value="" disabled>Move to…</option>
              {transitions.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          )}

          {!showDelete ? (
            <button
              onClick={() => setShowDelete(true)}
              className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-400 transition-all text-sm px-2 py-1.5"
            >
              ✕
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted">Delete?</span>
              <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-300 font-medium px-1.5">Yes</button>
              <button onClick={() => setShowDelete(false)} className="text-xs text-muted hover:text-ink px-1.5">No</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
