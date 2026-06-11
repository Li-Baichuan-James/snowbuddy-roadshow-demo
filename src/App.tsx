import { useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { useCompassHeading } from "./hooks/useCompassHeading";
import { useDemoSession } from "./hooks/useDemoSession";
import { useLocalParticipant } from "./hooks/useLocalParticipant";
import { GogglePage } from "./pages/GogglePage";
import { HomePage } from "./pages/HomePage";
import { JoinPage } from "./pages/JoinPage";
import { MapPage } from "./pages/MapPage";
import type { AppPage } from "./types";

function getInitialPage(): AppPage {
  const path = window.location.pathname;
  if (path.includes("/app/map")) return "map";
  if (path.includes("/app/goggle")) return "goggle";
  return "home";
}

export default function App() {
  const { participant, join } = useLocalParticipant();
  const [page, setPage] = useState<AppPage>(getInitialPage);
  const [showJoin, setShowJoin] = useState(() => window.location.pathname.includes("/join/"));
  const session = useDemoSession(participant, page);
  const compass = useCompassHeading();

  function navigate(nextPage: AppPage) {
    setPage(nextPage);
    window.history.replaceState(null, "", `/app/${nextPage}`);
  }

  if (!participant || showJoin) {
    return <JoinPage onJoin={(name) => {
      join(name);
      setShowJoin(false);
      setPage("home");
      window.history.replaceState(null, "", "/app/home");
    }} />;
  }

  return (
    <div className="app-shell">
      <main className="screen">
        {page === "home" && <HomePage session={session} navigate={navigate} compass={compass} />}
        {page === "map" && <MapPage session={session} navigate={navigate} compass={compass} />}
        {page === "goggle" && <GogglePage session={session} compass={compass} />}
      </main>
      <BottomNav page={page} onNavigate={navigate} />
    </div>
  );
}
