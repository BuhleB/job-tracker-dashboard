import type { Status } from "../types";
import { STATUS_COLORS, STATUS_LABELS } from "../types";

export function StatusBadge({ status }: { status: Status }) {
  const color = STATUS_COLORS[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium font-mono tracking-wide"
      style={{ backgroundColor: `${color}20`, color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}
