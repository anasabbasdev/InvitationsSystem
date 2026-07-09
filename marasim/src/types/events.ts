export type EventStatus = "draft" | "published" | "cancelled";

export interface AppEvent {
  id: string;
  title: string;
  slug: string;
  eventDate?: string;
  venueName?: string;
  venueAddress?: string;
  mapUrl?: string;
  totalCapacity?: number;
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
