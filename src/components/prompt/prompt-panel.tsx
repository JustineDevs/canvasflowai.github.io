import type { PromptSummary } from "@/lib/scene/types";

interface PromptPanelProps {
  summary: PromptSummary;
}

export function PromptPanel({ summary }: PromptPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Prompt Summary</h2>
      <h3 className="mt-3 text-base font-semibold text-slate-900">{summary.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{summary.body}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {summary.relationships.map((relationship, index) => (
          <li key={`${relationship}-${index}`} className="rounded-2xl bg-slate-50 px-3 py-2">
            {relationship}
          </li>
        ))}
      </ul>
    </section>
  );
}
