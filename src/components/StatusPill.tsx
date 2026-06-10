type StatusPillProps = {
  tone?: "default" | "primary" | "meet" | "sos" | "success";
  children: React.ReactNode;
};

export function StatusPill({ tone = "default", children }: StatusPillProps) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}
