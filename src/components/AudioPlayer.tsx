import {
  ArrowDownToLine,
  LoaderCircle,
  Mic,
  OctagonAlert,
  TrafficCone,
  X,
} from "lucide-react";
import { useRef, type RefObject } from "react";

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
  const originalAudioRef = useRef<HTMLAudioElement | null>(null);

  function pauseOtherAudio(source: "original" | "enhanced") {
    if (source === "original") {
      if (enhancedAudioRef.current && !enhancedAudioRef.current.paused) {
        enhancedAudioRef.current.pause();
      }
    } else {
      if (originalAudioRef.current && !originalAudioRef.current.paused) {
        originalAudioRef.current.pause();
      }
    }
  }

  function ProcessingBorder() {
    return (
      <>
        <style>{`
        @keyframes conic-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes conic-spin-rev {
          to { transform: rotate(-360deg); }
        }
        .proc-ring {
          position: absolute; inset: -2px;
          border-radius: 15px; pointer-events: none; overflow: hidden; z-index: 0;
        }
        .proc-ring::before {
          content: '';
          position: absolute; inset: -120%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg, #7c5cfc 50deg,
            #a78bfa 80deg, #38bdf8 130deg,
            transparent 180deg
          );
          animation: conic-spin 1.6s linear infinite;
        }
        .proc-ring::after {
          content: '';
          position: absolute; inset: 2px;
          border-radius: 13px; background: #0c0c10;
        }
        .proc-ring-2 {
          position: absolute; inset: -2px;
          border-radius: 15px; pointer-events: none; overflow: hidden; z-index: 0;
        }
        .proc-ring-2::before {
          content: '';
          position: absolute; inset: -120%;
          background: conic-gradient(
            from 180deg,
            transparent 0deg, #22d3a0 40deg,
            #818cf8 100deg, transparent 150deg
          );
          animation: conic-spin-rev 2.2s linear infinite;
          opacity: 0.45;
        }
        .proc-ring-2::after {
          content: '';
          position: absolute; inset: 2px;
          border-radius: 13px; background: transparent;
        }
      `}</style>
        <div className="proc-ring" />
        <div className="proc-ring-2" />
      </>
    );
  }

  return (
    <div className="space-y-4">
      {/* File header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <TrafficCone size={20} className="text-orange-600" />
          <span className="font-medium text-zinc-200 truncate">
            {file.name}
          </span>
          <span className="text-xs bg-white/20 px-1 rounded-md text-zinc-300">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center text-xs text-zinc-400 border border-white/10 rounded-lg px-2.5 py-1.5 hover:text-zinc-200 hover:bg-white/5"
        >
          <X size={16} />
          <p className="text-sm font-medium">Clear</p>
        </button>
      </div>

      {/* Players */}
      <div className="grid grid-rows-2 gap-4">
        <div className="bg-zinc-950/60 border border-white/[0.06] rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 animation-pulse rounded-full bg-blue-500" />
            <span className="text-sm font-semibold uppercase text-zinc-500">
              Original
            </span>
          </div>
          <audio
            ref={originalAudioRef}
            className="w-full h-8"
            controls
            src={originalUrl ?? undefined}
            onPlay={() => pauseOtherAudio("original")}
          />
        </div>

        <div className="bg-zinc-950/60 border border-white/[0.06] rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="relative flex size-3">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full ${enhancedUrl ? "bg-emerald-400" : "bg-none"}`}
              />
              <span
                className={`relative inline-flex size-3 rounded-full ${enhancedUrl ? "bg-emerald-400" : "bg-zinc-600"}`}
              />
            </span>
            <span className="text-sm font-semibold uppercase text-zinc-500">
              Enhanced
            </span>
            {enhancedUrl && (
              <a
                className="ml-auto flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                href={enhancedUrl}
                download={`${file.name.replace(/\.[^/.]+$/, "")}_denoised.${outFormat}`}
              >
                <ArrowDownToLine size={16} />
                <p className="font-medium text-sm">Download</p>
              </a>
            )}
          </div>
          <audio
            ref={enhancedAudioRef}
            className="w-full h-8"
            controls
            src={enhancedUrl ?? undefined}
            onPlay={() => pauseOtherAudio("enhanced")}
          />
        </div>
      </div>

      {/* Error */}
      {err && (
        <div className="flex items-start gap-2 bg-red-950/40 border border-red-900/30 rounded-xl px-3.5 py-3 text-sm text-red-300">
          <OctagonAlert size={20} />
          {err}
        </div>
      )}

      {/* Enhance button */}
      <div className="relative">
        {busy && <ProcessingBorder />}
        <button
          disabled={busy}
          onClick={onEnhance}
          className={[
            "relative z-10 w-full flex items-center justify-center gap-2.5 rounded-[13px] px-4 py-4 text-sm font-semibold transition-all duration-200",
            busy
              ? "bg-zinc-900 text-zinc-400 cursor-not-allowed"
              : "bg-violet-600 hover:bg-violet-500 text-white hover:-translate-y-px hover:shadow-[0_0_24px_rgba(124,92,252,0.4)]",
          ].join(" ")}
        >
          {busy ? (
            <>
              <LoaderCircle size={17} className="animate-spin" />
              Processing audio…
            </>
          ) : (
            <>
              <Mic size={17} />
              Enhance & Remove Noise
            </>
          )}
        </button>
      </div>
    </div>
  );
}
