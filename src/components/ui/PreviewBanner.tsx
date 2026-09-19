export function PreviewBanner() {
  return (
    <div className="fixed inset-x-0 top-0 z-[200] flex items-center justify-center gap-3 bg-accent px-4 py-2 text-xs text-paper">
      <span>Previewing unpublished changes</span>
      <a href="/api/draft-mode/disable" className="underline">
        Exit preview
      </a>
    </div>
  );
}
