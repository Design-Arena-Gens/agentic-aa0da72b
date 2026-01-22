'use client';

import { FormEvent, useMemo, useRef, useState } from "react";
import {
  BrainCircuit,
  Download,
  FileVideo,
  Focus,
  FolderPlus,
  Sparkles,
  Target,
  Trash2,
  Wand2
} from "lucide-react";
import { useMacroBotStore } from "@/lib/store";
import type { AIProfile, Macro, MacroStep } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import { ScreenRecorder } from "./ScreenRecorder";
import { AudioRecorder } from "./AudioRecorder";
import { ScreenControlPanel } from "./ScreenControlPanel";

function StepCreationForm({ macro }: { macro: Macro }) {
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const addStep = useMacroBotStore((state) => state.addStep);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (saving) return;
    const name = nameRef.current?.value.trim();
    const description = descriptionRef.current?.value.trim() ?? "";
    if (!name) return;
    setSaving(true);
    addStep(macro.id, {
      name,
      description,
      user_explanation: "",
      user_tips: [],
      user_wait_conditions: ""
    });
    if (nameRef.current) nameRef.current.value = "";
    if (descriptionRef.current) descriptionRef.current.value = "";
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
        <FolderPlus className="h-4 w-4" />
        Pridať krok makra
      </h3>
      <div className="mt-3 grid gap-3">
        <div>
          <label className="block text-xs text-slate-300">Názov kroku</label>
          <input
            ref={nameRef}
            type="text"
            placeholder="Napr. Otvor CapCut"
            required
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-300">Základný popis</label>
          <textarea
            ref={descriptionRef}
            placeholder="Stručne popíš čo krok robí"
            rows={2}
            className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={saving}
        className="mt-4 w-full rounded-md bg-primary-500 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-400 disabled:opacity-60"
      >
        Uložiť krok
      </button>
    </form>
  );
}

function StepNotesEditor({ step }: { step: MacroStep }) {
  const updateStep = useMacroBotStore((state) => state.updateStep);
  const generateStepAI = useMacroBotStore((state) => state.generateStepAI);
  const [tipDraft, setTipDraft] = useState("");

  const handleTips = () => {
    if (!tipDraft.trim()) return;
    updateStep(step.id, {
      user_tips: [...step.user_tips, tipDraft.trim()]
    });
    setTipDraft("");
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-300">Môj popis kroku</label>
        <textarea
          value={step.user_explanation}
          onChange={(event) => updateStep(step.id, { user_explanation: event.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-primary-400 focus:outline-none"
          rows={3}
          placeholder="Prečo robím tento krok..."
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-300">Čo sledujem</label>
        <textarea
          value={step.user_wait_conditions}
          onChange={(event) => updateStep(step.id, { user_wait_conditions: event.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-primary-400 focus:outline-none"
          rows={2}
          placeholder="Napr. čakám na načítanie progress baru"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-300">Moje tipy a poznámky</label>
        <div className="mt-2 flex gap-2">
          <input
            value={tipDraft}
            onChange={(event) => setTipDraft(event.target.value)}
            className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
            placeholder="Pridaj tip"
          />
          <button
            type="button"
            onClick={handleTips}
            className="rounded-md bg-primary-500 px-3 py-2 text-xs font-semibold text-white hover:bg-primary-400"
          >
            Pridať
          </button>
        </div>
        {step.user_tips.length > 0 && (
          <ul className="mt-3 space-y-2 text-xs text-slate-200">
            {step.user_tips.map((tip, index) => (
              <li key={`${step.id}-${index}`} className="flex items-start justify-between gap-2 rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2">
                <span className="flex-1">{tip}</span>
                <button
                  className="text-slate-500 hover:text-red-400"
                  onClick={() =>
                    updateStep(step.id, {
                      user_tips: step.user_tips.filter((_, idx) => idx !== index)
                    })
                  }
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-100">AI vysvetlenie</p>
            <p className="text-xs text-slate-400">
              AI analyzuje popis a navrhne vylepšenia vrátane naučených vzorcov.
            </p>
          </div>
          <button
            type="button"
            onClick={() => generateStepAI(step.id)}
            className="inline-flex items-center gap-1 rounded-md bg-primary-500/80 px-3 py-1 text-xs font-semibold text-white hover:bg-primary-400"
          >
            <Wand2 className="h-4 w-4" />
            Analyzovať
          </button>
        </div>
        {step.ai_enhanced_explanation ? (
          <div className="mt-3 rounded-lg border border-primary-500/40 bg-primary-500/5 p-3 text-xs leading-relaxed text-primary-100">
            {step.ai_enhanced_explanation}
            {step.ai_learned_patterns.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold uppercase tracking-wide text-[10px] text-primary-200">Naučené vzorce</p>
                <ul className="mt-1 space-y-1 text-[11px] text-primary-100">
                  {step.ai_learned_patterns.map((pattern) => (
                    <li key={`${step.id}-pattern-${pattern}`}>• {pattern}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-3 text-xs text-slate-400">Zatiaľ neexistuje AI vysvetlenie pre tento krok.</p>
        )}
      </div>
    </div>
  );
}

function StepMediaPanel({ step }: { step: MacroStep }) {
  const updateStep = useMacroBotStore((state) => state.updateStep);

  return (
    <div className="space-y-5">
      <ScreenRecorder
        onFramesCaptured={(frames) =>
          updateStep(step.id, {
            screenshots: [...step.screenshots, ...frames]
          })
        }
      />
      <AudioRecorder
        onAudioCaptured={(note) =>
          updateStep(step.id, {
            audio_notes: [...step.audio_notes, note]
          })
        }
      />
      {step.screenshots.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <FileVideo className="h-4 w-4" />
            Zachytené snímky ({step.screenshots.length})
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {step.screenshots.map((frame) => (
              <div key={frame.id} className="overflow-hidden rounded-md border border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={frame.dataUrl} alt="screenshot" className="h-24 w-full object-cover" />
                <p className="px-2 py-1 text-[10px] text-slate-400">{new Date(frame.timestamp).toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {step.audio_notes.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <Target className="h-4 w-4" />
            Audio poznámky
          </div>
          <div className="mt-3 space-y-2">
            {step.audio_notes.map((note) => (
              <div key={note.id} className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs">
                <span>{Math.round(note.duration / 1000)} s</span>
                <audio controls src={note.blobUrl} className="h-6" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StepDetail({ profile, macro, step }: { profile: AIProfile; macro: Macro; step: MacroStep }) {
  const deleteStep = useMacroBotStore((state) => state.deleteStep);

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{step.name}</h3>
          <p className="text-xs text-slate-400">{step.description}</p>
          <p className="mt-1 text-[11px] text-slate-500">Vytvorené {formatTimestamp(step.createdAt)}</p>
        </div>
        <button
          onClick={() => deleteStep(step.id)}
          className="rounded-md border border-red-500/40 px-2 py-1 text-xs text-red-300 hover:bg-red-500/10"
        >
          <Trash2 className="mr-1 inline h-3.5 w-3.5" />
          Odstrániť
        </button>
      </div>
      <StepNotesEditor step={step} />
      <StepMediaPanel step={step} />
      <ScreenControlPanel step={step} />
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300">
        <p>
          Naučené vzorce sa ukladajú do AI pamäti profilu <span className="text-primary-200">{profile.name}</span> a budú dostupné v ďalších makrách.
        </p>
      </div>
    </div>
  );
}

function AISuggestionsPanel({ profile }: { profile: AIProfile }) {
  const suggestions = useMemo(() => {
    const bases = profile.aiMemory.slice(-5);
    if (bases.length === 0) {
      return [
        "Zachyť postup nahrávania videa vrátane kontroly titulkov.",
        "Pridaj makro na analýzu komentárov pomocou OCR a sentimentu."
      ];
    }
    return bases.map((memory, index) => `Makro nápad ${index + 1}: Rozšír techniku \"${memory}\" o automatické testovanie výsledku.`);
  }, [profile.aiMemory]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
        <Sparkles className="h-4 w-4 text-primary-300" />
        AI návrhy makier
      </div>
      <ul className="mt-3 space-y-2 text-xs text-slate-300">
        {suggestions.map((suggestion, index) => (
          <li key={`${profile.id}-suggestion-${index}`} className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 leading-relaxed">
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MacroHeader({ profile, macro }: { profile: AIProfile; macro: Macro }) {
  const synthesizeMacro = useMacroBotStore((state) => state.synthesizeMacro);
  const exportMacro = useMacroBotStore((state) => state.exportMacro);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-100">{macro.name}</h2>
        <p className="text-sm text-slate-400">Kategória: {macro.category}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => synthesizeMacro(macro.id)}
          className="inline-flex items-center gap-2 rounded-md border border-primary-500 px-3 py-2 text-xs font-semibold text-primary-100 hover:bg-primary-500/10"
        >
          <BrainCircuit className="h-4 w-4" />
          AI analýza makra
        </button>
        <button
          onClick={() => exportMacro(profile.id, macro.id)}
          className="inline-flex items-center gap-2 rounded-md border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-800"
        >
          <Download className="h-4 w-4" />
          Export JSON + media
        </button>
      </div>
      {(macro.aiSummary || macro.aiImprovementTips) && (
        <div className="mt-3 w-full rounded-xl border border-primary-500/40 bg-primary-500/5 p-4 text-sm text-primary-100">
          {macro.aiSummary && <p className="font-semibold">{macro.aiSummary}</p>}
          {macro.aiImprovementTips && (
            <ul className="mt-2 space-y-1 text-xs">
              {macro.aiImprovementTips.map((tip) => (
                <li key={`${macro.id}-tip-${tip}`}>• {tip}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export function MacroWorkspace() {
  const { profiles, selectedProfileId, selectedMacroId, selectMacro, selectedStepId, selectStep } =
    useMacroBotStore((state) => ({
      profiles: state.profiles,
      selectedProfileId: state.selectedProfileId,
      selectedMacroId: state.selectedMacroId,
      selectMacro: state.selectMacro,
      selectedStepId: state.selectedStepId,
      selectStep: state.selectStep
    }));
  const [macroDraft, setMacroDraft] = useState({ name: "", category: "" });
  const addMacro = useMacroBotStore((state) => state.addMacro);
  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedProfileId),
    [profiles, selectedProfileId]
  );

  const selectedMacro = useMemo(
    () => selectedProfile?.macros.find((macro) => macro.id === selectedMacroId),
    [selectedProfile, selectedMacroId]
  );

  const selectedStep = useMemo(
    () => selectedMacro?.steps.find((step) => step.id === selectedStepId),
    [selectedMacro, selectedStepId]
  );

  const handleMacroSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedProfile || !macroDraft.name.trim()) return;
    addMacro(selectedProfile.id, {
      name: macroDraft.name,
      category: macroDraft.category || "Všeobecné"
    });
    setMacroDraft({ name: "", category: "" });
  };

  if (!selectedProfile) {
    return (
      <div className="flex-1 p-8">
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center">
          <p className="text-sm text-slate-400">
            Vyber profil alebo vytvor nový pre začiatok práce s makrami.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Aktívny profil</p>
            <h1 className="text-2xl font-semibold text-slate-100">{selectedProfile.name}</h1>
            <p className="text-sm text-slate-400">{selectedProfile.description}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="h-4 w-4 text-primary-300" />
            AI pamäť: {selectedProfile.aiMemory.length} záznamov
          </div>
        </div>
        {selectedProfile.aiMemory.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
            {selectedProfile.aiMemory.slice(-6).map((memory) => (
              <span
                key={`${selectedProfile.id}-memory-${memory}`}
                className="rounded-full bg-slate-800 px-3 py-1"
              >
                {memory}
              </span>
            ))}
          </div>
        )}
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_2fr_2fr]">
        <div className="space-y-4">
          <form onSubmit={handleMacroSubmit} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
              <Focus className="h-4 w-4" />
              Nové makro pre profil
            </h3>
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-xs text-slate-300">Názov makra</label>
                <input
                  value={macroDraft.name}
                  onChange={(event) => setMacroDraft((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
                  placeholder="Úprava videa v CapCut"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300">Kategória</label>
                <input
                  value={macroDraft.category}
                  onChange={(event) => setMacroDraft((prev) => ({ ...prev, category: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
                  placeholder="Video, Analýza, ..."
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-primary-500 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-400"
            >
              Pridať makro
            </button>
          </form>

          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <h3 className="text-sm font-semibold text-slate-100">Makrá profilu</h3>
            <div className="space-y-2">
              {selectedProfile.macros.length === 0 && (
                <p className="text-xs text-slate-400">Zatiaľ neboli vytvorené žiadne makrá.</p>
              )}
              {selectedProfile.macros.map((macro) => (
                <button
                  key={macro.id}
                  onClick={() => selectMacro(macro.id)}
                  className={`w-full rounded-lg border px-3 py-3 text-left text-sm transition ${
                    macro.id === selectedMacroId
                      ? "border-primary-500 bg-primary-500/10 text-primary-100"
                      : "border-slate-800 bg-slate-900/40 hover:border-primary-400/40"
                  }`}
                >
                  <p className="font-semibold">{macro.name}</p>
                  <p className="text-xs text-slate-400">{macro.category}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{macro.steps.length} krokov</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {selectedMacro ? (
            <>
              <MacroHeader profile={selectedProfile} macro={selectedMacro} />
              <StepCreationForm macro={selectedMacro} />
              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <h3 className="text-sm font-semibold text-slate-100">Kroky makra</h3>
                <div className="space-y-2">
                  {selectedMacro.steps.length === 0 && (
                    <p className="text-xs text-slate-400">Pridaj prvý krok pre toto makro.</p>
                  )}
                  {selectedMacro.steps.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => selectStep(step.id)}
                      className={`w-full rounded-lg border px-3 py-3 text-left text-sm transition ${
                        step.id === selectedStepId
                          ? "border-primary-500 bg-primary-500/10 text-primary-100"
                          : "border-slate-800 bg-slate-900/40 hover:border-primary-400/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{step.name}</p>
                        <span className="text-[11px] text-slate-400">{step.screenshots.length} snímok</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">{step.user_explanation || step.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center text-sm text-slate-400">
              Vyber makro alebo vytvor nové.
            </div>
          )}
        </div>

        <div className="space-y-4">
          {selectedMacro && selectedStep ? (
            <StepDetail profile={selectedProfile} macro={selectedMacro} step={selectedStep} />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center text-sm text-slate-400">
              Vyber krok makra pre jeho detail.
            </div>
          )}
          <AISuggestionsPanel profile={selectedProfile} />
        </div>
      </section>
    </div>
  );
}
