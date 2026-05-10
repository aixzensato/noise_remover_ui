import AudioUploader from "./components/AudioUploader";
import AudioPlayer from "./components/AudioPlayer";
import SettingsPanel from "./components/SettingsPanel";
import AnalysisPanel from "./components/AnalysisPanel";
import { useAudioProcessor } from "./hooks/useAudioProcessor";

export default function App() {
  const {
    file,
    originalUrl,
    enhancedUrl,
    busy,
    err,
    analysis,
    settings,
    updateSetting,
    pickFile,
    enhance,
    enhancedAudioRef,
  } = useAudioProcessor();

  return (
    <div className="relative min-h-full bg-zinc-950 text-zinc-50">
      {/* Background grid */}
      <div
        className="bg-grid pointer-events-none fixed inset-0 z-0"
        aria-hidden
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-violet-400">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M3 12h4l3-9 4 18 3-9h4" />
              </svg>
            </div>
            <span className="font-display text-[17px] font-bold tracking-tight">
              NoiseOut
            </span>
            <span className="font-mono text-[9px] tracking-widest text-violet-400 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded">
              STUDIO
            </span>
          </div>
          <a
            className="flex items-center gap-1.5 font-mono text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            href="http://127.0.0.1:8000/api/health"
            target="_blank"
            rel="noreferrer"
          >
            <span className="health-dot w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            Backend
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="font-display text-5xl font-extrabold tracking-tight leading-[1.1]">
            Remove noise.
            <br />
            <span className="text-gradient">Keep the voice.</span>
          </h1>
          <p className="mt-3 font-mono text-xs text-zinc-500 tracking-wide">
            Spectral subtraction engine — no ML required. Upload, tune,
            download.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-[1fr_300px] gap-4 items-start">
          {/* Main panel */}
          <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-5">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
              Audio
            </div>

            {!file ? (
              <AudioUploader onFile={pickFile} />
            ) : (
              <AudioPlayer
                file={file}
                originalUrl={originalUrl}
                enhancedUrl={enhancedUrl}
                outFormat={settings.outFormat}
                busy={busy}
                err={err}
                onClear={() => pickFile(null)}
                onEnhance={enhance}
                enhancedAudioRef={enhancedAudioRef}
              />
            )}
          </div>

          {/* Side panels */}
          <div className="flex flex-col gap-4">
            <SettingsPanel settings={settings} update={updateSetting} />
            <AnalysisPanel analysis={analysis} />
          </div>
        </div>
      </main>
    </div>
  );
}
