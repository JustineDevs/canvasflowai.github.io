import { getProviderStatusMessage } from "@/lib/providers/provider-state";
import type { ProviderState } from "@/lib/scene/types";
import type { CloudProviderId } from "../../../shared/cloud-bridge-contract";

interface ProviderStatusPanelProps {
  state: ProviderState;
  detail?: string | null;
  configuredProviders?: CloudProviderId[];
  healthMessage?: string | null;
}

export function ProviderStatusPanel({
  state,
  detail,
  configuredProviders = [],
  healthMessage,
}: ProviderStatusPanelProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Provider Mode</h2>
      <p className="mt-2 text-sm text-slate-600">{getProviderStatusMessage(state)}</p>
      {detail ? <p className="mt-2 text-sm text-slate-500">{detail}</p> : null}
      {healthMessage ? <p className="mt-2 text-sm text-slate-500">{healthMessage}</p> : null}
      {configuredProviders.length > 0 ? (
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
          Configured providers: {configuredProviders.join(", ")}
        </p>
      ) : null}
    </section>
  );
}
