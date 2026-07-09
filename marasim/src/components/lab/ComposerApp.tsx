"use client";

import React, { useCallback, useMemo, useState } from "react";
import type { SceneType } from "@/types/invitation";
import { getInvitationBySlug } from "@/lib/invitation-config";
import {
  COMPOSER_DEMO_SLUGS,
  SCENE_LABELS,
  SCENE_ORDER,
  type ComposerDemoSlug,
} from "@/lib/composer/constants";
import {
  applyComposerEdits,
  buildExportPayload,
  createDefaultMedia,
  exportInvitationDataSnippet,
  exportJsonString,
  initEditsFromConfig,
  initThemeFromConfig,
  type ComposerEdits,
  type ComposerSceneEdit,
  type ComposerThemeEdit,
} from "@/lib/composer/state";
import { formatAssetChecklist } from "@/lib/composer/asset-paths";
import SceneComposerControls from "./SceneComposerControls";
import ThemeOverridesPanel from "./ThemeOverridesPanel";
import PreviewFrame from "./PreviewFrame";
import { getSceneComponent } from "@/components/invitation/scene-registry";
import InvitationRenderer from "@/components/invitation/InvitationRenderer";

function ScenePreview({
  config,
  sceneType,
}: {
  config: ReturnType<typeof applyComposerEdits>;
  sceneType: SceneType;
}) {
  const scene = config.scenes.find((s) => s.type === sceneType);
  const Component = getSceneComponent(sceneType);

  if (!scene || !Component) {
    return <p className="p-4 text-sm text-zinc-500">Scene not available</p>;
  }

  return (
    <PreviewFrame config={config} minHeight="100dvh">
      <Component scene={scene} config={config} onOpen={() => {}} />
    </PreviewFrame>
  );
}

export default function ComposerApp() {
  const initialSlug: ComposerDemoSlug = "noor-wedding-media-demo";
  const initialConfig = getInvitationBySlug(initialSlug)!;

  const [slug, setSlug] = useState<ComposerDemoSlug>(initialSlug);
  const [selectedScene, setSelectedScene] = useState<SceneType>("opening");
  const [edits, setEdits] = useState<ComposerEdits>(() => initEditsFromConfig(initialConfig));
  const [themeEdit, setThemeEdit] = useState<ComposerThemeEdit>(() =>
    initThemeFromConfig(initialConfig)
  );
  const [baseConfig, setBaseConfig] = useState(() => initialConfig);
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);
  const [exportModal, setExportModal] = useState<"json" | "snippet" | null>(null);
  const [checklistCopied, setChecklistCopied] = useState(false);
  const [uiMode, setUiMode] = useState<"basic" | "advanced">("basic");

  const loadDemo = useCallback((nextSlug: ComposerDemoSlug) => {
    const config = getInvitationBySlug(nextSlug);
    if (!config) return;
    setSlug(nextSlug);
    setBaseConfig(config);
    setEdits(initEditsFromConfig(config));
    setThemeEdit(initThemeFromConfig(config));
    setSelectedScene("opening");
  }, []);

  const previewConfig = useMemo(
    () => applyComposerEdits(baseConfig, edits, themeEdit),
    [baseConfig, edits, themeEdit]
  );

  const currentEdit = edits[selectedScene];
  const exportPayload = useMemo(
    () => buildExportPayload(baseConfig, edits, themeEdit),
    [baseConfig, edits, themeEdit]
  );

  const updateSceneEdit = (sceneType: SceneType, edit: ComposerSceneEdit) => {
    setEdits((prev) => ({ ...prev, [sceneType]: edit }));
  };

  const handleCompositionModeChange = (sceneType: SceneType, edit: ComposerSceneEdit) => {
    let next = edit;
    if (
      (edit.compositionMode === "full_media" || edit.compositionMode === "layered_media") &&
      !edit.media
    ) {
      next = {
        ...edit,
        media: createDefaultMedia(edit.compositionMode, sceneType, slug),
      };
    }
    if (edit.compositionMode === "web_layout") {
      next = { ...edit, media: undefined };
    }
    updateSceneEdit(sceneType, next);
  };

  const exportText =
    exportModal === "json"
      ? exportJsonString(exportPayload)
      : exportModal === "snippet"
        ? exportInvitationDataSnippet(slug, exportPayload)
        : "";

  const copyAssetChecklist = async () => {
    await navigator.clipboard.writeText(formatAssetChecklist(slug));
    setChecklistCopied(true);
    setTimeout(() => setChecklistCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 bg-zinc-900 px-4 py-3">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3">
          <h1 className="text-lg font-semibold text-amber-400">Scene Composer</h1>
          <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
            Internal · Phase 2.9.2
          </span>
          <div className="flex rounded border border-zinc-600 text-xs">
            <button
              type="button"
              onClick={() => setUiMode("basic")}
              className={`px-3 py-1.5 ${uiMode === "basic" ? "bg-amber-600 text-white" : "text-zinc-400 hover:bg-zinc-800"}`}
            >
              Basic
            </button>
            <button
              type="button"
              onClick={() => setUiMode("advanced")}
              className={`px-3 py-1.5 ${uiMode === "advanced" ? "bg-amber-600 text-white" : "text-zinc-400 hover:bg-zinc-800"}`}
            >
              Advanced
            </button>
          </div>
          <div className="flex-1" />
          <select
            value={slug}
            onChange={(e) => loadDemo(e.target.value as ComposerDemoSlug)}
            className="rounded border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-sm"
          >
            {COMPOSER_DEMO_SLUGS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={copyAssetChecklist}
            className="rounded border border-zinc-600 px-3 py-1.5 text-sm hover:bg-zinc-800"
          >
            {checklistCopied ? "Copied!" : "Copy Asset Checklist"}
          </button>
          <button
            type="button"
            onClick={() => setFullPreviewOpen(true)}
            className="rounded bg-amber-600 px-3 py-1.5 text-sm font-medium hover:bg-amber-500"
          >
            Preview Full Invitation
          </button>
          <button
            type="button"
            onClick={() => setExportModal("json")}
            className="rounded border border-zinc-600 px-3 py-1.5 text-sm hover:bg-zinc-800"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => setExportModal("snippet")}
            className="rounded border border-zinc-600 px-3 py-1.5 text-sm hover:bg-zinc-800"
          >
            Export InvitationData snippet
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 p-4 lg:grid-cols-12">
        <aside className="lg:col-span-2">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Scenes
          </h2>
          <ul className="space-y-1">
            {SCENE_ORDER.map((type) => {
              const edit = edits[type];
              const mode = edit?.compositionMode ?? "web_layout";
              return (
                <li key={type}>
                  <button
                    type="button"
                    onClick={() => setSelectedScene(type)}
                    className={`w-full rounded px-3 py-2 text-right text-sm transition ${
                      selectedScene === type
                        ? "bg-amber-600/20 text-amber-300 ring-1 ring-amber-600/50"
                        : "text-zinc-300 hover:bg-zinc-800"
                    }`}
                  >
                    <span className="block font-medium">{SCENE_LABELS[type]}</span>
                    <span className="block text-xs text-zinc-500">{mode}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="lg:col-span-5">
          <ThemeOverridesPanel theme={themeEdit} onChange={setThemeEdit} uiMode={uiMode} />
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {SCENE_LABELS[selectedScene]} — Controls
          </h2>
          {currentEdit ? (
            <SceneComposerControls
              sceneType={selectedScene}
              slug={slug}
              edit={currentEdit}
              uiMode={uiMode}
              onChange={(edit) => {
                if (edit.compositionMode !== currentEdit.compositionMode) {
                  handleCompositionModeChange(selectedScene, edit);
                } else {
                  updateSceneEdit(selectedScene, edit);
                }
              }}
            />
          ) : (
            <p className="text-sm text-zinc-500">Loading scene…</p>
          )}
        </section>

        <section className="lg:col-span-5">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Live Preview (390px)
          </h2>
          <p className="mb-3 text-xs text-zinc-500">
            Uses the same Scene component as production — not a separate mockup.
          </p>
          <div
            className="overflow-y-auto rounded-lg bg-zinc-900 p-2"
            style={{ maxHeight: "calc(100vh - 160px)" }}
          >
            <ScenePreview
              key={`${slug}-${selectedScene}-${JSON.stringify({ currentEdit, themeEdit })}`}
              config={previewConfig}
              sceneType={selectedScene}
            />
          </div>
        </section>
      </div>

      {fullPreviewOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
          <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-2">
            <span className="text-sm text-zinc-300">Full invitation — {slug}</span>
            <button
              type="button"
              onClick={() => setFullPreviewOpen(false)}
              className="rounded bg-zinc-700 px-3 py-1 text-sm hover:bg-zinc-600"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            <InvitationRenderer config={previewConfig} />
          </div>
        </div>
      )}

      {exportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-zinc-600 bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
              <h3 className="font-medium text-amber-400">
                {exportModal === "json" ? "Export JSON" : "InvitationData Snippet"}
              </h3>
              <button
                type="button"
                onClick={() => setExportModal(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <textarea
              readOnly
              value={exportText}
              className="min-h-[300px] flex-1 resize-none bg-zinc-950 p-4 font-mono text-xs text-green-300"
              dir="ltr"
            />
            <div className="border-t border-zinc-700 p-3">
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(exportText)}
                className="rounded bg-amber-600 px-4 py-2 text-sm font-medium hover:bg-amber-500"
              >
                Copy to clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
