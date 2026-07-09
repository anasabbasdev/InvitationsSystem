"use client";

import React, { useState } from "react";
import type { SceneType } from "@/types/invitation";
import {
  type ComposerJourney,
  type ComposerSceneInstance,
  createSceneInstance,
  duplicateInstance,
  moveInstance,
  removeInstance,
  updateInstanceId,
  validateSceneId,
} from "@/lib/composer/journey";
import { SCENE_ORDER, SCENE_LABELS } from "@/lib/composer/constants";

interface JourneyPanelProps {
  journey: ComposerJourney;
  selectedSceneId: string | null;
  onJourneyChange: (journey: ComposerJourney) => void;
  onSelectScene: (sceneId: string) => void;
  onDuplicate: (sourceId: string, newId: string) => void;
  onRemove: (sceneId: string) => void;
  onRenameId: (oldId: string, newId: string) => void;
  onAddInstance?: (instance: ComposerSceneInstance) => void;
}

export default function JourneyPanel({
  journey,
  selectedSceneId,
  onJourneyChange,
  onSelectScene,
  onDuplicate,
  onRemove,
  onRenameId,
  onAddInstance,
}: JourneyPanelProps) {
  const [showAddPicker, setShowAddPicker] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [idDraft, setIdDraft] = useState("");
  const [idError, setIdError] = useState<string | null>(null);
  const [removeWarning, setRemoveWarning] = useState<string | null>(null);

  const existingIds = journey.instances.map((i) => i.id);

  const patchInstance = (index: number, patch: Partial<ComposerSceneInstance>) => {
    const next = [...journey.instances];
    next[index] = { ...next[index], ...patch };
    onJourneyChange({ instances: next });
  };

  const handleAddScene = (type: SceneType) => {
    const inst = createSceneInstance(type, existingIds);
    onJourneyChange({ instances: [...journey.instances, inst] });
    onAddInstance?.(inst);
    onSelectScene(inst.id);
    setShowAddPicker(false);
  };

  const handleDuplicate = (index: number) => {
    const { instances, newId } = duplicateInstance(journey.instances, index);
    onJourneyChange({ instances });
    onDuplicate(journey.instances[index].id, newId);
    onSelectScene(newId);
  };

  const handleRemove = (index: number) => {
    const inst = journey.instances[index];
    if (inst.required) {
      setRemoveWarning(`"${inst.label}" is required and cannot be removed.`);
      setTimeout(() => setRemoveWarning(null), 3000);
      return;
    }
    onRemove(inst.id);
    onJourneyChange({ instances: removeInstance(journey.instances, index) });
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    onJourneyChange({ instances: moveInstance(journey.instances, index, direction) });
  };

  const startEditId = (inst: ComposerSceneInstance) => {
    setEditingId(inst.id);
    setIdDraft(inst.id);
    setIdError(null);
  };

  const commitEditId = (oldId: string) => {
    const err = validateSceneId(idDraft, existingIds, oldId);
    if (err) {
      setIdError(err);
      return;
    }
    const result = updateInstanceId(journey.instances, oldId, idDraft);
    if ("error" in result) {
      setIdError(result.error);
      return;
    }
    onJourneyChange({ instances: result });
    onRenameId(oldId, idDraft.trim());
    if (selectedSceneId === oldId) onSelectScene(idDraft.trim());
    setEditingId(null);
    setIdError(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded border border-zinc-700 bg-zinc-900 p-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Journey Editor
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Add, duplicate, reorder, and configure scene instances by ID.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddPicker((v) => !v)}
          className="rounded bg-amber-600 px-3 py-1.5 text-xs font-medium hover:bg-amber-500"
        >
          + Add Scene
        </button>
      </div>

      {showAddPicker && (
        <div className="rounded border border-amber-600/40 bg-zinc-900 p-3">
          <p className="mb-2 text-xs text-zinc-400">Choose scene type:</p>
          <div className="grid grid-cols-2 gap-1">
            {SCENE_ORDER.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleAddScene(type)}
                className="rounded border border-zinc-700 px-2 py-1.5 text-left text-xs text-zinc-300 hover:border-amber-600 hover:text-amber-300"
              >
                {SCENE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
      )}

      {removeWarning && (
        <p className="rounded border border-red-800 bg-red-950/50 px-3 py-2 text-xs text-red-300">
          {removeWarning}
        </p>
      )}

      <div className="space-y-1">
        {journey.instances.map((inst, index) => {
          const isSelected = selectedSceneId === inst.id;
          return (
            <div
              key={inst.id}
              className={`rounded border px-3 py-2 transition-colors ${
                isSelected
                  ? "border-amber-600/60 bg-amber-950/20"
                  : inst.enabled
                    ? "border-zinc-700 bg-zinc-900"
                    : "border-zinc-800 bg-zinc-950 opacity-60"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="mt-1 min-w-[18px] text-center text-xs text-zinc-600">
                  {index + 1}
                </span>

                <div
                  role="button"
                  tabIndex={0}
                  className="flex-1 min-w-0 cursor-pointer text-left"
                  onClick={() => onSelectScene(inst.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectScene(inst.id);
                    }
                  }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={inst.label}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => patchInstance(index, { label: e.target.value })}
                      className="max-w-[140px] rounded border border-transparent bg-transparent px-1 text-sm font-medium text-zinc-200 hover:border-zinc-600 focus:border-amber-600 focus:outline-none"
                    />
                    {inst.required && (
                      <span className="rounded bg-zinc-700 px-1.5 py-0.5 text-[10px] text-zinc-400">
                        required
                      </span>
                    )}
                    {!inst.enabled && (
                      <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">
                        disabled
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    {editingId === inst.id ? (
                      <div className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={idDraft}
                          onChange={(e) => {
                            setIdDraft(e.target.value);
                            setIdError(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitEditId(inst.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="rounded border border-amber-600 bg-zinc-950 px-2 py-0.5 font-mono text-xs text-amber-200"
                          dir="ltr"
                        />
                        {idError && (
                          <span className="text-[10px] text-red-400">{idError}</span>
                        )}
                        <button
                          type="button"
                          onClick={() => commitEditId(inst.id)}
                          className="text-[10px] text-amber-400 underline"
                        >
                          Save ID
                        </button>
                      </div>
                    ) : (
                      <>
                        <code className="text-[10px] text-zinc-500">{inst.id}</code>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditId(inst);
                          }}
                          className="text-[10px] text-zinc-600 underline hover:text-amber-400"
                        >
                          edit id
                        </button>
                        <span className="text-zinc-700">·</span>
                        <code className="text-[10px] text-zinc-600">{inst.type}</code>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    disabled={inst.required}
                    title={inst.enabled ? "Disable" : "Enable"}
                    onClick={() => patchInstance(index, { enabled: !inst.enabled })}
                    className={`h-5 w-9 rounded-full transition-colors ${
                      inst.required ? "cursor-not-allowed opacity-40" : ""
                    } ${inst.enabled ? "bg-amber-600" : "bg-zinc-700"}`}
                  >
                    <span
                      className={`block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                        inst.enabled ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1 pl-6">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, "up")}
                  className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 disabled:opacity-30"
                >
                  ↑ Up
                </button>
                <button
                  type="button"
                  disabled={index === journey.instances.length - 1}
                  onClick={() => handleMove(index, "down")}
                  className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800 disabled:opacity-30"
                >
                  ↓ Down
                </button>
                <button
                  type="button"
                  onClick={() => handleDuplicate(index)}
                  className="rounded border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-800"
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  disabled={inst.required}
                  onClick={() => handleRemove(index)}
                  className="rounded border border-red-900 px-2 py-0.5 text-[10px] text-red-400 hover:bg-red-950 disabled:opacity-30"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-500 space-y-1">
        <p>
          <span className="text-zinc-400">Duplicate</span> copies design, media, variant, and
          content into an independent instance with a new ID.
        </p>
        <p>
          Exports: <code className="text-amber-300">SequenceBlueprint</code> (journey),{" "}
          <code className="text-amber-300">DesignPreset</code> (visual),{" "}
          <code className="text-amber-300">InvitationData</code> (client).
        </p>
      </div>
    </div>
  );
}
