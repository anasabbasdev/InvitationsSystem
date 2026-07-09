"use client";

import React from "react";
import type { ComposerThemeEdit } from "@/lib/composer/state";
import { LOADED_FONT_OPTIONS } from "@/lib/theme-vars";
import {
  ColorInput,
  DESIGN_TOKEN_OPTIONS,
  Label,
  Section,
  SelectInput,
  TextInput,
} from "./composer-fields";

interface ThemeOverridesPanelProps {
  theme: ComposerThemeEdit;
  onChange: (theme: ComposerThemeEdit) => void;
  uiMode: "basic" | "advanced";
}

export default function ThemeOverridesPanel({
  theme,
  onChange,
  uiMode,
}: ThemeOverridesPanelProps) {
  const patchDesign = (key: keyof typeof DESIGN_TOKEN_OPTIONS, value: string) => {
    onChange({ ...theme, design: { ...theme.design, [key]: value } });
  };

  const patchTypo = (key: keyof ComposerThemeEdit["typography"], value: string) => {
    onChange({ ...theme, typography: { ...theme.typography, [key]: value } });
  };

  return (
    <div className="mb-4 space-y-4 rounded-lg border border-zinc-700 bg-zinc-900/40 p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Global Visual Identity
      </h2>

      <Section title="Colors">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(
            [
              ["primaryColor", theme.primaryColor],
              ["secondaryColor", theme.secondaryColor],
              ["backgroundColor", theme.backgroundColor],
              ["textColor", theme.textColor],
              ["mutedTextColor", theme.mutedTextColor],
              ["accentColor", theme.accentColor],
            ] as const
          ).map(([key, value]) => (
            <div key={key}>
              <Label>{key}</Label>
              <ColorInput
                value={value}
                onChange={(v) => onChange({ ...theme, [key]: v })}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography — Fonts">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Label>headingFont</Label>
            <SelectInput
              value={theme.typography.headingFont ?? theme.fontHeading}
              onChange={(headingFont) => {
                onChange({
                  ...theme,
                  fontHeading: headingFont,
                  typography: { ...theme.typography, headingFont },
                });
              }}
              options={LOADED_FONT_OPTIONS.map((f) => ({ value: f.value, label: f.label }))}
            />
          </div>
          <div>
            <Label>bodyFont</Label>
            <SelectInput
              value={theme.typography.bodyFont ?? theme.fontBody}
              onChange={(bodyFont) => {
                onChange({
                  ...theme,
                  fontBody: bodyFont,
                  typography: { ...theme.typography, bodyFont },
                });
              }}
              options={LOADED_FONT_OPTIONS.map((f) => ({ value: f.value, label: f.label }))}
            />
          </div>
          <div>
            <Label>namesFont</Label>
            <SelectInput
              value={theme.typography.namesFont ?? theme.typography.headingFont ?? theme.fontHeading}
              onChange={(namesFont) =>
                onChange({ ...theme, typography: { ...theme.typography, namesFont } })
              }
              options={LOADED_FONT_OPTIONS.map((f) => ({ value: f.value, label: f.label }))}
            />
          </div>
        </div>
      </Section>

      {uiMode === "advanced" && (
        <>
          <Section title="Typography — Sizes & Spacing">
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["headingSize", "clamp(1.6rem, 7vw, 2.6rem)"],
                  ["bodySize", "1rem"],
                  ["namesSize", "clamp(2rem, 9vw, 3.2rem)"],
                  ["lineHeight", "1.6"],
                  ["letterSpacing", "0.04em"],
                ] as const
              ).map(([key, placeholder]) => (
                <div key={key}>
                  <Label>{key}</Label>
                  <TextInput
                    value={(theme.typography[key] as string) ?? ""}
                    onChange={(v) => patchTypo(key, v)}
                    placeholder={placeholder}
                    dir="ltr"
                  />
                </div>
              ))}
              <div>
                <Label>textAlign</Label>
                <SelectInput
                  value={theme.typography.textAlign ?? "center"}
                  onChange={(v) => patchTypo("textAlign", v)}
                  options={[
                    { value: "center", label: "center" },
                    { value: "right", label: "right" },
                    { value: "left", label: "left" },
                    { value: "start", label: "start" },
                    { value: "end", label: "end" },
                  ]}
                />
              </div>
            </div>
          </Section>

          <Section title="Design Tokens (theme.design)">
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(DESIGN_TOKEN_OPTIONS) as (keyof typeof DESIGN_TOKEN_OPTIONS)[]).map(
                (key) => (
                  <div key={key}>
                    <Label>{key}</Label>
                    <SelectInput
                      value={(theme.design[key] as string) ?? ""}
                      onChange={(v) => patchDesign(key, v)}
                      options={DESIGN_TOKEN_OPTIONS[key].map((v) => ({ value: v, label: v }))}
                    />
                  </div>
                )
              )}
            </div>
          </Section>
        </>
      )}
    </div>
  );
}
