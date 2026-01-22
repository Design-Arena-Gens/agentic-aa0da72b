'use client';

import { useMemo, useState } from "react";
import { Eye, Keyboard, MousePointerClick } from "lucide-react";
import type { MacroStep } from "@/lib/types";

const ICON_LIBRARY = [
  { id: "capcut", label: "CapCut", keywords: ["video", "edit", "logo"] },
  { id: "edge", label: "Microsoft Edge", keywords: ["browser", "blue", "e"] },
  { id: "chrome", label: "Google Chrome", keywords: ["browser", "multi-color", "round"] },
  { id: "youtube", label: "YouTube", keywords: ["red", "play", "video"] }
];

export function ScreenControlPanel({ step }: { step: MacroStep }) {
  const [targetIcon, setTargetIcon] = useState(ICON_LIBRARY[0].id);
  const [typedText, setTypedText] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);

  const iconDetail = useMemo(
    () => ICON_LIBRARY.find((icon) => icon.id === targetIcon),
    [targetIcon]
  );

  const runAnalysis = () => {
    if (!iconDetail) return;
    const cues = [
      `Vyhľadaj ikonu podľa kľúčových slov: ${iconDetail.keywords.join(", ")}.`,
      "Použi OCR na overenie textového popisu v okolí ikony.",
      typedText ? `Priprav vstup textu do poľa: \"${typedText}\".` : "Pridaj textový vstup podľa potreby.",
      step.user_wait_conditions
        ? `Po kliknutí sleduj: ${step.user_wait_conditions}.`
        : "Pridaj monitorovanie priebehu po aktivácii aplikácie."
    ];
    setAnalysis(cues.join("\n"));
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-200">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
        <MousePointerClick className="h-4 w-4" />
        AI ovládanie obrazovky
      </div>
      <div className="mt-3 space-y-3">
        <div>
          <label className="block text-[11px] font-medium text-slate-400">Hľadaná ikona</label>
          <select
            value={targetIcon}
            onChange={(event) => setTargetIcon(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs focus:border-primary-400 focus:outline-none"
          >
            {ICON_LIBRARY.map((icon) => (
              <option key={icon.id} value={icon.id}>
                {icon.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-medium text-slate-400">Text, ktorý má AI napísať</label>
          <div className="flex items-center gap-2">
            <Keyboard className="h-3.5 w-3.5 text-slate-500" />
            <input
              value={typedText}
              onChange={(event) => setTypedText(event.target.value)}
              className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-xs focus:border-primary-400 focus:outline-none"
              placeholder="Napr. prihlasovacie údaje"
            />
          </div>
        </div>
        <button
          onClick={runAnalysis}
          className="w-full rounded-md border border-primary-500 px-3 py-2 text-xs font-semibold text-primary-100 hover:bg-primary-500/10"
        >
          Simulovať krok
        </button>
        {analysis && (
          <div className="rounded-lg border border-primary-500/30 bg-primary-500/5 p-3 text-left text-xs text-primary-100">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Eye className="h-4 w-4" />
              Postup AI
            </p>
            <pre className="mt-2 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
{analysis}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
