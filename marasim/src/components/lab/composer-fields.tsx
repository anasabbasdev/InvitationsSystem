"use client";

import React from "react";
import type { MediaAsset } from "@/types/invitation";

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-xs font-medium text-zinc-400">{children}</label>;
}

export function TextInput({
  value,
  onChange,
  placeholder,
  dir,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl" | "auto";
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      dir={dir}
      className="w-full rounded border border-zinc-600 bg-zinc-900 px-2 py-1.5 text-sm text-white"
    />
  );
}

export function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <input
        type="color"
        value={value.startsWith("#") ? value : "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-10 cursor-pointer rounded border border-zinc-600 bg-zinc-900"
      />
      <TextInput value={value} onChange={onChange} placeholder="#RRGGBB" dir="ltr" />
    </div>
  );
}

export function TextAreaInput({
  value,
  onChange,
  placeholder,
  rows = 3,
  dir,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  dir?: "ltr" | "rtl" | "auto";
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      dir={dir}
      className="w-full rounded border border-zinc-600 bg-zinc-900 px-2 py-1.5 text-sm text-white"
    />
  );
}

export function SelectInput<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full rounded border border-zinc-600 bg-zinc-900 px-2 py-1.5 text-sm text-white"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function CheckInput({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-zinc-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded"
      />
      {label}
    </label>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 border-b border-zinc-700 pb-4">
      <h3 className="text-sm font-semibold text-amber-400">{title}</h3>
      {children}
    </div>
  );
}

export const DESIGN_TOKEN_OPTIONS = {
  cardStyle: ["framed", "minimal", "glass", "full_bleed", "none"],
  buttonStyle: ["pill", "square", "ghost", "underline", "none"],
  dividerStyle: ["diamond", "line", "floral_asset", "none"],
  iconStyle: ["line", "filled", "asset", "none"],
  typographyStyle: ["classic", "modern", "calligraphy", "soft"],
  density: ["airy", "balanced", "compact"],
} as const;

export function MediaAssetFields({
  label,
  asset,
  onChange,
  showPoster,
  layerOptions,
}: {
  label: string;
  asset?: MediaAsset;
  onChange: (asset: MediaAsset | undefined) => void;
  showPoster?: boolean;
  layerOptions?: boolean;
}) {
  const a = asset ?? { type: "image" as const, src: "", fit: "cover" as const };

  return (
    <div className="space-y-2 rounded border border-zinc-700 bg-zinc-900/50 p-3">
      <p className="text-xs font-medium text-zinc-300">{label}</p>
      <div>
        <Label>type</Label>
        <SelectInput
          value={a.type}
          onChange={(type) => onChange({ ...a, type })}
          options={[
            { value: "image", label: "image" },
            { value: "video", label: "video" },
          ]}
        />
      </div>
      <div>
        <Label>src</Label>
        <TextInput value={a.src} onChange={(src) => onChange({ ...a, src })} dir="ltr" />
      </div>
      {showPoster && a.type === "video" && (
        <div>
          <Label>poster</Label>
          <TextInput
            value={a.poster ?? ""}
            onChange={(poster) => onChange({ ...a, poster })}
            dir="ltr"
          />
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>fit</Label>
          <SelectInput
            value={a.fit ?? "cover"}
            onChange={(fit) => onChange({ ...a, fit })}
            options={[
              { value: "cover", label: "cover" },
              { value: "contain", label: "contain" },
            ]}
          />
        </div>
        {a.type === "video" && (
          <div className="flex flex-col justify-end gap-1">
            <CheckInput
              label="loop"
              checked={a.loop ?? false}
              onChange={(loop) => onChange({ ...a, loop })}
            />
            <CheckInput
              label="muted"
              checked={a.muted ?? true}
              onChange={(muted) => onChange({ ...a, muted })}
            />
          </div>
        )}
      </div>
      {layerOptions && (
        <div className="grid grid-cols-2 gap-2 border-t border-zinc-700 pt-2">
          <div>
            <Label>position</Label>
            <SelectInput
              value={a.position ?? "full"}
              onChange={(position) => onChange({ ...a, position })}
              options={[
                { value: "full", label: "full" },
                { value: "top", label: "top" },
                { value: "center", label: "center" },
                { value: "bottom", label: "bottom" },
              ]}
            />
          </div>
          <div>
            <Label>opacity</Label>
            <TextInput
              value={a.opacity != null ? String(a.opacity) : ""}
              onChange={(v) => {
                const n = parseFloat(v);
                onChange({ ...a, opacity: Number.isFinite(n) ? n : undefined });
              }}
              placeholder="0–1"
              dir="ltr"
            />
          </div>
          <div className="col-span-2">
            <Label>height</Label>
            <TextInput
              value={a.height ?? ""}
              onChange={(height) => onChange({ ...a, height: height || undefined })}
              placeholder="e.g. 45% or 200px"
              dir="ltr"
            />
          </div>
          <div>
            <Label>zIndex</Label>
            <TextInput
              value={a.zIndex != null ? String(a.zIndex) : ""}
              onChange={(v) => {
                const n = parseInt(v, 10);
                onChange({ ...a, zIndex: Number.isFinite(n) ? n : undefined });
              }}
              placeholder="e.g. 20"
              dir="ltr"
            />
          </div>
        </div>
      )}
    </div>
  );
}
