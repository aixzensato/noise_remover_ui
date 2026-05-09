import { useMemo, useRef, useState } from 'react'

type AnalyzeResponse = {
  sr: number
  channels: number
  duration_sec: number
  rms: number
  peak: number
  hf_ratio: number
  suggested?: {
    strength: number
    residual_gate: number
    hf_boost_db: number
    noise_percentile: number
  }
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [originalUrl, setOriginalUrl] = useState<string | null>(null)
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null)

  const [strength, setStrength] = useState(0.92)
  const [residualGate, setResidualGate] = useState(0.55)
  const [hfBoostDb, setHfBoostDb] = useState(10)
  const [noisePercentile, setNoisePercentile] = useState(12)
  const [outFormat, setOutFormat] = useState<'wav' | 'flac'>('wav')

  const enhancedAudioRef = useRef<HTMLAudioElement | null>(null)

  const apiBase = useMemo(() => {
    // change if you host backend elsewhere
    return 'http://127.0.0.1:8000'
  }, [])

  async function onPickFile(f: File | null) {
    setErr(null)
    setAnalysis(null)
    setEnhancedUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setFile(f)
    setOriginalUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return f ? URL.createObjectURL(f) : null
    })

    if (!f) return

    // auto analyze + suggest settings
    try {
      const fd = new FormData()
      fd.append('file', f)
      const res = await fetch(`${apiBase}/api/analyze`, { method: 'POST', body: fd })
      const j = (await res.json()) as AnalyzeResponse | { error: string }
      if (!res.ok || 'error' in j) throw new Error('error' in j ? j.error : `Analyze failed: ${res.status}`)
      setAnalysis(j)
      if (j.suggested) {
        setStrength(clamp(j.suggested.strength, 0, 1))
        setResidualGate(clamp(j.suggested.residual_gate, 0, 1))
        setHfBoostDb(clamp(j.suggested.hf_boost_db, 0, 20))
        setNoisePercentile(clamp(j.suggested.noise_percentile, 5, 40))
      }
    } catch (e) {
      // not fatal
      setErr(e instanceof Error ? e.message : String(e))
    }
  }

  async function onEnhance() {
    if (!file) return
    setBusy(true)
    setErr(null)
    setEnhancedUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('strength', String(strength))
      fd.append('residual_gate', String(residualGate))
      fd.append('hf_boost_db', String(hfBoostDb))
      fd.append('noise_percentile', String(noisePercentile))
      fd.append('out_format', outFormat)

      const res = await fetch(`${apiBase}/api/denoise`, { method: 'POST', body: fd })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Enhance failed: ${res.status}`)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setEnhancedUrl(url)
      setTimeout(() => enhancedAudioRef.current?.play().catch(() => {}), 0)
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-widest text-zinc-400">VOICE TOOL</div>
            <h1 className="mt-2 text-2xl font-semibold">Noise Remover</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Upload audio → tune settings → download cleaner voice. (No ML, runs on your current Python.)
            </p>
          </div>
          <a
            className="text-xs text-zinc-400 hover:text-zinc-200"
            href="https://127.0.0.1:8000/api/health"
            target="_blank"
            rel="noreferrer"
          >
            backend health
          </a>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-medium">Audio</div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-zinc-800 px-3 py-2 text-xs font-semibold hover:bg-zinc-700">
                  <input
                    className="hidden"
                    type="file"
                    accept="audio/*"
                    onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                  />
                  Choose file
                </label>
              </div>

              {!file ? (
                <div className="mt-4 rounded-xl border border-dashed border-zinc-700 p-8 text-center text-sm text-zinc-400">
                  Pick an audio file (wav/flac/ogg/m4a/mp3 if your backend can decode it).
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm text-zinc-300">
                      <span className="font-semibold">{file.name}</span>
                      <span className="text-zinc-500"> · {(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                    <button
                      onClick={() => onPickFile(null)}
                      className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-3">
                      <div className="text-xs font-semibold text-zinc-400">Original</div>
                      <audio className="mt-2 w-full" controls src={originalUrl ?? undefined} />
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold text-zinc-400">Enhanced</div>
                        {enhancedUrl ? (
                          <a
                            className="text-xs font-semibold text-violet-300 hover:text-violet-200"
                            href={enhancedUrl}
                            download={`${file.name.replace(/\.[^/.]+$/, '')}_denoised.${outFormat}`}
                          >
                            Download
                          </a>
                        ) : null}
                      </div>
                      <audio ref={enhancedAudioRef} className="mt-2 w-full" controls src={enhancedUrl ?? undefined} />
                    </div>
                  </div>

                  {err ? (
                    <div className="rounded-xl border border-red-900/40 bg-red-950/40 p-3 text-sm text-red-200">
                      {err}
                    </div>
                  ) : null}

                  <button
                    disabled={busy}
                    onClick={onEnhance}
                    className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busy ? 'Processing…' : 'Enhance / Remove noise'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="text-sm font-medium">Settings</div>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-zinc-300">Strength</div>
                    <div className="font-mono text-xs text-zinc-400">{strength.toFixed(2)}</div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={strength}
                    onChange={(e) => setStrength(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-zinc-300">Residual gate</div>
                    <div className="font-mono text-xs text-zinc-400">{residualGate.toFixed(2)}</div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={residualGate}
                    onChange={(e) => setResidualGate(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-zinc-300">HF boost (dB)</div>
                    <div className="font-mono text-xs text-zinc-400">{hfBoostDb.toFixed(0)}</div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={hfBoostDb}
                    onChange={(e) => setHfBoostDb(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-zinc-300">Noise percentile</div>
                    <div className="font-mono text-xs text-zinc-400">{noisePercentile.toFixed(0)}</div>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={40}
                    step={1}
                    value={noisePercentile}
                    onChange={(e) => setNoisePercentile(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                </div>

                <div>
                  <div className="text-zinc-300">Output format</div>
                  <div className="mt-2 flex gap-2">
                    {(['wav', 'flac'] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setOutFormat(f)}
                        className={[
                          'flex-1 rounded-lg border px-3 py-2 text-xs font-semibold',
                          outFormat === f
                            ? 'border-violet-500/50 bg-violet-500/10 text-violet-200'
                            : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800',
                        ].join(' ')}
                      >
                        {f.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="text-sm font-medium">Analysis</div>
              <div className="mt-3 space-y-1 text-xs text-zinc-400">
                {analysis ? (
                  <>
                    <div>sr: {analysis.sr} Hz</div>
                    <div>channels: {analysis.channels}</div>
                    <div>duration: {analysis.duration_sec.toFixed(2)} sec</div>
                    <div>rms: {analysis.rms.toFixed(4)}</div>
                    <div>peak: {analysis.peak.toFixed(4)}</div>
                    <div>hf_ratio: {analysis.hf_ratio.toFixed(3)}</div>
                  </>
                ) : (
                  <div>Upload a file to auto-suggest settings.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs text-zinc-500">
          Tip: if voice gets metallic, reduce <span className="font-semibold text-zinc-300">Residual gate</span> first.
        </div>
      </div>
    </div>
  )
}

export default App
