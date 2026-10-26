import { Link } from "@tanstack/react-router";

export function LogoMark({ className = "h-6 w-6" }: { className?: string }) {
  // A bridge arc whose pillars read as two raised fingers.
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <path d="M4 24c3-9 7-13 12-13s9 4 12 13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M11 24V8.5a1.8 1.8 0 0 1 3.6 0V15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M17.4 15V6.5a1.8 1.8 0 0 1 3.6 0V24" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2 text-foreground" aria-label="signbridge home">
      <LogoMark className="h-6 w-6 text-primary" />
      <span className="font-display text-lg font-bold tracking-tight">signbridge</span>
    </Link>
  );
}
