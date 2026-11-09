"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InvitationConfig, InvitationScene } from "@/types/invitation";
import { buildInvitationCssVars } from "@/lib/theme-vars";
import MusicGate from "./MusicGate";
import OpeningScene from "./scenes/OpeningScene";
import GuestLookupSheet from "@/components/rsvp/GuestLookupSheet";
import { PsdGoldFall } from "@/components/invitation/variants/psd-wedding-01/PsdGoldFall";
import type { InviteLinkContext } from "@/lib/rsvp-core";
import { SCENE_COMPONENTS } from "./scene-registry";

const AFTER_OPEN_SCROLL_ID = "psd-open-invite";

/**
 * A scene is visible when enabled !== false.
 * enabled is set at build time by buildInvitationConfig / buildInvitationConfigV2:
 *   - RSVP scenes get enabled=false when rsvp.enabled=false
 *   - SceneDefinition.enabledByDefault controls other scenes
 *   - data.sceneOverrides[id].enabled can override any scene
 * Using scene.enabled instead of a type-specific switch keeps the renderer
 * agnostic about event type and journey structure.
 */
function isSceneVisible(scene: InvitationScene): boolean {
  return scene.enabled !== false;
}

interface InvitationRendererProps {
  config: InvitationConfig;
  /** Raw invite token from ?t= — always passed when present in URL */
  inviteToken?: string | null;
  inviteLinkContext?: InviteLinkContext | null;
}

/**
 * InvitationRenderer — top-level engine.
 * Reads InvitationConfig and renders scenes in order.
 *
 * Flow:
 *  1. "opening" scene → full-screen gate until user taps.
 *  2. Tap → gate fades out, content fades in.
 *  3. rsvp/ticket_confirmation hidden when rsvp.enabled = false.
 */
export default function InvitationRenderer({
  config,
  inviteToken,
  inviteLinkContext,
}: InvitationRendererProps) {
  const { theme, layout, scenes } = config;

  // Find the opening scene — must be enabled to act as a gate
  const openingScene = scenes.find(
    (s) => s.type === "opening" && isSceneVisible(s)
  );
  const hasOpening = Boolean(openingScene);

  const [isOpened, setIsOpened] = useState(!hasOpening);
  const seamlessOpen = theme.family === "psd-wedding-01";

  useEffect(() => {
    if (!isOpened || !hasOpening || seamlessOpen) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(AFTER_OPEN_SCROLL_ID);
      target?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    }, 520);
    return () => window.clearTimeout(timer);
  }, [isOpened, hasOpening, seamlessOpen]);

  // All non-opening scenes that are enabled — renderer is agnostic about count/order
  const contentScenes = scenes.filter(
    (s) => s.type !== "opening" && isSceneVisible(s)
  );

  const cssVars = buildInvitationCssVars(theme);
  const bgColor = theme.backgroundColor;
  const textColor = theme.textColor ?? "var(--inv-text, #F5F0E8)";

  const renderScenes = () =>
    contentScenes.map((scene) => {
      const Component = SCENE_COMPONENTS[scene.type];
      if (!Component) return null;
      const rsvpProps =
        scene.type === "rsvp"
          ? {
              inviteToken: inviteToken ?? undefined,
              inviteLinkContext: inviteLinkContext ?? undefined,
              controlledMaxSeats:
                inviteLinkContext?.status === "active"
                  ? inviteLinkContext.maxSeats
                  : undefined,
              controlledLabel:
                inviteLinkContext?.status === "active"
                  ? (inviteLinkContext.label ?? undefined)
                  : undefined,
            }
          : {};
      return (
        <Component
          key={scene.id}
          scene={scene}
          config={config}
          {...rsvpProps}
        />
      );
    });

  return (
    <MusicGate config={config}>
      <div
        className="inv-root inv-scroll-container relative mx-auto w-full"
        style={{
          maxWidth: layout.mobileMaxWidth,
          minWidth: layout.minSupportedWidth,
          backgroundColor: bgColor,
          color: textColor,
          fontFamily: "var(--font-tajawal)",
          direction: config.direction,
          ...(seamlessOpen && !isOpened ? { height: "100dvh", overflow: "hidden" } : {}),
          ...cssVars,
        }}
      >
        {/* Opening gate. PSD hands off on the last frame with no fade or scroll. */}
        {seamlessOpen ? (
          !isOpened && openingScene && (
            <div
              className="absolute inset-0 z-50 overflow-hidden"
              style={{ backgroundColor: bgColor }}
            >
              <OpeningScene
                scene={openingScene}
                config={config}
                onOpen={() => setIsOpened(true)}
              />
            </div>
          )
        ) : (
          <AnimatePresence>
            {!isOpened && openingScene && (
              <motion.div
                key="opening-gate"
                className="absolute left-0 right-0 top-0 z-50 h-[100dvh] w-full overflow-hidden"
                style={{
                  backgroundColor: bgColor,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <OpeningScene
                  scene={openingScene}
                  config={config}
                  onOpen={() => setIsOpened(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {isOpened && config.theme.family === "psd-wedding-01" && <PsdGoldFall />}

        {/* PSD content sits under the video so the cut is the same picture. */}
        {(seamlessOpen || isOpened) && (
          seamlessOpen ? (
            <div className="pb-20">{renderScenes()}</div>
          ) : (
            <AnimatePresence>
              {isOpened && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.55, delay: 0.05, ease: "easeOut" }}
                  className="pb-20"
                >
                  {renderScenes()}
                </motion.div>
              )}
            </AnimatePresence>
          )
        )}

        {!isOpened && !seamlessOpen && <div style={{ minHeight: "100dvh" }} />}

        {(Boolean(config.music?.enabled && config.music.src) ||
          (isOpened && config.rsvp?.enabled)) && (
          <GuestLookupSheet
            slug={config.slug}
            primaryColor={theme.primaryColor}
            textColor={theme.textColor ?? "#F5F0E8"}
            showLookup={Boolean(isOpened && config.rsvp?.enabled)}
          />
        )}
      </div>
    </MusicGate>
  );
}
