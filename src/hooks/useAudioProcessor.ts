import { useCallback, useMemo, useRef, useState } from "react";

export type AnalyzeResponse = {
  sr: number;
  channels: number;
  duration_sec: number;
  rms: number;
  peak: number;
  hf_ratio: number;
  suggested?: {
    strength: number;
    residual_gate: number;
    hf_boost_db: number;
    noise_percentile: number;
  };
};

export type Settings = {
  strength: number;
  residualGate: number;
  hfBoostDb: number;
  noisePercentile: number;
  outFormat: "wav" | "flac";
};

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function useAudioProcessor() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [settings, setSettings] = useState<Settings>({
    strength: 0.92,
    residualGate: 0.55,
    hfBoostDb: 10,
    noisePercentile: 12,
    outFormat: "wav",
  });

  const enhancedAudioRef = useRef<HTMLAudioElement | null>(null);

  const apiBase = useMemo(() => "http://127.0.0.1:8000", []);

  const updateSetting = useCallback(
    <K extends keyof Settings>(key: K, value: Settings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const pickFile = useCallback(
    async (f: File | null) => {
      setErr(null);
      setAnalysis(null);
      setEnhancedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setFile(f);
      setOriginalUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return f ? URL.createObjectURL(f) : null;
      });

      if (!f) return;

      try {
        const fd = new FormData();
        fd.append("file", f);
        const res = await fetch(`${apiBase}/api/analyze`, {
          method: "POST",
          body: fd,
        });
        const j = (await res.json()) as AnalyzeResponse | { error: string };
        if (!res.ok || "error" in j)
          throw new Error(
            "error" in j ? j.error : `Analyze failed: ${res.status}`,
          );
        setAnalysis(j);
        if (j.suggested) {
          setSettings({
            strength: clamp(j.suggested.strength, 0, 1),
            residualGate: clamp(j.suggested.residual_gate, 0, 1),
            hfBoostDb: clamp(j.suggested.hf_boost_db, 0, 20),
            noisePercentile: clamp(j.suggested.noise_percentile, 5, 40),
            outFormat: "wav",
          });
        }
      } catch (e) {
        setErr(e instanceof Error ? e.message : String(e));
      }
    },
    [apiBase],
  );

  const enhance = useCallback(async () => {
    if (!file) return;
    setBusy(true);
    setErr(null);
    setEnhancedUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("strength", String(settings.strength));
      fd.append("residual_gate", String(settings.residualGate));
      fd.append("hf_boost_db", String(settings.hfBoostDb));
      fd.append("noise_percentile", String(settings.noisePercentile));
      fd.append("out_format", settings.outFormat);

      const res = await fetch(`${apiBase}/api/denoise`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Enhance failed: ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setEnhancedUrl(url);
      setTimeout(() => enhancedAudioRef.current?.play().catch(() => {}), 0);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }, [file, settings, apiBase]);

  return {
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
  };
}
