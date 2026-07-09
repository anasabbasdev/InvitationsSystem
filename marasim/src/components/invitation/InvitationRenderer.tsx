"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InvitationConfig, InvitationScene } from "@/types/invitation";
import { buildInvitationCssVars } from "@/lib/theme-vars";
import MusicGate from "./MusicGate";
import OpeningScene from "./scenes/OpeningScene";
import { SCENE_COMPONENTS } from "./scene-registry";

function shouldShowScene(scene: InvitationScene, rsvpEnabled: boolean): boolean {
  // Hide the RSVP form when RSVP is disabled.
  // ticket_confirmation always shows — it adapts its message based on rsvp.enabled
  // ("نراكم قريباً" when no RSVP, "شكراً لتفاعلكم" when RSVP enabled).
  if (!rsvpEnabled && scene.type === "rsvp") {
    return false;
  }
  return true;
}

interface InvitationRendererProps {
  config: InvitationConfig;
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
export default function InvitationRenderer({ config }: InvitationRendererProps) {
  const { theme, layout, rsvp, scenes } = config;

  const openingScene = scenes.find((s) => s.type === "opening");
  const hasOpening = Boolean(openingScene);

  const [isOpened, setIsOpened] = useState(!hasOpening);

  const contentScenes = scenes.filter(
    (s) => s.type !== "opening" && shouldShowScene(s, rsvp.enabled)
  );

  const cssVars = buildInvitationCssVars(theme);

  return (
    <MusicGate config={config}>
      <div
        className="inv-root inv-scroll-container relative mx-auto w-full"
        style={{
          maxWidth: layout.mobileMaxWidth,
          minWidth: layout.minSupportedWidth,
          backgroundColor: theme.backgroundColor,
          color: theme.textColor ?? "#F5F0E8",
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
                backgroundColor: theme.backgroundColor,
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
            >
              {contentScenes.map((scene) => {
                const Component = SCENE_COMPONENTS[scene.type];
                if (!Component) return null;
                return <Component key={scene.id} scene={scene} config={config} />;
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Spacer prevents layout jump while opening gate is visible */}
        {!isOpened && <div style={{ minHeight: "100dvh" }} />}
      </div>
    </MusicGate>
  );
}
