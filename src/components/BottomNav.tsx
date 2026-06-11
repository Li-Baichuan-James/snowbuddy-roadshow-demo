import { Home, Map, ScanLine } from "lucide-react";
import type { AppPage } from "../types";

type BottomNavProps = {
  page: AppPage;
  onNavigate: (page: AppPage) => void;
};

const items = [
  { id: "home" as const, label: "Home", ariaLabel: "Home control hub", icon: Home },
  { id: "map" as const, label: "Map", ariaLabel: "Team positions map", icon: Map },
  { id: "goggle" as const, label: "Goggle", ariaLabel: "Goggle preview", icon: ScanLine }
];

export function BottomNav({ page, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            className={page === item.id ? "nav-item active" : "nav-item"}
            onClick={() => onNavigate(item.id)}
            aria-current={page === item.id ? "page" : undefined}
            aria-label={item.ariaLabel}
          >
            <Icon size={20} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
