import type { ExportDraft, PromptSummary } from "@/lib/scene/types";

interface ReadmePreviewProps {
  draft: ExportDraft;
  summary: PromptSummary;
}

export function ReadmePreview({ draft, summary }: ReadmePreviewProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">README Preview</h2>
      <div className="mt-4 rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-slate-100">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Preview frame</p>
        <h3 className="mt-3 text-xl font-semibold">{summary.title}</h3>
        <p className="mt-2 max-w-xl text-sm text-slate-300">{summary.body}</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span className="block text-xs uppercase tracking-[0.18em] text-slate-500">Estimated size</span>
          {(draft.estimatedBytes / 1024).toFixed(0)} KB
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span className="block text-xs uppercase tracking-[0.18em] text-slate-500">Within budget</span>
          {draft.withinBudget ? "Yes" : "No"} · {draft.withinBudget ? "Ready to export" : "Needs compression"}
        </div>
      </div>
    </section>
  );
}
