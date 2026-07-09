export type EventStatus = "draft" | "published" | "cancelled";

export interface AppEvent {
  id: string;
  title: string;
  slug: string;
  eventDate?: string | null;
  venueName?: string | null;
  venueAddress?: string | null;
  mapUrl?: string | null;
  totalCapacity?: number | null;
  confirmedSeats: number;
  status: EventStatus;
  createdAt: string;
}

export interface EventSettings {
  id: string;
  eventId: string;
  rsvpEnabled: boolean;
  rsvpMode: "none" | "public_request" | "controlled_link";
  maxPublicRequest: number;
  approvalRequired: boolean;
  cancellationDeadlineHours: number;
}

export type OwnerRole = "owner";

export interface EventOwner {
  id: string;
  eventId: string;
  userId: string;
  role: OwnerRole;
  createdAt: string;
}

export type UserRole = "admin" | "owner";

export interface UserRoleRecord {
  userId: string;
  role: UserRole;
}

/** Aggregated view for the owner events list page. */
export interface OwnerEventSummary {
  event: AppEvent;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  remainingSeats: number | null;
}
