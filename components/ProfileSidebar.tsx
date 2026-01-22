'use client';

import { FormEvent, useRef, useState } from "react";
import { PlusCircle, Upload } from "lucide-react";
import { useMacroBotStore } from "@/lib/store";
import { uid } from "@/lib/utils";

export function ProfileSidebar() {
  const {
    profiles,
    selectedProfileId,
    selectProfile,
    addProfile,
    importProfile
  } = useMacroBotStore((state) => ({
    profiles: state.profiles,
    selectedProfileId: state.selectedProfileId,
    selectProfile: state.selectProfile,
    addProfile: state.addProfile,
    importProfile: state.importProfile
  }));
  const [showForm, setShowForm] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const specializationsRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const name = nameRef.current?.value.trim();
    const description = descriptionRef.current?.value.trim() ?? "";
    const specializations = specializationsRef.current?.value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean) ?? [];
    if (!name) return;
    addProfile({ name, description, specializations, aiMemory: [] });
    setShowForm(false);
    if (nameRef.current) nameRef.current.value = "";
    if (descriptionRef.current) descriptionRef.current.value = "";
    if (specializationsRef.current) specializationsRef.current.value = "";
  };

  const handleImport = async (event: FormEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed?.name && parsed?.macros) {
        importProfile({
          ...parsed,
          id: uid("profile"),
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }
    } catch (error) {
      console.error("Failed to import profile", error);
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <aside className="w-full sm:w-72 bg-slate-900/60 border-r border-slate-800 p-4 flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">AI Profily</h2>
          <button
            className="inline-flex items-center gap-1 rounded-md border border-slate-700 px-2 py-1 text-xs hover:bg-slate-800"
            onClick={() => setShowForm((prev) => !prev)}
          >
            <PlusCircle className="h-4 w-4" />
            Nový
          </button>
        </div>
        <div className="space-y-2">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => selectProfile(profile.id)}
              className={`w-full text-left rounded-lg border px-3 py-3 transition ${
                profile.id === selectedProfileId
                  ? "border-primary-500 bg-primary-500/10 text-primary-100"
                  : "border-slate-800 bg-slate-900/60 hover:border-primary-500/40"
              }`}
            >
              <p className="text-sm font-semibold">{profile.name}</p>
              <p className="text-xs text-slate-300 line-clamp-2">{profile.description}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {profile.specializations.slice(0, 3).map((spec) => (
                  <span
                    key={`${profile.id}-${spec}`}
                    className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-slate-800 bg-slate-900/80 p-3">
          <div>
            <label className="block text-xs font-medium text-slate-300">Názov profilu</label>
            <input
              ref={nameRef}
              type="text"
              required
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
              placeholder="Napr. YouTube Editor"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300">Popis</label>
            <textarea
              ref={descriptionRef}
              rows={2}
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
              placeholder="Čomu sa profil venuje"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300">Špecializácie (oddelené čiarkou)</label>
            <input
              ref={specializationsRef}
              type="text"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
              placeholder="CapCut, YouTube Studio, ..."
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-primary-500 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-400"
          >
            Uložiť profil
          </button>
        </form>
      )}

      <div className="mt-auto space-y-2">
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-primary-400 hover:text-primary-100">
          <Upload className="h-4 w-4" />
          Import profilu
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onInput={handleImport} />
        </label>
        <p className="text-[11px] text-slate-400">
          Profily sa ukladajú lokálne. Export nájdeš v detaile makra.
        </p>
      </div>
    </aside>
  );
}
