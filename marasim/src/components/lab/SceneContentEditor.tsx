"use client";

import React from "react";
import type { SceneType } from "@/types/invitation";
import { Label, Section, TextAreaInput, TextInput } from "./composer-fields";

type ContentField = {
  label: string;
  key: string;
  multiline?: boolean;
  dir?: "ltr" | "rtl" | "auto";
  placeholder?: string;
  /** Read from alternate content keys (first match wins) */
  readKeys?: string[];
  /** Write to multiple content keys on change */
  writeKeys?: string[];
};

const BASIC_SCENE_CONTENT_FIELDS: Partial<Record<SceneType, ContentField[]>> = {
  opening: [{ label: "startButtonText", key: "tapText", dir: "rtl" }],
  hero_names: [
    { label: "primaryName", key: "primaryName", dir: "rtl" },
    { label: "secondaryName", key: "secondaryName", dir: "rtl" },
    { label: "subtitle", key: "subtitle", dir: "rtl" },
  ],
  invitation_message: [
    { label: "title", key: "title", dir: "rtl" },
    { label: "body", key: "body", multiline: true, dir: "rtl" },
  ],
  event_details: [
    { label: "date", key: "date", dir: "rtl" },
    { label: "time", key: "time", dir: "rtl" },
    { label: "venueName", key: "venueName", dir: "rtl" },
  ],
  countdown: [
    {
      label: "targetDate",
      key: "targetDate",
      dir: "ltr",
      placeholder: "ISO 8601 e.g. 2026-08-15T18:00:00+03:00",
    },
  ],
  gallery_media: [{ label: "title / caption", key: "label", dir: "rtl" }],
  location: [
    { label: "venueName", key: "venueName", dir: "rtl" },
    { label: "address", key: "address", multiline: true, dir: "rtl" },
    { label: "mapUrl", key: "mapUrl", dir: "ltr" },
  ],
  notes: [{ label: "items (one per line)", key: "__items__", multiline: true, dir: "rtl" }],
  rsvp: [{ label: "title / sectionLabel", key: "sectionLabel", dir: "rtl" }],
  ticket_confirmation: [
    {
      label: "title",
      key: "title",
      dir: "rtl",
      readKeys: ["title", "closingTitle"],
      writeKeys: ["title", "closingTitle"],
    },
    { label: "body", key: "body", multiline: true, dir: "rtl" },
  ],
};

const ADVANCED_EXTRA_FIELDS: Partial<Record<SceneType, ContentField[]>> = {
  opening: [
    { label: "label", key: "label", dir: "rtl" },
    { label: "previewTitle", key: "previewTitle", dir: "rtl" },
  ],
  invitation_message: [{ label: "header", key: "header", dir: "rtl" }],
  event_details: [{ label: "sectionLabel", key: "sectionLabel", dir: "rtl" }],
  countdown: [{ label: "sectionLabel", key: "sectionLabel", dir: "rtl" }],
  location: [{ label: "sectionLabel", key: "sectionLabel", dir: "rtl" }],
  notes: [{ label: "sectionLabel", key: "sectionLabel", dir: "rtl" }],
  ticket_confirmation: [{ label: "sectionLabel", key: "sectionLabel", dir: "rtl" }],
};

function fieldsForScene(sceneType: SceneType, mode: "basic" | "advanced"): ContentField[] {
  const basic = BASIC_SCENE_CONTENT_FIELDS[sceneType] ?? [];
  if (mode === "basic") return basic;
  const extra = ADVANCED_EXTRA_FIELDS[sceneType] ?? [];
  const seen = new Set(basic.map((f) => f.key));
  return [...basic, ...extra.filter((f) => !seen.has(f.key))];
}

function readFieldValue(content: Record<string, unknown>, field: ContentField): string {
  if (field.key === "__items__") {
    const items = Array.isArray(content.items) ? (content.items as string[]) : [];
    return items.join("\n");
  }
  const keys = field.readKeys ?? [field.key];
  for (const key of keys) {
    const raw = content[key];
    if (typeof raw === "string" && raw) return raw;
    if (raw != null && raw !== "") return String(raw);
  }
  return "";
}

function writeFieldValue(
  content: Record<string, unknown>,
  field: ContentField,
  value: string
): Record<string, unknown> {
  if (field.key === "__items__") {
    return {
      ...content,
      items: value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
  }
  const keys = field.writeKeys ?? [field.key];
  const next = { ...content };
  for (const key of keys) {
    next[key] = value;
  }
  return next;
}

interface SceneContentEditorProps {
  sceneType: SceneType;
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
  mode?: "basic" | "advanced";
}

export default function SceneContentEditor({
  sceneType,
  content,
  onChange,
  mode = "advanced",
}: SceneContentEditorProps) {
  const fields = fieldsForScene(sceneType, mode);
  if (!fields.length) return null;

  return (
    <Section title={mode === "basic" ? "Content (Basic)" : "Content"}>
      <div className="space-y-3">
        {fields.map((field) => {
          const value = readFieldValue(content, field);

          return (
            <div key={field.key + field.label}>
              <Label>{field.label}</Label>
              {field.multiline ? (
                <TextAreaInput
                  value={value}
                  onChange={(v) => onChange(writeFieldValue(content, field, v))}
                  dir={field.dir}
                  placeholder={field.placeholder}
                  rows={field.key === "__items__" ? 4 : 3}
                />
              ) : (
                <TextInput
                  value={value}
                  onChange={(v) => onChange(writeFieldValue(content, field, v))}
                  dir={field.dir}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/** Keys edited in basic mode — used to sync media fields (e.g. opening button text) */
export function getBasicContentKeys(sceneType: SceneType): string[] {
  return (BASIC_SCENE_CONTENT_FIELDS[sceneType] ?? []).map((f) => f.key);
}
