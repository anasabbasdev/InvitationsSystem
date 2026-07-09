/**
 * In-app notification types — Phase 3B creates records; Phase 4 displays in dashboard.
 */

export interface AppNotification {
  id: string;
  eventId: string;
  type: string;
  title: string;
  message?: string;
  payload?: Record<string, unknown>;
  readAt?: string;
  createdAt: string;
}

// TODO Phase 4: implement getNotifications(eventId: string): Promise<AppNotification[]>
// TODO Phase 4: implement markNotificationRead(id: string): Promise<void>
