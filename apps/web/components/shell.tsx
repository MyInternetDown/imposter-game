import Link from "next/link";
import type { ReactNode } from "react";

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.25em] text-neon">
            Imposter Game
          </Link>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">{subtitle}</p>
        </div>
        <nav className="flex gap-4 text-sm text-white/70">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/packs">Question Packs</Link>
          <Link href="/create-room">Create Room</Link>
          <Link href="/guest">Join as Guest</Link>
        </nav>
      </header>
      {children}
    </main>
  );
}
