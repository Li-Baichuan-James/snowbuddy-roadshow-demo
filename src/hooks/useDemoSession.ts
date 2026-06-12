import { useEffect, useMemo, useState } from "react";
import { createInitialDemoState } from "../lib/demoData";
import { advanceDemoMembers } from "../lib/demoMotion";
import { getCurrentHudPayload } from "../lib/hud";
import type { AppPage, AppState, DemoMember, LocalParticipant } from "../types";

export type DemoSession = ReturnType<typeof useDemoSession>;

export function useDemoSession(participant: LocalParticipant | null, page: AppPage) {
  const [state, setState] = useState<AppState>(() => createInitialDemoState(participant?.displayName ?? "Alex"));
  const [feedback, setFeedback] = useState("Signal simulated");
  const [voicePlayed, setVoicePlayed] = useState(false);
  const [voiceHolding, setVoiceHolding] = useState(false);

  useEffect(() => {
    if (!participant) return;
    setState((current) => ({ ...current, participant, currentPage: page }));
  }, [participant, page]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setState((current) => {
        const now = Date.now();
        return {
          ...current,
          activeVoice: current.activeVoice && current.activeVoice.expiresAt > now ? current.activeVoice : null,
          members: advanceDemoMembers(current.members, Math.floor(now / 2500))
        };
      });
    }, 2500);

    return () => window.clearInterval(timer);
  }, []);

  const hud = useMemo(() => getCurrentHudPayload(state), [state]);

  function selectMember(memberId: string) {
    setState((current) => ({ ...current, selectedMemberId: memberId }));
    setFeedback("Tracking target updated");
  }

  function triggerMeet() {
    setState((current) => ({
      ...current,
      activeMeet: {
        id: `meet-${Date.now()}`,
        label: "MEET POINT",
        distanceMeters: 120,
        arrow: "→",
        mapX: 55,
        mapY: 46,
        createdAt: Date.now()
      }
    }));
    setFeedback("Meet point sent to team");
  }

  function clearMeet() {
    setState((current) => ({ ...current, activeMeet: null }));
    setFeedback("Meet point cleared");
  }

  function triggerSos(member: DemoMember | null) {
    const sender = member ?? state.members.find((candidate) => candidate.id === "james") ?? state.members[0];
    setState((current) => ({
      ...current,
      activeSos: {
        id: `sos-${Date.now()}`,
        senderName: sender.name,
        distanceMeters: sender.id === "james" ? 45 : Math.min(Math.max(sender.distanceMeters, 45), 90),
        arrow: sender.id === "james" ? "←" : sender.arrow,
        mapX: sender.mapX,
        mapY: sender.mapY,
        createdAt: Date.now()
      }
    }));
    setFeedback(`SOS from ${sender.name} is active`);
  }

  function resolveSos() {
    setState((current) => ({ ...current, activeSos: null }));
    setFeedback("SOS resolved");
  }

  function triggerVoice() {
    setVoicePlayed(false);
    setVoiceHolding(false);
    setState((current) => ({
      ...current,
      activeVoice: {
        id: `voice-${Date.now()}`,
        senderName: "Ava",
        messageLabel: "Regroup near the blue run.",
        createdAt: Date.now(),
        expiresAt: Date.now() + 5200
      }
    }));
    setFeedback("Voice from Ava");
  }

  function playVoice() {
    setVoicePlayed(true);
    setFeedback("Simulated voice played");
  }

  function startVoiceHold() {
    setVoiceHolding(true);
    setFeedback("Voice check live");
  }

  function endVoiceHold() {
    setVoiceHolding(false);
    setFeedback("Signal simulated");
  }

  return {
    state,
    hud,
    feedback,
    voicePlayed,
    voiceHolding,
    selectMember,
    triggerMeet,
    clearMeet,
    triggerSos,
    resolveSos,
    triggerVoice,
    playVoice,
    startVoiceHold,
    endVoiceHold
  };
}
