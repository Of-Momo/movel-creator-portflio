export function UploadStatus({
  stage,
  progress,
  label,
  error,
}: {
  stage: "idle" | "compressing" | "uploading" | "done" | "error";
  progress: number;
  label: string;
  error: string | null;
}) {
  if (stage === "idle") return null;
  if (stage === "error") {
    return <p className="mt-2 rounded bg-soft/60 p-3 text-sm text-accent">{error}</p>;
  }
  if (stage === "done") {
    return <p className="mt-2 text-sm text-accent">✓ Ready</p>;
  }
  return (
    <div className="mt-2">
      <div className="h-2 w-full overflow-hidden rounded-full bg-detail/20">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-1 text-xs opacity-70">
        {label} {progress}%
      </p>
    </div>
  );
}
