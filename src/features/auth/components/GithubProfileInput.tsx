import { useState, useRef, useCallback, useEffect } from "react";

type Status = "idle" | "loading" | "valid" | "invalid";

export default function GithubProfileInput() {
  const [status, setStatus] = useState<Status>("idle");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const extractUsername = (input: string): string | null => {
    const trimmed = input.trim();
    // Match github.com/username URL patterns
    const urlMatch = trimmed.match(
      /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)(?:\/.*)?$/
    );
    if (urlMatch) return urlMatch[1];
    // If it looks like a plain username (no slashes, no spaces)
    if (/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(trimmed)) return trimmed;
    return null;
  };

  const checkProfile = useCallback(async (value: string) => {
    const user = extractUsername(value);
    if (!user) {
      setStatus("idle");
      setAvatarUrl("");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(`https://api.github.com/users/${user}`);
      if (res.ok) {
        const data = await res.json();
        setStatus("valid");
        setAvatarUrl(data.avatar_url);
        setUsername(user);
      } else {
        setStatus("invalid");
        setAvatarUrl("");
      }
    } catch {
      setStatus("invalid");
      setAvatarUrl("");
    }
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("github-status", { detail: status })
    );
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (!value.trim()) {
      setStatus("idle");
      setAvatarUrl("");
      return;
    }

    timerRef.current = setTimeout(() => checkProfile(value), 600);
  };

  const borderClass =
    status === "valid"
      ? "border-green-500/60 focus:ring-green-500/60 focus:border-green-500/40"
      : status === "invalid"
        ? "border-red-500/60 focus:ring-red-500/60 focus:border-red-500/40"
        : "border-[rgba(31,41,55,0.6)] focus:ring-[rgba(255,77,0,0.6)] focus:border-[rgba(255,77,0,0.4)]";

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          id="github"
          name="github"
          required
          placeholder="username o https://github.com/username"
          onChange={handleChange}
          className={`block w-full px-4 py-3 pr-12 bg-[rgba(11,16,32,0.6)] border rounded-lg text-white placeholder-white/25 focus:outline-none focus:ring-2 transition duration-200 font-[JetBrains_Mono,monospace] text-sm ${borderClass}`}
        />
        {/* Status indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {status === "loading" && (
            <svg className="w-5 h-5 text-white/40 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {status === "valid" && (
            <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {status === "invalid" && (
            <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
      </div>

      {/* Feedback message */}
      {status === "valid" && (
        <div className="flex items-center gap-3 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
          <img
            src={avatarUrl}
            alt={username}
            className="w-8 h-8 rounded-full border border-green-500/30"
          />
          <span className="text-green-400 text-xs font-[JetBrains_Mono,monospace]">
            <span className="text-green-500/60">{"// "}</span>
            Perfil encontrado: <span className="text-green-300 font-bold">@{username}</span>
          </span>
        </div>
      )}
      {status === "invalid" && (
        <p className="text-red-400 text-xs font-[JetBrains_Mono,monospace] px-1">
          <span className="text-red-500/60">{"// "}</span>
          Perfil no encontrado. Verifica el nombre de usuario.
        </p>
      )}
    </div>
  );
}
