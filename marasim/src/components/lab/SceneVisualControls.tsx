"use client";

import React from "react";
import type {
  LiveTextConfig,
  SceneColorOverrides,
  SceneDesign,
  SceneMediaConfig,
  SceneType,
  ThemeTypography,
} from "@/types/invitation";
import type { ComposerSceneEdit } from "@/lib/composer/state";
import { syncMediaLiveText } from "@/lib/composer/state";
import {
  FUNCTIONAL_ICON_SCENES,
  iconsForScene,
  LIVE_TEXT_SCENES,
} from "@/lib/composer/visual-identity";
import { LOADED_FONT_OPTIONS } from "@/lib/theme-vars";
import {
  CheckInput,
  ColorInput,
  Label,
  Section,
  SelectInput,
  TextInput,
} from "./composer-fields";

interface SceneVisualControlsProps {
  sceneType: SceneType;
  edit: ComposerSceneEdit;
  onChange: (edit: ComposerSceneEdit) => void;
  uiMode: "basic" | "advanced";
}

function patchDesign(
  edit: ComposerSceneEdit,
  partial: Partial<SceneDesign>
): ComposerSceneEdit {
  return { ...edit, design: { ...edit.design, ...partial } };
}

function patchColors(
  edit: ComposerSceneEdit,
  partial: Partial<SceneColorOverrides>
): ComposerSceneEdit {
  return {
    ...edit,
    design: {
      ...edit.design,
      colors: { ...edit.design.colors, ...partial },
    },
  };
}

function patchSceneTypo(
  edit: ComposerSceneEdit,
  partial: Partial<ThemeTypography>
): ComposerSceneEdit {
  return {
    ...edit,
    design: {
      ...edit.design,
      typography: { ...edit.design.typography, ...partial },
    },
  };
}

function patchLiveText(
  edit: ComposerSceneEdit,
  partial: Partial<LiveTextConfig>
): ComposerSceneEdit {
  if (!edit.media) return edit;
  const media = syncMediaLiveText({
    ...edit.media,
    liveText: { ...edit.media.liveText, ...partial },
  });
  return { ...edit, media };
}

export default function SceneVisualControls({
  sceneType,
  edit,
  onChange,
  uiMode,
}: SceneVisualControlsProps) {
  const colors = edit.design.colors ?? {};
  const sceneTypo = edit.design.typography ?? {};
  const media = edit.media;
  const lt = media?.liveText ?? {};
  const showIcons = FUNCTIONAL_ICON_SCENES.includes(sceneType);
  const iconFields = iconsForScene(sceneType);
  const showLiveText =
    LIVE_TEXT_SCENES.includes(sceneType) &&
    (edit.compositionMode !== "web_layout" || uiMode === "advanced");

  const basicColorKeys: (keyof SceneColorOverrides)[] =
    uiMode === "basic"
      ? ["backgroundColor", "textColor", "accentColor"]
      : [
          "backgroundColor",
          "textColor",
          "accentColor",
          "buttonColor",
          "overlayColor",
        ];

  return (
    <>
      <Section title="Scene Colors">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {basicColorKeys.map((key) => (
            <div key={key}>
              <Label>{key}</Label>
              <ColorInput
                value={colors[key]?.toString() ?? ""}
                onChange={(v) => onChange(patchColors(edit, { [key]: v || undefined }))}
              />
            </div>
          ))}
          {uiMode === "advanced" && (
            <div>
              <Label>overlayOpacity</Label>
              <TextInput
                value={colors.overlayOpacity != null ? String(colors.overlayOpacity) : ""}
                onChange={(v) => {
                  const n = parseFloat(v);
                  onChange(
                    patchColors(edit, {
                      overlayOpacity: Number.isFinite(n) ? n : undefined,
                    })
                  );
                }}
                placeholder="0–1"
                dir="ltr"
              />
            </div>
          )}
        </div>
      </Section>

      {(uiMode === "advanced" || sceneType === "hero_names") && (
        <Section title="Scene Typography">
          <div className="grid grid-cols-2 gap-2">
            {sceneType === "hero_names" && (
              <div className="col-span-2">
                <Label>namesFont override</Label>
                <SelectInput
                  value={sceneTypo.namesFont ?? ""}
                  onChange={(namesFont) =>
                    onChange(patchSceneTypo(edit, { namesFont: namesFont || undefined }))
                  }
                  options={[
                    { value: "", label: "(inherit global)" },
                    ...LOADED_FONT_OPTIONS.map((f) => ({ value: f.value, label: f.label })),
                  ]}
                />
              </div>
            )}
            {uiMode === "advanced" && (
              <>
                {(
                  [
                    ["headingSize", "headingSize"],
                    ["bodySize", "bodySize"],
                    ["namesSize", "namesSize"],
                    ["lineHeight", "lineHeight"],
                    ["letterSpacing", "letterSpacing"],
                  ] as const
                ).map(([label, key]) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <TextInput
                      value={(sceneTypo[key] as string) ?? ""}
                      onChange={(v) =>
                        onChange(patchSceneTypo(edit, { [key]: v || undefined }))
                      }
                      dir="ltr"
                    />
                  </div>
                ))}
                <div>
                  <Label>textAlign</Label>
                  <SelectInput
                    value={sceneTypo.textAlign ?? ""}
                    onChange={(v) =>
                      onChange(patchSceneTypo(edit, { textAlign: (v || undefined) as ThemeTypography["textAlign"] }))
                    }
                    options={[
                      { value: "", label: "(inherit)" },
                      { value: "center", label: "center" },
                      { value: "right", label: "right" },
                      { value: "left", label: "left" },
                    ]}
                  />
                </div>
              </>
            )}
          </div>
        </Section>
      )}

      {showIcons && (
        <Section title={uiMode === "basic" ? "Icons" : "Icon Controls"}>
          <div className="mb-3">
            <Label>iconStyle</Label>
            <SelectInput
              value={edit.design.iconStyle ?? "line"}
              onChange={(iconStyle) =>
                onChange(
                  patchDesign(edit, {
                    iconStyle: iconStyle as SceneDesign["iconStyle"],
                  })
                )
              }
              options={[
                { value: "line", label: "line" },
                { value: "filled", label: "filled" },
                { value: "asset", label: "asset (custom path)" },
                { value: "none", label: "none (hide all)" },
              ]}
            />
          </div>
          {edit.design.iconStyle === "asset" && (
            <div className="space-y-2">
              {iconFields.map(({ key, label }) => (
                <div key={key}>
                  <Label>{label}</Label>
                  <TextInput
                    value={edit.design.iconAssets?.[key] ?? ""}
                    onChange={(src) => {
                      const iconAssets: Record<string, string> = {
                        ...(edit.design.iconAssets ?? {}),
                      };
                      if (src) iconAssets[key] = src;
                      else delete iconAssets[key];
                      onChange(patchDesign(edit, { iconAssets }));
                    }}
                    placeholder={`/assets/icons/${key}.webp — empty = hide`}
                    dir="ltr"
                  />
                </div>
              ))}
            </div>
          )}
          {uiMode === "advanced" && edit.design.iconStyle !== "asset" && (
            <p className="text-xs text-zinc-500">
              Set iconStyle to &quot;asset&quot; to replace individual icons with SVG/WebP paths.
            </p>
          )}
        </Section>
      )}

      {showLiveText && media && (
        <Section title="Live Text">
          <CheckInput
            label="enabled"
            checked={lt.enabled ?? media.liveTextEnabled ?? false}
            onChange={(enabled) => onChange(patchLiveText(edit, { enabled }))}
          />
          {(lt.enabled ?? media.liveTextEnabled) && (
            <div className="mt-2 space-y-2">
              <div>
                <Label>placement</Label>
                <SelectInput
                  value={lt.placement ?? media.liveTextPlacement ?? "center"}
                  onChange={(placement) => onChange(patchLiveText(edit, { placement }))}
                  options={[
                    { value: "top", label: "top" },
                    { value: "center", label: "center" },
                    { value: "bottom", label: "bottom" },
                    { value: "overlay", label: "overlay" },
                  ]}
                />
              </div>
              {uiMode === "advanced" && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>color</Label>
                      <ColorInput
                        value={lt.color ?? ""}
                        onChange={(color) => onChange(patchLiveText(edit, { color }))}
                      />
                    </div>
                    <div>
                      <Label>emphasisColor</Label>
                      <ColorInput
                        value={lt.emphasisColor ?? ""}
                        onChange={(emphasisColor) =>
                          onChange(patchLiveText(edit, { emphasisColor }))
                        }
                      />
                    </div>
                    <div>
                      <Label>size</Label>
                      <TextInput
                        value={lt.size ?? ""}
                        onChange={(size) => onChange(patchLiveText(edit, { size }))}
                        placeholder="var(--inv-body-size)"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <Label>emphasisSize</Label>
                      <TextInput
                        value={lt.emphasisSize ?? ""}
                        onChange={(emphasisSize) =>
                          onChange(patchLiveText(edit, { emphasisSize }))
                        }
                        placeholder="var(--inv-heading-size)"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <Label>font</Label>
                      <SelectInput
                        value={lt.font ?? ""}
                        onChange={(font) => onChange(patchLiveText(edit, { font: font || undefined }))}
                        options={[
                          { value: "", label: "(auto)" },
                          ...LOADED_FONT_OPTIONS.map((f) => ({ value: f.value, label: f.label })),
                        ]}
                      />
                    </div>
                    <div>
                      <Label>align</Label>
                      <SelectInput
                        value={lt.align ?? "center"}
                        onChange={(align) =>
                          onChange(patchLiveText(edit, { align: align as LiveTextConfig["align"] }))
                        }
                        options={[
                          { value: "left", label: "left" },
                          { value: "center", label: "center" },
                          { value: "right", label: "right" },
                        ]}
                      />
                    </div>
                    <div>
                      <Label>maxWidth</Label>
                      <TextInput
                        value={lt.maxWidth ?? ""}
                        onChange={(maxWidth) => onChange(patchLiveText(edit, { maxWidth }))}
                        placeholder="90%"
                        dir="ltr"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>textShadow</Label>
                      <TextInput
                        value={lt.textShadow ?? ""}
                        onChange={(textShadow) => onChange(patchLiveText(edit, { textShadow }))}
                        placeholder="0 2px 12px rgba(0,0,0,0.5)"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <CheckInput
                    label="background panel"
                    checked={lt.panelEnabled ?? false}
                    onChange={(panelEnabled) => onChange(patchLiveText(edit, { panelEnabled }))}
                  />
                  {lt.panelEnabled && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>panelColor</Label>
                        <ColorInput
                          value={lt.panelColor ?? "#000000"}
                          onChange={(panelColor) => onChange(patchLiveText(edit, { panelColor }))}
                        />
                      </div>
                      <div>
                        <Label>panelOpacity</Label>
                        <TextInput
                          value={lt.panelOpacity != null ? String(lt.panelOpacity) : ""}
                          onChange={(v) => {
                            const n = parseFloat(v);
                            onChange(
                              patchLiveText(edit, {
                                panelOpacity: Number.isFinite(n) ? n : undefined,
                              })
                            );
                          }}
                          dir="ltr"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </Section>
      )}
    </>
  );
}

/** Patch media with live text sync — exported for SceneComposerControls */
export function patchMediaEdit(
  edit: ComposerSceneEdit,
  partial: Partial<SceneMediaConfig>
): ComposerSceneEdit {
  if (!edit.media) return edit;
  return { ...edit, media: syncMediaLiveText({ ...edit.media, ...partial }) };
}
