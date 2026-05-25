export default function StorageWarning({ isLow, usage }) {
  if (!isLow) return null

  const pct = usage ? Math.min(100, Math.round((usage / 5_000_000) * 100)) : 0

  return (
    <div
      role="alert"
      className="flex items-center justify-center gap-2 py-1.5 px-4 text-xs text-warning-fg bg-warning-bg border-b border-warning-border"
    >
      <span aria-hidden="true">⚠</span>
      <span>Storage nearly full ({pct}% used). Consider exporting or deleting old notes.</span>
    </div>
  )
}
