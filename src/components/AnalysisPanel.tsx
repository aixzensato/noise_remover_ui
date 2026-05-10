import { AudioLines, ChartLine } from "lucide-react";
import { type AnalyzeResponse } from "../hooks/useAudioProcessor";

interface Props {
  analysis: AnalyzeResponse | null;
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/[0.05] last:border-0">
      <p className="text-base font-medium text-zinc-200">{label}</p>
      <p className="text-xs font-semibold text-violet-500">{value}</p>
    </div>
  );
}

function BarRow({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <p className="text-base font-medium text-zinc-200">{label}</p>
        <p className="text-xs font-semibold text-violet-500">
          {(pct * 100).toFixed(1)}%
        </p>
      </div>
      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
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
      <div className="flex items-center gap-2 text-zinc-500">
        <ChartLine />
        <h1 className="font-medium text-lg">Analysis</h1>
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
          <AudioLines size={23} />
          <span className="text-base font-medium">
            Upload a file to see analysis
          </span>
        </div>
      )}
    </div>
  );
}
