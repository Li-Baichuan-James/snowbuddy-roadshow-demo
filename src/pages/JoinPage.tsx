import { useMemo, useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";

type JoinPageProps = {
  onJoin: (displayName: string) => void;
};

export function JoinPage({ onJoin }: JoinPageProps) {
  const [name, setName] = useState("Alex");
  const [error, setError] = useState("");
  const teamCode = useMemo(() => window.location.pathname.split("/").pop() || "DEMO", []);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = name.trim();
    if (!normalized) {
      setError("Enter a display name.");
      return;
    }
    onJoin(normalized);
  }

  return (
    <main className="join-screen">
      <section className="join-panel" aria-labelledby="join-title">
        <div className="brand-mark">
          <ShieldCheck size={24} aria-hidden="true" />
          <span>SnowBuddy</span>
        </div>

        <div className="join-hero-copy">
          <p className="demo-kicker">Simulated roadshow prototype</p>
          <h1 id="join-title">Smart goggle control for group skiing</h1>
          <p className="prototype-note">
            Join a local demo team and see how one phone cue becomes a low-distraction goggle HUD.
          </p>
        </div>

        <form className="join-form" onSubmit={submit}>
          <label>
            <span>Team Code</span>
            <input value={teamCode.toUpperCase()} readOnly aria-label="Team Code" />
          </label>
          <label>
            <span>Your Name</span>
            <input
              value={name}
              maxLength={20}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "join-error" : undefined}
            />
          </label>
          {error && <p id="join-error" className="form-error">{error}</p>}
          <button type="submit" className="primary-button join-button">
            Join Demo Team
            <ArrowRight size={19} aria-hidden="true" />
          </button>
        </form>

        <p className="join-footnote">No app download. No account. No GPS. No mic. No hardware required.</p>
      </section>
    </main>
  );
}
