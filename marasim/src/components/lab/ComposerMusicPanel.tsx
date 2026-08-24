"use client";

import type { InvitationMusic } from "@/types/invitation";
import type { ComposerDemoSlug } from "@/lib/composer/constants";
import { suggestMusicPath } from "@/lib/composer/asset-paths";
import { CheckInput, Label, SelectInput, TextInput } from "./composer-fields";

type Props = {
  music: InvitationMusic;
  slug: ComposerDemoSlug;
  onChange: (music: InvitationMusic) => void;
};

export default function ComposerMusicPanel({ music, slug, onChange }: Props) {
  const suggested = suggestMusicPath(slug);

  return (
    <div className="mb-4 space-y-3 rounded-lg border border-zinc-700 bg-zinc-900/40 p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Invitation Music
      </h2>
      <p className="text-xs text-zinc-500">
        Attach a looping track for this invitation. Guests can play or pause it from the bottom bar.
      </p>
      <CheckInput
        checked={music.enabled}
        label="Enable background music"
        onChange={(enabled) =>
          onChange({
            ...music,
            enabled,
            src: enabled ? (music.src || suggested) : music.src,
            startMode: enabled
              ? music.startMode === "disabled"
                ? "after_first_tap"
                : music.startMode
              : "disabled",
          })
        }
      />
      <div>
        <Label>Audio src (public path)</Label>
        <TextInput
          value={music.src ?? ""}
          onChange={(src) => onChange({ ...music, src: src || undefined })}
          placeholder={suggested}
          dir="ltr"
        />
      </div>
      <div>
        <Label>Start mode</Label>
        <SelectInput
          value={music.startMode}
          onChange={(startMode) => onChange({ ...music, startMode })}
          options={[
            { value: "after_first_tap", label: "After first tap (recommended)" },
            { value: "manual", label: "Manual only" },
            { value: "disabled", label: "Disabled" },
          ]}
        />
      </div>
    </div>
  );
}
