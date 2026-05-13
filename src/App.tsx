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
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-9 h-9" />
            <h1 className="text-xl font-semibold">FXR</h1>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
        {/* Hero */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-4xl sm:text-4xl lg:text-6xl font-medium tracking-tighter">
            Remove noise.
            <br />
            <span className="text-gradient">Keep the voice.</span>
          </h1>
          <p className="mt-3 font-medium text-sm sm:text-base lg:text-lg text-zinc-500 max-w-2xl">
            Upload your audio and let FXR do the rest. Perfect for cleaning up
            podcasts, interviews, voiceovers, and more.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px] gap-4 lg:gap-5 items-start">
          {/* Main panel */}
          <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-4 sm:p-5 lg:p-6">
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
            <SettingsPanel
              settings={settings}
              update={updateSetting}
              onReset={resetSettings}
            />
            <AnalysisPanel analysis={analysis} />
          </div>
        </div>
      </main>
    </div>
  );
}
