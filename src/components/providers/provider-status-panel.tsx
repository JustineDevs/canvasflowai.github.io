import { getProviderStatusMessage } from "@/lib/providers/provider-state";
import type { ProviderState } from "@/lib/scene/types";

interface ProviderStatusPanelProps {
  state: ProviderState;
}

export function ProviderStatusPanel({ state }: ProviderStatusPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Provider Mode</h2>
      <p className="mt-2 text-sm text-slate-600">{getProviderStatusMessage(state)}</p>
    </section>
  );
}
