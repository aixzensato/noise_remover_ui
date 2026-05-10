import { useCallback, useState } from "react";

interface Props {
  onFile: (f: File) => void;
}

export default function AudioUploader({ onFile }: Props) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) onFile(f);
    },
    [onFile],
  );

  return (
    <label
      className={`flex flex-col items-center justify-center gap-3 border border-dashed rounded-xl p-14 text-center cursor-pointer transition-all duration-200 ${
        dragging
          ? "border-violet-500 bg-violet-500/10"
          : "border-white/10 hover:border-violet-500/60 hover:bg-violet-500/5"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        className="hidden"
        type="file"
        accept="audio/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center border transition-colors duration-200 ${dragging ? "border-violet-500/40 text-violet-400" : "border-white/10 text-zinc-400"}`}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      </div>
      <p className="text-sm font-semibold font-display text-zinc-200">
        Drop your audio file here
      </p>
      <p className="text-xs text-zinc-500 font-mono">
        WAV · FLAC · OGG · M4A · MP3 — or click to browse
      </p>
    </label>
  );
}
