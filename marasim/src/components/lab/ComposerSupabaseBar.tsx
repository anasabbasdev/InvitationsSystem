"use client";

import { useState } from "react";
import {
  listDbInvitationSlugsAction,
  loadDbInvitationDataAction,
  saveDbInvitationDataAction,
  publishDbInvitationAction,
} from "@/app/lab/composer/actions";
import type { InvitationData } from "@/types/invitation";

type Props = {
  slug: string;
  invitationData: Partial<InvitationData>;
  onLoadSlug: (slug: string, data: InvitationData) => void;
};

export default function ComposerSupabaseBar({ slug, invitationData, onLoadSlug }: Props) {
  const [dbSlugs, setDbSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function refreshSlugs() {
    setLoading(true);
    setMessage(null);
    try {
      const slugs = await listDbInvitationSlugsAction();
      setDbSlugs(slugs);
      setMessage(`${slugs.length} invitation(s) in Supabase`);
    } catch {
      setMessage("Supabase not configured or not authorized (admin login required)");
    } finally {
      setLoading(false);
    }
  }

  async function loadFromDb(targetSlug: string) {
    setLoading(true);
    setMessage(null);
    try {
      const data = await loadDbInvitationDataAction(targetSlug);
      if (!data) {
        setMessage("Not found in Supabase");
        return;
      }
      onLoadSlug(targetSlug, data);
      setMessage(`Loaded ${targetSlug} from Supabase`);
    } catch {
      setMessage("Load failed — login as admin at /owner/login");
    } finally {
      setLoading(false);
    }
  }

  async function saveToDb() {
    setLoading(true);
    setMessage(null);
    try {
      const result = await saveDbInvitationDataAction(slug, invitationData as InvitationData);
      setMessage(result.ok ? `Saved ${slug} to Supabase` : result.message);
    } catch {
      setMessage("Save failed — admin login required");
    } finally {
      setLoading(false);
    }
  }

  async function publish() {
    setLoading(true);
    setMessage(null);
    try {
      const result = await publishDbInvitationAction(slug);
      setMessage(result.ok ? `Published snapshot ${result.snapshotId}` : result.message);
    } catch {
      setMessage("Publish failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-zinc-800 pt-2 text-xs">
      <button
        type="button"
        onClick={refreshSlugs}
        disabled={loading}
        className="rounded border border-zinc-700 px-2 py-1 hover:bg-zinc-800"
      >
        List DB
      </button>
      {dbSlugs.length > 0 && (
        <select
          className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1"
          defaultValue=""
          onChange={(e) => e.target.value && loadFromDb(e.target.value)}
        >
          <option value="">Load from Supabase…</option>
          {dbSlugs.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}
      <button
        type="button"
        onClick={saveToDb}
        disabled={loading}
        className="rounded border border-amber-700 px-2 py-1 text-amber-400 hover:bg-amber-950/30"
      >
        Save Data → DB
      </button>
      <button
        type="button"
        onClick={publish}
        disabled={loading}
        className="rounded bg-amber-600 px-2 py-1 font-medium text-black hover:opacity-90"
      >
        Re-publish
      </button>
      {message && <span className="text-zinc-500">{message}</span>}
    </div>
  );
}
