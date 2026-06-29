export type Status =
  | "applied"
  | "interviewing"
  | "offer"
  | "accepted"
  | "rejected"
  | "withdrawn";

export interface Application {
  id: number;
  company: string;
  role_title: string;
  status: Status;
  date_applied: string;
  follow_up_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationCreate {
  company: string;
  role_title: string;
  date_applied: string;
  notes?: string;
}

export const STATUS_ORDER: Status[] = [
  "applied",
  "interviewing",
  "offer",
  "accepted",
  "rejected",
  "withdrawn",
];

export const STATUS_LABELS: Record<Status, string> = {
  applied: "Applied",
  interviewing: "Interviewing",
  offer: "Offer",
  accepted: "Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const STATUS_COLORS: Record<Status, string> = {
  applied: "#6B7280",
  interviewing: "#6D5EF5",
  offer: "#8B5CF6",
  accepted: "#10B981",
  rejected: "#F43F5E",
  withdrawn: "#52525B",
};

export const VALID_TRANSITIONS: Record<Status, Status[]> = {
  applied: ["interviewing", "rejected", "withdrawn"],
  interviewing: ["offer", "rejected", "withdrawn"],
  offer: ["accepted", "rejected", "withdrawn"],
  accepted: [],
  rejected: [],
  withdrawn: [],
};
