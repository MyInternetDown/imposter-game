import React from "react";
import type { ReactNode } from "react";

export function Card({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_80px_rgba(0,0,0,0.22)] backdrop-blur">
      {eyebrow ? (
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neon">{eyebrow}</p>
      ) : null}
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function PrimaryButton({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-xl bg-neon px-5 py-3 font-semibold text-ink">
      {label}
    </span>
  );
}

export function SecondaryButton({ label }: { label: string }) {
  return (
    <span className="inline-flex rounded-xl border border-white/15 px-5 py-3 font-semibold text-white">
      {label}
    </span>
  );
}
