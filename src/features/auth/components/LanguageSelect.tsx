import { useState, useRef, useEffect } from "react";
import type { BackendLanguage } from "../data";

interface LanguageSelectProps {
  languages: BackendLanguage[];
}

export default function LanguageSelect({ languages }: LanguageSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<BackendLanguage | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Hidden native input for form submission */}
      <input type="hidden" name="language" value={selected?.name ?? ""} required />

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 bg-[rgba(11,16,32,0.6)] border border-[rgba(31,41,55,0.6)] rounded-lg text-white transition duration-200 font-[JetBrains_Mono,monospace] text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(255,77,0,0.6)] focus:border-[rgba(255,77,0,0.4)]"
      >
        <span className="flex items-center gap-3">
          {selected ? (
            <>
              <img src={selected.icon} alt={selected.name} width={20} height={20} />
              <span>{selected.name}</span>
            </>
          ) : (
            <span className="text-white/25">Selecciona un lenguaje</span>
          )}
        </span>
        <svg
          className={`w-4 h-4 text-white/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <ul className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto bg-[#141929] border border-[rgba(31,41,55,0.6)] rounded-lg shadow-xl shadow-black/30 scrollbar-thin">
          {languages.map((lang) => (
            <li key={lang.name}>
              <button
                type="button"
                onClick={() => {
                  setSelected(lang);
                  setOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-[JetBrains_Mono,monospace] transition duration-150 ${
                  selected?.name === lang.name
                    ? "bg-[rgba(255,77,0,0.15)] text-[#FF4D00]"
                    : "text-white hover:bg-white/5"
                }`}
              >
                <img src={lang.icon} alt={lang.name} width={20} height={20} />
                <span>{lang.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
