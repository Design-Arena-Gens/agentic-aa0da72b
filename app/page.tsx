'use client';

import { useEffect } from "react";
import { ProfileSidebar } from "@/components/ProfileSidebar";
import { MacroWorkspace } from "@/components/MacroWorkspace";
import { ChatDock } from "@/components/ChatDock";
import { useMacroBotStore } from "@/lib/store";

export default function HomePage() {
  const toggleChat = useMacroBotStore((state) => state.toggleChat);

  useEffect(() => {
    toggleChat(true);
  }, [toggleChat]);

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-primary-400">Macro Bot Ultimate</p>
            <h1 className="text-2xl font-semibold text-slate-100">Agentné štúdio pre tvorbu makier</h1>
          </div>
          <div className="text-right text-xs text-slate-400">
            <p>Multi-profilový AI tréning</p>
            <p>Screen recording • Audio poznámky • AI pamäť</p>
          </div>
        </div>
      </header>
      <div className="mx-auto flex w-full flex-1 max-w-7xl flex-col gap-0 sm:flex-row">
        <ProfileSidebar />
        <MacroWorkspace />
      </div>
      <ChatDock />
    </main>
  );
}
