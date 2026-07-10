"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InvitationConfig, InvitationScene } from "@/types/invitation";
import { buildInvitationCssVars } from "@/lib/theme-vars";
import MusicGate from "./MusicGate";
import OpeningScene from "./scenes/OpeningScene";
import GuestLookupSheet from "@/components/rsvp/GuestLookupSheet";
import type { InviteLinkContext } from "@/lib/rsvp-core";
import { SCENE_COMPONENTS } from "./scene-registry";

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

  // All non-opening scenes that are enabled — renderer is agnostic about count/order
  const contentScenes = scenes.filter(
    (s) => s.type !== "opening" && isSceneVisible(s)
  );

  const cssVars = buildInvitationCssVars(theme);
  const bgColor = theme.backgroundColor;
  const textColor = theme.textColor ?? "var(--inv-text, #F5F0E8)";

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
          ...cssVars,
        }}
      >
        {/* Opening gate — fixed overlay until tapped */}
        <AnimatePresence>
          {!isOpened && openingScene && (
            <motion.div
              key="opening-gate"
              className="fixed inset-0 z-50"
          style={{
            maxWidth: layout.mobileMaxWidth,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: bgColor,
          }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <OpeningScene
                scene={openingScene}
                config={config}
                onOpen={() => setIsOpened(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content — rendered after opening tap */}
        <AnimatePresence>
          {isOpened && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
              className="pb-20"
            >
              {contentScenes.map((scene) => {
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
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spacer prevents layout jump while opening gate is visible */}
        {!isOpened && <div style={{ minHeight: "100dvh" }} />}

        {config.rsvp?.enabled && isOpened && (
          <GuestLookupSheet
            slug={config.slug}
            primaryColor={theme.primaryColor}
            textColor={theme.textColor ?? "#F5F0E8"}
          />
        )}
      </div>
    </MusicGate>
  );
}
