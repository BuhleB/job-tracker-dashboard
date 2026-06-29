import { useEffect, useState, useCallback } from "react";
import type { Application, Status } from "./types";
import { STATUS_ORDER, STATUS_LABELS } from "./types";
import { api } from "./api";
import { StatsBar } from "./components/StatsBar";
import { ApplicationRow } from "./components/ApplicationRow";
import { AddModal } from "./components/AddModal";

const FILTERS: Array<{ label: string; value: Status | "all" }> = [
  { label: "All", value: "all" },
  ...STATUS_ORDER.map((s) => ({ label: STATUS_LABELS[s], value: s })),
];

export default function App() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.list();
      setApplications(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function handleStatusChange(id: number, status: Status) {
    await api.updateStatus(id, status);
    await fetchAll();
  }

  async function handleDelete(id: number) {
    await api.delete(id);
    await fetchAll();
  }

  const visible =
    filter === "all"
      ? applications
      : applications.filter((a) => a.status === filter);

  const today = new Date().toISOString().split("T")[0];
  const sorted = [...visible].sort((a, b) => {
    // Overdue follow-ups first, then by date applied descending
    const aOverdue = a.follow_up_date && a.follow_up_date < today && !["accepted","rejected","withdrawn"].includes(a.status);
    const bOverdue = b.follow_up_date && b.follow_up_date < today && !["accepted","rejected","withdrawn"].includes(b.status);
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    return b.date_applied.localeCompare(a.date_applied);
  });

  return (
    <div className="min-h-screen bg-base">
      {/* Header */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-md bg-accent flex items-center justify-center text-white text-xs font-bold">J</span>
            <span className="font-semibold text-ink text-sm">Job Tracker</span>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent hover:bg-accent-soft transition-colors text-sm font-semibold text-white"
          >
            <span className="text-base leading-none">+</span>
            Log application
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Stats */}
        {!loading && !error && <StatsBar applications={applications} />}

        {/* Filter tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.value
                  ? "bg-accent/20 text-accent"
                  : "text-muted hover:text-ink hover:bg-surfaceHover"
              }`}
            >
              {f.label}
              {f.value !== "all" && (
                <span className="ml-1.5 text-xs opacity-60">
                  {applications.filter((a) => a.status === f.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-surface border border-border rounded-xl h-24 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={fetchAll} className="text-sm text-accent hover:text-accent-soft transition-colors">
              Try again
            </button>
          </div>
        )}

        {!loading && !error && sorted.length === 0 && (
          <div className="text-center py-16 text-muted">
            {filter === "all"
              ? "No applications yet — log your first one."
              : `No applications with status "${STATUS_LABELS[filter as Status]}".`}
          </div>
        )}

        {!loading && !error && sorted.length > 0 && (
          <div className="flex flex-col gap-3">
            {sorted.map((app) => (
              <ApplicationRow
                key={app.id}
                application={app}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {showAdd && (
        <AddModal
          onSubmit={async (data) => {
            await api.create(data);
            await fetchAll();
          }}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}
