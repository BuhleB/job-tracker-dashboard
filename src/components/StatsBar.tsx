import type { Application, Status } from "../types";
import { STATUS_COLORS, STATUS_LABELS } from "../types";

const PIPELINE: Status[] = ["applied", "interviewing", "offer", "accepted"];
const EXIT: Status[] = ["rejected", "withdrawn"];

function Stat({
  status,
  count,
}: {
  status: Status;
  count: number;
}) {
  const color = STATUS_COLORS[status];
  return (
    <div className="flex flex-col gap-1">
      <span className="text-2xl font-bold" style={{ color }}>
        {count}
      </span>
      <span className="text-xs text-muted font-medium tracking-wide uppercase">
        {STATUS_LABELS[status]}
      </span>
    </div>
  );
}

export function StatsBar({ applications }: { applications: Application[] }) {
  const counts = applications.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<Status, number>
  );

  const today = new Date().toISOString().split("T")[0];
  const overdue = applications.filter(
    (a) =>
      a.follow_up_date &&
      a.follow_up_date < today &&
      !["accepted", "rejected", "withdrawn"].includes(a.status)
  ).length;

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div className="flex items-center gap-8 flex-wrap">
          {PIPELINE.map((s) => (
            <Stat key={s} status={s} count={counts[s] ?? 0} />
          ))}
          <div className="w-px h-8 bg-border" />
          {EXIT.map((s) => (
            <Stat key={s} status={s} count={counts[s] ?? 0} />
          ))}
        </div>
        {overdue > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-sm text-amber-400 font-medium">
              {overdue} follow-up{overdue > 1 ? "s" : ""} overdue
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
