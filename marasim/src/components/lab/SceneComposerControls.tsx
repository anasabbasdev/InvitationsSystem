"use client";

import React from "react";
import type {
  DesignTokens,
  MediaAsset,
  SceneMediaConfig,
  SceneType,
} from "@/types/invitation";
import type { ComposerDemoSlug } from "@/lib/composer/constants";
import { SCENE_LABELS, SCENE_VARIANTS } from "@/lib/composer/constants";
import { getAssetPathSet, suggestMediaPath } from "@/lib/composer/asset-paths";
import { type ComposerSceneEdit } from "@/lib/composer/state";
import {
  DESIGN_TOKEN_OPTIONS,
  Label,
  MediaAssetFields,
  Section,
  SelectInput,
  TextInput,
} from "./composer-fields";
import SceneContentEditor from "./SceneContentEditor";
import SceneVisualControls, { patchMediaEdit } from "./SceneVisualControls";

const FOREGROUND_SLOTS = [0, 1, 2] as const;

interface SceneComposerControlsProps {
  sceneType: SceneType;
  slug: ComposerDemoSlug;
  edit: ComposerSceneEdit;
  onChange: (edit: ComposerSceneEdit) => void;
  uiMode: "basic" | "advanced";
  /** Which tab context this renders in: "design" shows media/visual, "content" shows only editor */
  tab?: "design" | "content";
}

export default function SceneComposerControls({
  sceneType,
  slug,
  edit,
  onChange,
  uiMode,
  tab,
}: SceneComposerControlsProps) {
  const assetSet = getAssetPathSet(slug);
  const media = edit.media;

  const patchMedia = (partial: Partial<SceneMediaConfig>) => {
    onChange(patchMediaEdit(edit, partial));
  };

  const patchDesign = (partial: Partial<DesignTokens>) => {
    onChange({ ...edit, design: { ...edit.design, ...partial } });
  };

  const patchForegroundAt = (index: number, asset: MediaAsset | undefined) => {
    const current = media?.foreground ?? [];
    const next: MediaAsset[] = FOREGROUND_SLOTS.map((i) => {
      if (i === index) {
        return asset ?? { type: "image", src: "", fit: "cover", position: "bottom" };
      }
      return current[i] ?? { type: "image", src: "", fit: "cover", position: "bottom" };
    });
    patchMedia({ foreground: next.filter((a) => a.src.trim()) });
  };

  const showLayerFields = (label: string, asset: MediaAsset | undefined, onLayerChange: (a: MediaAsset | undefined) => void, opts?: { showPoster?: boolean; layerOptions?: boolean }) => {
    if (uiMode === "basic" && label !== "mainMedia" && label !== "background") return null;
    return (
      <MediaAssetFields
        label={label}
        asset={asset}
        showPoster={opts?.showPoster}
        layerOptions={uiMode === "advanced" || opts?.layerOptions}
        onChange={onLayerChange}
      />
    );
  };

  const handleContentChange = (content: Record<string, unknown>) => {
    let next: ComposerSceneEdit = { ...edit, content };
    if (sceneType === "opening" && typeof content.tapText === "string") {
      next = patchMediaEdit(next, { startButtonText: content.tapText });
    }
    onChange(next);
  };

  // When tab="content", only show the content editor
  if (tab === "content") {
    return (
      <div className="space-y-4 overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 260px)" }}>
        <SceneContentEditor
          sceneType={sceneType}
          content={edit.content}
          onChange={handleContentChange}
          mode="advanced"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 260px)" }}>
      {/* In Design tab, always show content editor in basic mode for quick access */}
      {tab === "design" ? null : (
        <SceneContentEditor
          sceneType={sceneType}
          content={edit.content}
          onChange={handleContentChange}
          mode={uiMode}
        />
      )}

      <SceneVisualControls
        sceneType={sceneType}
        edit={edit}
        onChange={onChange}
        uiMode={uiMode}
      />

      <Section title="Composition Mode">
        <SelectInput
          value={edit.compositionMode}
          onChange={(compositionMode) => onChange({ ...edit, compositionMode })}
          options={[
            { value: "web_layout", label: "web_layout" },
            { value: "full_media", label: "full_media" },
            { value: "layered_media", label: "layered_media" },
          ]}
        />
      </Section>

      {edit.compositionMode === "web_layout" && uiMode === "advanced" && (
        <Section title="Web Layout">
          <div>
            <Label>variant</Label>
            <SelectInput
              value={edit.variant}
              onChange={(variant) => onChange({ ...edit, variant })}
              options={SCENE_VARIANTS[sceneType].map((v) => ({ value: v, label: v }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            {(Object.keys(DESIGN_TOKEN_OPTIONS) as (keyof typeof DESIGN_TOKEN_OPTIONS)[]).map(
              (key) => (
                <div key={key}>
                  <Label>{key}</Label>
                  <SelectInput
                    value={(edit.design[key] as string) ?? ""}
                    onChange={(v) => patchDesign({ [key]: v })}
                    options={DESIGN_TOKEN_OPTIONS[key].map((o) => ({ value: o, label: o }))}
                  />
                </div>
              )
            )}
          </div>
        </Section>
      )}

      {edit.compositionMode === "full_media" && media && (
        <>
          <Section title="Full Media">
            {showLayerFields("mainMedia", media.mainMedia, (mainMedia) => patchMedia({ mainMedia }), { showPoster: true })}
            {uiMode === "basic" && (
              <button
                type="button"
                className="text-xs text-amber-400 underline"
                onClick={() =>
                  patchMedia({
                    mainMedia: {
                      type: sceneType === "opening" ? "video" : "image",
                      src: suggestMediaPath(slug, sceneType, "main"),
                      poster:
                        sceneType === "opening"
                          ? suggestMediaPath(slug, sceneType, "poster")
                          : undefined,
                      fit: "cover",
                      muted: true,
                      playsInline: true,
                    },
                  })
                }
              >
                Use suggested path for {SCENE_LABELS[sceneType]}
              </button>
            )}
          </Section>
          {uiMode === "advanced" && (
            <Section title="Playback & Start">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>startBehavior</Label>
                  <SelectInput
                    value={media.startBehavior ?? "none"}
                    onChange={(startBehavior) => patchMedia({ startBehavior })}
                    options={[
                      { value: "none", label: "none" },
                      { value: "center_button", label: "center_button" },
                      { value: "tap_anywhere", label: "tap_anywhere" },
                    ]}
                  />
                </div>
                <div>
                  <Label>playBehavior</Label>
                  <SelectInput
                    value={media.playBehavior ?? "on_tap"}
                    onChange={(playBehavior) => patchMedia({ playBehavior })}
                    options={[
                      { value: "on_visible", label: "on_visible" },
                      { value: "on_tap", label: "on_tap" },
                      { value: "manual", label: "manual" },
                    ]}
                  />
                </div>
                <div>
                  <Label>revealAfter</Label>
                  <SelectInput
                    value={media.revealAfter ?? "media_end"}
                    onChange={(revealAfter) => patchMedia({ revealAfter })}
                    options={[
                      { value: "media_end", label: "media_end" },
                      { value: "tap", label: "tap" },
                      { value: "immediate", label: "immediate" },
                    ]}
                  />
                </div>
              </div>
            </Section>
          )}
        </>
      )}

      {edit.compositionMode === "layered_media" && media && (
        <Section title="Layered Media">
          {showLayerFields("background", media.background, (background) => patchMedia({ background }), { layerOptions: true })}
          {uiMode === "advanced" && (
            <>
              {showLayerFields("mainMedia (optional)", media.mainMedia, (mainMedia) => patchMedia({ mainMedia }), { showPoster: true, layerOptions: true })}
              {showLayerFields("overlay", media.overlay, (overlay) => patchMedia({ overlay }), { layerOptions: true })}
            </>
          )}
          {FOREGROUND_SLOTS.map((i) =>
            uiMode === "advanced" || i === 0 ? (
              <MediaAssetFields
                key={i}
                label={`foreground[${i}]`}
                asset={media.foreground?.[i]}
                layerOptions={uiMode === "advanced"}
                onChange={(fg) => patchForegroundAt(i, fg)}
              />
            ) : null
          )}
          {uiMode === "advanced" &&
            showLayerFields("frame (optional)", media.frame, (frame) => patchMedia({ frame }), { layerOptions: true })}
          <button
            type="button"
            className="text-xs text-amber-400 underline"
            onClick={() =>
              patchMedia({
                background: {
                  type: "image",
                  src: suggestMediaPath(slug, sceneType, "background"),
                  fit: "cover",
                  zIndex: 0,
                },
                foreground:
                  sceneType === "hero_names"
                    ? [
                        {
                          type: "image",
                          src: suggestMediaPath(slug, sceneType, "foreground"),
                          fit: "contain",
                          position: "bottom",
                          zIndex: 20,
                        },
                      ]
                    : media.foreground,
              })
            }
          >
            Use suggested layered paths
          </button>
        </Section>
      )}

      {uiMode === "advanced" && (
        <Section title="Asset Path Helper">
          <p className="text-xs text-zinc-400">
            Folder: <code className="text-amber-300">{assetSet.base}</code>
          </p>
          <ul className="mt-2 space-y-1 text-xs text-zinc-500" dir="ltr">
            {assetSet.files.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
