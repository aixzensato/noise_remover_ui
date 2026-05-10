import AudioUploader from "./components/AudioUploader";
import AudioPlayer from "./components/AudioPlayer";
import SettingsPanel from "./components/SettingsPanel";
import AnalysisPanel from "./components/AnalysisPanel";
import { useAudioProcessor } from "./hooks/useAudioProcessor";
import { Music2 } from "lucide-react";

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
    resetSettings,
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
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-12 h-12" />
            <span className="font-display text-xl font-semibold tracking-tight">
              FXR
            </span>
          </div>
          <a
            className="flex items-center gap-1"
            href="http://127.0.0.1:8000/api/health"
            target="_blank"
            rel="noreferrer"
          >
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-emerald-500"></span>
            </span>
            <h1 className="text-sm font-medium text-zinc-500 hover:text-zinc-300 ">
              Backend
            </h1>
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-12">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="font-display text-5xl font-semibold tracking-tight leading-[1.1]">
            Remove noise.
            <br />
            <span className="text-gradient">Keep the voice.</span>
          </h1>
          <p className="mt-3 font-medium text-lg text-zinc-500">
            Spectral subtraction engine — no ML required. Upload, tune,
            download.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-[1fr_300px] gap-4 items-start">
          {/* Main panel */}
          <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-6">
            <div className="flex gap-1 items-center text-zinc-500 mb-5">
              <Music2 size={20} />
              <h1 className="font-medium text-lg">Audio</h1>
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
            <SettingsPanel settings={settings} update={updateSetting} onReset={resetSettings} />
            <AnalysisPanel analysis={analysis} />
          </div>
        </div>
      </main>
    </div>
  );
}
