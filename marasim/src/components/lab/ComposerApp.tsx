"use client";

import React, { useCallback, useMemo, useState } from "react";
import type { SceneType } from "@/types/invitation";
import { getInvitationBySlug } from "@/lib/invitation-config";
import {
  COMPOSER_DEMO_SLUGS,
  type ComposerDemoSlug,
} from "@/lib/composer/constants";
import {
  applyComposerState,
  buildSeparatedExports,
  createDefaultMedia,
  createDefaultSceneEdit,
  duplicateSceneEdits,
  exportBlueprintSnippet,
  exportInvitationDataSnippet,
  exportPresetSnippet,
  exportResolvedConfigSnippet,
  initComposerStateFromConfig,
  renameSceneEditKey,
  type ComposerSceneEdit,
  type ComposerState,
} from "@/lib/composer/state";
import { formatAssetChecklist } from "@/lib/composer/asset-paths";
import SceneComposerControls from "./SceneComposerControls";
import ThemeOverridesPanel from "./ThemeOverridesPanel";
import JourneyPanel from "./JourneyPanel";
import PreviewFrame from "./PreviewFrame";
import { getSceneComponent } from "@/components/invitation/scene-registry";
import InvitationRenderer from "@/components/invitation/InvitationRenderer";
import ComposerSupabaseBar from "./ComposerSupabaseBar";

type ComposerTab = "journey" | "design" | "content";
type ExportKind = "blueprint" | "preset" | "invitationData" | "resolvedConfig";

function ScenePreview({
  config,
  sceneId,
}: {
  config: ReturnType<typeof applyComposerState>;
  sceneId: string;
}) {
  const scene = config.scenes.find((s) => s.id === sceneId);
  const Component = scene ? getSceneComponent(scene.type) : undefined;

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
  const initialSlug: ComposerDemoSlug = "ws-royal-demo";
  const initialConfig = getInvitationBySlug(initialSlug)!;

  const [slug, setSlug] = useState<ComposerDemoSlug>(initialSlug);
  const [composerState, setComposerState] = useState<ComposerState>(() =>
    initComposerStateFromConfig(initialConfig)
  );
  const [selectedSceneId, setSelectedSceneId] = useState<string>(
    initialConfig.scenes[0]?.id ?? ""
  );
  const [baseConfig, setBaseConfig] = useState(() => initialConfig);
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);
  const [exportModal, setExportModal] = useState<ExportKind | null>(null);
  const [checklistCopied, setChecklistCopied] = useState(false);
  const [uiMode, setUiMode] = useState<"basic" | "advanced">("basic");
  const [composerTab, setComposerTab] = useState<ComposerTab>("design");

  const loadDemo = useCallback((nextSlug: ComposerDemoSlug) => {
    const config = getInvitationBySlug(nextSlug);
    if (!config) return;
    setSlug(nextSlug);
    setBaseConfig(config);
    const state = initComposerStateFromConfig(config);
    setComposerState(state);
    setSelectedSceneId(config.scenes[0]?.id ?? "");
  }, []);

  const previewConfig = useMemo(
    () => applyComposerState(baseConfig, composerState),
    [baseConfig, composerState]
  );

  const selectedInstance = composerState.journey.instances.find(
    (i) => i.id === selectedSceneId
  );
  const selectedSceneType = selectedInstance?.type;
  const currentEdit = selectedSceneId
    ? composerState.sceneEdits[selectedSceneId]
    : undefined;

  const separatedExports = useMemo(
    () => buildSeparatedExports(baseConfig, composerState),
    [baseConfig, composerState]
  );

  const updateSceneEdit = (sceneId: string, edit: ComposerSceneEdit) => {
    setComposerState((prev) => ({
      ...prev,
      sceneEdits: { ...prev.sceneEdits, [sceneId]: edit },
    }));
  };

  const handleCompositionModeChange = (
    sceneId: string,
    sceneType: SceneType,
    edit: ComposerSceneEdit
  ) => {
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
    updateSceneEdit(sceneId, next);
  };

  const exportText = (() => {
    if (!exportModal) return "";
    switch (exportModal) {
      case "blueprint":
        return exportBlueprintSnippet(separatedExports.blueprint);
      case "preset":
        return exportPresetSnippet(separatedExports.preset);
      case "invitationData":
        return exportInvitationDataSnippet(slug, separatedExports.invitationData);
      case "resolvedConfig":
        return exportResolvedConfigSnippet(separatedExports.resolvedConfig);
      default:
        return "";
    }
  })();

  const exportTitle =
    exportModal === "blueprint"
      ? "Sequence Blueprint"
      : exportModal === "preset"
        ? "Design Preset"
        : exportModal === "invitationData"
          ? "InvitationData"
          : "Resolved Config";

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 bg-zinc-900 px-4 py-3">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3">
          <h1 className="text-lg font-semibold text-amber-400">Scene Composer</h1>
          <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
            Internal · Phase 2.11
          </span>
          <div className="flex rounded border border-zinc-600 text-xs">
            <button type="button" onClick={() => setUiMode("basic")} className={`px-3 py-1.5 ${uiMode === "basic" ? "bg-amber-600 text-white" : "text-zinc-400 hover:bg-zinc-800"}`}>Basic</button>
            <button type="button" onClick={() => setUiMode("advanced")} className={`px-3 py-1.5 ${uiMode === "advanced" ? "bg-amber-600 text-white" : "text-zinc-400 hover:bg-zinc-800"}`}>Advanced</button>
          </div>
          <a href="/lab/composer/userguide" className="rounded border border-zinc-600 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-amber-300">دليل الاستخدام</a>
          <div className="flex-1" />
          <select value={slug} onChange={(e) => loadDemo(e.target.value as ComposerDemoSlug)} className="rounded border border-zinc-600 bg-zinc-800 px-3 py-1.5 text-sm">
            {COMPOSER_DEMO_SLUGS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button type="button" onClick={async () => { await navigator.clipboard.writeText(formatAssetChecklist(slug)); setChecklistCopied(true); setTimeout(() => setChecklistCopied(false), 2000); }} className="rounded border border-zinc-600 px-3 py-1.5 text-sm hover:bg-zinc-800">
            {checklistCopied ? "Copied!" : "Copy Asset Checklist"}
          </button>
          <button type="button" onClick={() => setFullPreviewOpen(true)} className="rounded bg-amber-600 px-3 py-1.5 text-sm font-medium hover:bg-amber-500">Preview Full Invitation</button>
          {(["blueprint", "preset", "invitationData", "resolvedConfig"] as ExportKind[]).map((kind) => (
            <button key={kind} type="button" onClick={() => setExportModal(kind)} className="rounded border border-zinc-600 px-3 py-1.5 text-sm hover:bg-zinc-800">
              Export {kind === "invitationData" ? "Data" : kind === "resolvedConfig" ? "Config" : kind === "blueprint" ? "Blueprint" : "Preset"}
            </button>
          ))}
        </div>
        <div className="mx-auto mt-2 max-w-[1600px]">
          <ComposerSupabaseBar
            slug={slug}
            invitationData={separatedExports.invitationData}
            onLoadSlug={(s) => loadDemo(s as ComposerDemoSlug)}
          />
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-4 p-4 lg:grid-cols-12">
        <aside className="lg:col-span-2">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Scene Instances</h2>
          <ul className="space-y-1">
            {composerState.journey.instances.map((inst) => {
              const edit = composerState.sceneEdits[inst.id];
              return (
                <li key={inst.id}>
                  <button type="button" onClick={() => setSelectedSceneId(inst.id)} className={`w-full rounded px-3 py-2 text-right text-sm transition ${selectedSceneId === inst.id ? "bg-amber-600/20 text-amber-300 ring-1 ring-amber-600/50" : inst.enabled ? "text-zinc-300 hover:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-800"}`}>
                    <span className="block font-medium">{inst.label}</span>
                    <span className="block truncate text-xs text-zinc-500" dir="ltr">{inst.id} · {edit?.compositionMode ?? "web_layout"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="lg:col-span-5">
          <div className="mb-3 flex rounded border border-zinc-700 text-xs">
            {(["journey", "design", "content"] as ComposerTab[]).map((tab) => (
              <button key={tab} type="button" onClick={() => setComposerTab(tab)} className={`flex-1 py-1.5 ${composerTab === tab ? "bg-amber-700 text-white" : "text-zinc-400 hover:bg-zinc-800"}`}>
                {tab === "journey" ? "A. Journey" : tab === "design" ? "B. Design" : "C. Content"}
              </button>
            ))}
          </div>

          {composerTab === "journey" && (
            <JourneyPanel
              journey={composerState.journey}
              selectedSceneId={selectedSceneId}
              onJourneyChange={(journey) => setComposerState((prev) => ({ ...prev, journey }))}
              onSelectScene={setSelectedSceneId}
              onDuplicate={(sourceId, newId) => setComposerState((prev) => ({ ...prev, sceneEdits: duplicateSceneEdits(prev.sceneEdits, sourceId, newId) }))}
              onRemove={(sceneId) => {
                setComposerState((prev) => {
                  const nextEdits = { ...prev.sceneEdits };
                  delete nextEdits[sceneId];
                  return { ...prev, sceneEdits: nextEdits };
                });
                if (selectedSceneId === sceneId) {
                  const remaining = composerState.journey.instances.filter((i) => i.id !== sceneId);
                  setSelectedSceneId(remaining[0]?.id ?? "");
                }
              }}
              onRenameId={(oldId, newId) => setComposerState((prev) => ({ ...prev, sceneEdits: renameSceneEditKey(prev.sceneEdits, oldId, newId) }))}
              onAddInstance={(inst) => setComposerState((prev) => ({
                ...prev,
                sceneEdits: {
                  ...prev.sceneEdits,
                  [inst.id]: createDefaultSceneEdit(inst.type),
                },
              }))}
            />
          )}

          {composerTab === "design" && selectedSceneType && currentEdit && (
            <>
              <ThemeOverridesPanel theme={composerState.themeEdit} onChange={(themeEdit) => setComposerState((prev) => ({ ...prev, themeEdit }))} uiMode={uiMode} />
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">{selectedInstance?.label} — Design <span className="font-normal text-zinc-600" dir="ltr">({selectedSceneId})</span></h2>
              <SceneComposerControls sceneType={selectedSceneType} slug={slug} edit={currentEdit} uiMode={uiMode} tab="design" onChange={(edit) => { if (edit.compositionMode !== currentEdit.compositionMode) handleCompositionModeChange(selectedSceneId, selectedSceneType, edit); else updateSceneEdit(selectedSceneId, edit); }} />
            </>
          )}

          {composerTab === "content" && selectedSceneType && currentEdit && (
            <>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">{selectedInstance?.label} — Content <span className="font-normal text-zinc-600" dir="ltr">({selectedSceneId})</span></h2>
              <SceneComposerControls sceneType={selectedSceneType} slug={slug} edit={currentEdit} uiMode={uiMode} tab="content" onChange={(edit) => updateSceneEdit(selectedSceneId, edit)} />
            </>
          )}
        </section>

        <section className="lg:col-span-5">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Live Preview (390px)</h2>
          <p className="mb-3 text-xs text-zinc-500">Preview for <code className="text-amber-300">{selectedSceneId}</code></p>
          <div className="overflow-y-auto rounded-lg bg-zinc-900 p-2" style={{ maxHeight: "calc(100vh - 160px)" }}>
            {selectedSceneId && <ScenePreview key={`${slug}-${selectedSceneId}`} config={previewConfig} sceneId={selectedSceneId} />}
          </div>
        </section>
      </div>

      {fullPreviewOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
          <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-2">
            <span className="text-sm text-zinc-300">Full invitation — {slug}</span>
            <button type="button" onClick={() => setFullPreviewOpen(false)} className="rounded bg-zinc-700 px-3 py-1 text-sm hover:bg-zinc-600">Close</button>
          </div>
          <div className="flex-1 overflow-auto"><InvitationRenderer config={previewConfig} /></div>
        </div>
      )}

      {exportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl border border-zinc-600 bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
              <h3 className="font-medium text-amber-400">Export {exportTitle}</h3>
              <button type="button" onClick={() => setExportModal(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <textarea readOnly value={exportText} className="min-h-[300px] flex-1 resize-none bg-zinc-950 p-4 font-mono text-xs text-green-300" dir="ltr" />
            <div className="border-t border-zinc-700 p-3">
              <button type="button" onClick={() => navigator.clipboard.writeText(exportText)} className="rounded bg-amber-600 px-4 py-2 text-sm font-medium hover:bg-amber-500">Copy to clipboard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
