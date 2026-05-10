import { Settings2 } from "lucide-react";
import { type Settings } from "../hooks/useAudioProcessor";

interface SliderProps {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}

function Slider({
  label,
  hint,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-zinc-200">{label}</p>
          <p className="text-[10px] font-mono text-zinc-500 mt-0.5">{hint}</p>
        </div>
        <span className="text-xs font-mono text-violet-400 flex-shrink-0 mt-0.5">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}

interface Props {
  settings: Settings;
  update: <K extends keyof Settings>(key: K, v: Settings[K]) => void;
}

export default function SettingsPanel({ settings, update }: Props) {
  return (
    <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-5 space-y-5">
      {/* Panel header */}
      <div className="flex items-center gap-2 text-zinc-500">
        <Settings2 />
        <h1 className="font-medium text-lg">Settings</h1>
      </div>

      <div className="space-y-5">
        <Slider
          label="Strength"
          hint="noise suppression level"
          value={settings.strength}
          min={0}
          max={1}
          step={0.01}
          format={(v) => v.toFixed(2)}
          onChange={(v) => update("strength", v)}
        />
        <Slider
          label="Residual gate"
          hint="suppress leftover noise"
          value={settings.residualGate}
          min={0}
          max={1}
          step={0.01}
          format={(v) => v.toFixed(2)}
          onChange={(v) => update("residualGate", v)}
        />
        <Slider
          label="HF boost"
          hint="high-frequency presence"
          value={settings.hfBoostDb}
          min={0}
          max={20}
          step={1}
          format={(v) => `${v} dB`}
          onChange={(v) => update("hfBoostDb", v)}
        />
        <Slider
          label="Noise percentile"
          hint="noise floor estimation"
          value={settings.noisePercentile}
          min={5}
          max={40}
          step={1}
          format={(v) => `${v}%`}
          onChange={(v) => update("noisePercentile", v)}
        />
      </div>

      {/* Format picker */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
        <span className="text-sm font-medium text-zinc-200">Output format</span>
        <div className="flex gap-1.5">
          {(["wav", "flac"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => update("outFormat", f)}
              className={`font-mono text-xs tracking-wider px-3 py-1.5 rounded-lg border transition-all duration-200 ${
                settings.outFormat === f
                  ? "bg-violet-500/10 border-violet-500/40 text-violet-300"
                  : "border-white/[0.07] text-zinc-400 hover:border-white/20 hover:text-zinc-300"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Tip */}
      <p className="text-sm text-zinc-500">
        Tip: For best results, use lossless formats like WAV or FLAC as input.
      </p>
    </div>
  );
}
