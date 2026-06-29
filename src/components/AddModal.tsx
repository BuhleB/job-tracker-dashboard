import { useState } from "react";
import type { ApplicationCreate } from "../types";

interface Props {
  onSubmit: (data: ApplicationCreate) => Promise<void>;
  onClose: () => void;
}

export function AddModal({ onSubmit, onClose }: Props) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!company.trim() || !role.trim() || !date) {
      setError("Company, role, and date are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSubmit({ company: company.trim(), role_title: role.trim(), date_applied: date, notes: notes.trim() || undefined });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-ink">Log application</h2>
          <button onClick={onClose} className="text-muted hover:text-ink transition-colors text-xl leading-none">✕</button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <Field label="Company">
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Takealot"
              className="input"
            />
          </Field>

          <Field label="Role">
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Backend Engineer"
              className="input"
            />
          </Field>

          <Field label="Date applied">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
            />
          </Field>

          <Field label="Notes (optional)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Recruiter name, salary range, referral..."
              rows={3}
              className="input resize-none"
            />
          </Field>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-muted hover:text-ink hover:border-ink/30 transition-colors text-sm font-medium">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-soft disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold text-white"
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}
