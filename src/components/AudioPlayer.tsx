import { type RefObject } from "react";

interface Props {
  file: File;
  originalUrl: string | null;
  enhancedUrl: string | null;
  outFormat: "wav" | "flac";
  busy: boolean;
  err: string | null;
  onClear: () => void;
  onEnhance: () => void;
  enhancedAudioRef: RefObject<HTMLAudioElement | null>;
}

export default function AudioPlayer({
  file,
  originalUrl,
  enhancedUrl,
  outFormat,
  busy,
  err,
  onClear,
  onEnhance,
  enhancedAudioRef,
}: Props) {
  return (
    <div className="space-y-4">
      {/* File header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
          <span className="text-sm font-semibold text-zinc-200 truncate">
            {file.name}
          </span>
          <span className="text-xs text-zinc-500 font-mono flex-shrink-0">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs text-zinc-400 border border-white/[0.07] rounded-lg px-2.5 py-1.5 hover:text-zinc-200 hover:bg-white/5 transition-colors flex-shrink-0"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
          Clear
        </button>
      </div>

      {/* Players */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-950/60 border border-white/[0.06] rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">
              Original
            </span>
          </div>
          <audio
            className="w-full h-8"
            controls
            src={originalUrl ?? undefined}
          />
        </div>

        <div className="bg-zinc-950/60 border border-white/[0.06] rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${enhancedUrl ? "bg-emerald-400" : "bg-zinc-600"}`}
            />
            <span className="font-mono text-[10px] tracking-widest uppercase text-zinc-500">
              Enhanced
            </span>
            {enhancedUrl && (
              <a
                className="ml-auto flex items-center gap-1 text-[10px] font-mono text-violet-400 hover:text-violet-300 transition-colors"
                href={enhancedUrl}
                download={`${file.name.replace(/\.[^/.]+$/, "")}_denoised.${outFormat}`}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download
              </a>
            )}
          </div>
          <audio
            ref={enhancedAudioRef}
            className="w-full h-8"
            controls
            src={enhancedUrl ?? undefined}
          />
        </div>
      </div>

      {/* Error */}
      {err && (
        <div className="flex items-start gap-2 bg-red-950/40 border border-red-900/30 rounded-xl px-3.5 py-3 text-sm text-red-300">
          <svg
            width="14"
            height="14"
            className="flex-shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {err}
        </div>
      )}

      {/* Enhance button */}
      <button
        disabled={busy}
        onClick={onEnhance}
        className={`w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
          busy
            ? "bg-zinc-800 text-zinc-400 border border-white/[0.06] cursor-not-allowed"
            : "bg-violet-600 hover:bg-violet-500 text-white hover:-translate-y-px hover:shadow-[0_0_20px_rgba(124,92,252,0.35)]"
        }`}
      >
        {busy ? (
          <>
            <span className="spinner" />
            Processing audio…
          </>
        ) : (
          <>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" />
            </svg>
            Enhance & Remove Noise
          </>
        )}
      </button>
    </div>
  );
}
