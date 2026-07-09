import "server-only";

/**
 * In-app notification logic. Records are created by RSVP submission and
 * approval/rejection flows (see lib/rsvp.ts + Postgres functions) and
 * displayed in the owner dashboard.
 */

import {
  listNotificationsForEvent as listNotificationsRepo,
  countUnreadNotifications as countUnreadRepo,
  markNotificationRead as markReadRepo,
  markAllNotificationsRead as markAllReadRepo,
} from "@/lib/repositories";

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

export async function getNotifications(eventId: string): Promise<AppNotification[]> {
  return listNotificationsRepo(eventId);
}

export async function countUnreadNotifications(eventId: string): Promise<number> {
  return countUnreadRepo(eventId);
}

export async function markNotificationRead(id: string): Promise<void> {
  return markReadRepo(id);
}

export async function markAllNotificationsRead(eventId: string): Promise<void> {
  return markAllReadRepo(eventId);
}
