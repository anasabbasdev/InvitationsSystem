/**
 * In-app notification logic — Phase 4
 * Notifications are stored in Supabase and displayed in the owner dashboard.
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
