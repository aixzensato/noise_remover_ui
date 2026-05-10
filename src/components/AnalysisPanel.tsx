import { type AnalyzeResponse } from "../hooks/useAudioProcessor";

interface Props {
  analysis: AnalyzeResponse | null;
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/[0.05] last:border-0">
      <span className="font-mono text-[10px] text-zinc-500">{label}</span>
      <span className="font-mono text-xs text-zinc-300">{value}</span>
    </div>
  );
}

function BarRow({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <span className="font-mono text-[10px] text-zinc-500">{label}</span>
        <span className="font-mono text-[10px] text-zinc-400">
          {(pct * 100).toFixed(1)}%
        </span>
      </div>
      <div className="h-0.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function AnalysisPanel({ analysis }: Props) {
  return (
    <div className="bg-zinc-900/50 border border-white/[0.06] rounded-2xl p-5 space-y-4">
      {/* Panel header */}
      <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-zinc-500">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M2 20h20M4 20V10M8 20V4M12 20v-8M16 20V6M20 20v-4" />
        </svg>
        Analysis
      </div>

      {analysis ? (
        <div className="space-y-3">
          <div>
            <StatRow
              label="Sample rate"
              value={`${analysis.sr.toLocaleString()} Hz`}
            />
            <StatRow label="Channels" value={String(analysis.channels)} />
            <StatRow
              label="Duration"
              value={`${analysis.duration_sec.toFixed(2)} s`}
            />
          </div>
          <div className="border-t border-white/[0.05] pt-3 space-y-2.5">
            <BarRow label="RMS level" pct={analysis.rms} />
            <BarRow label="Peak level" pct={analysis.peak} />
            <BarRow label="HF content" pct={analysis.hf_ratio} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2.5 py-5 text-zinc-600">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M3 12h4l3-9 4 18 3-9h4" />
          </svg>
          <span className="font-mono text-[11px]">
            Upload a file to see analysis
          </span>
        </div>
      )}
    </div>
  );
}
