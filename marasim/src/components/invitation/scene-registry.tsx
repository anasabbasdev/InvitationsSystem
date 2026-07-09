"use client";

import React from "react";
import type { SceneType } from "@/types/invitation";
import OpeningScene from "./scenes/OpeningScene";
import HeroNamesScene from "./scenes/HeroNamesScene";
import InvitationMessageScene from "./scenes/InvitationMessageScene";
import EventDetailsScene from "./scenes/EventDetailsScene";
import CountdownScene from "./scenes/CountdownScene";
import GalleryMediaScene from "./scenes/GalleryMediaScene";
import LocationScene from "./scenes/LocationScene";
import NotesScene from "./scenes/NotesScene";
import RSVPScene from "./scenes/RSVPScene";
import TicketConfirmationScene from "./scenes/TicketConfirmationScene";

export type SceneComponentProps = {
  scene: import("@/types/invitation").InvitationScene;
  config: import("@/types/invitation").InvitationConfig;
  onOpen?: () => void;
};

type SceneComponent = React.ComponentType<SceneComponentProps>;

export const SCENE_COMPONENTS: Partial<Record<SceneType, SceneComponent>> = {
  opening: OpeningScene,
  hero_names: HeroNamesScene,
  invitation_message: InvitationMessageScene,
  event_details: EventDetailsScene,
  countdown: CountdownScene,
  gallery_media: GalleryMediaScene,
  location: LocationScene,
  notes: NotesScene,
  rsvp: RSVPScene,
  ticket_confirmation: TicketConfirmationScene,
};

export function getSceneComponent(type: SceneType): SceneComponent | undefined {
  return SCENE_COMPONENTS[type];
}
