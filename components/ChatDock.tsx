'use client';

import { useCallback } from "react";
import { MessageCircle, SendHorizonal, X } from "lucide-react";
import { useMacroBotStore } from "@/lib/store";

function buildAssistantReply(input: string) {
  if (!input.trim()) return "Potrebujem viac detailov, aby som vedela pomôcť.";
  const examples = [
    "Skús špecifikovať, ktoré UI prvky má makro sledovať.",
    "Nezabudni pridať monitorovanie stavu počas čakania.",
    "Odporúčam pridať screenshot k tomuto kroku pre jasnú vizualizáciu.",
    "Zváž rozdelenie kroku na menšie sekcie, aby sa ľahšie upravoval."
  ];
  const example = examples[Math.floor(Math.random() * examples.length)];
  return `Rozumiem: ${input.trim()}. ${example}`;
}

export function ChatDock() {
  const { chat, toggleChat, updateChatDraft, pushChatMessage } = useMacroBotStore((state) => ({
    chat: state.chat,
    toggleChat: state.toggleChat,
    updateChatDraft: state.updateChatDraft,
    pushChatMessage: state.pushChatMessage
  }));

  const handleSend = useCallback(() => {
    const content = chat.draft.trim();
    if (!content) return;
    pushChatMessage({ role: "user", content });
    const response = buildAssistantReply(content);
    setTimeout(() => {
      pushChatMessage({ role: "assistant", content: response });
    }, 300);
  }, [chat.draft, pushChatMessage]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {chat.open && (
        <div className="mb-3 w-80 rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-100">AI Chat</p>
              <p className="text-xs text-slate-400">Diskutuj o makrách a postupoch</p>
            </div>
            <button onClick={() => toggleChat(false)} className="text-slate-400 hover:text-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="h-64 space-y-3 overflow-y-auto px-4 py-3 scrollbar-thin">
            {chat.messages.length === 0 && (
              <p className="text-xs text-slate-400">
                Začni konverzáciu: napr. "Ako môžem optimalizovať import súborov v CapCut?"
              </p>
            )}
            {chat.messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-lg border px-3 py-2 text-xs leading-relaxed ${
                  message.role === "user"
                    ? "border-primary-500/60 bg-primary-500/10 text-primary-100"
                    : "border-slate-800 bg-slate-900 text-slate-200"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 px-3 py-3">
            <textarea
              value={chat.draft}
              onChange={(event) => updateChatDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Napíš otázku alebo popíš problém..."
              className="h-20 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-primary-400 focus:outline-none"
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={handleSend}
                className="inline-flex items-center gap-1 rounded-md bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-400"
              >
                <SendHorizonal className="h-4 w-4" />
                Odoslať
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => toggleChat(true)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-400"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    </div>
  );
}
