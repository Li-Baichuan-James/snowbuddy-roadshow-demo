import { useEffect, useState } from "react";
import { loadParticipant, saveParticipant } from "../lib/storage";
import type { LocalParticipant } from "../types";

export function useLocalParticipant() {
  const [participant, setParticipant] = useState<LocalParticipant | null>(null);

  useEffect(() => {
    setParticipant(loadParticipant());
  }, []);

  function join(displayName: string) {
    const nextParticipant = saveParticipant(displayName);
    setParticipant(nextParticipant);
  }

  return { participant, join };
}
