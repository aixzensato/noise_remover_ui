import { Music } from "lucide-react";
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
        <Music />
      </div>
      <p className="text-lg font-semibold text-zinc-200">
        Drop your audio file here
      </p>
      <p className="text-sm font-medium text-zinc-500">
        WAV · FLAC · OGG · M4A · MP3 — or click to browse
      </p>
    </label>
  );
}
