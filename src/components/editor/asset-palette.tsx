import { starterAssets } from "@/lib/assets/starter-assets";
import type { StarterAsset } from "@/lib/scene/types";

interface AssetPaletteProps {
  onAddAsset: (asset: StarterAsset) => void;
}

export function AssetPalette({ onAddAsset }: AssetPaletteProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Starter Assets</h2>
      <p className="mt-2 text-sm text-slate-600">
        Add curated building blocks for a personal-brand diorama.
      </p>
      <div className="mt-4 grid gap-3">
        {starterAssets.map((asset) => (
          <button
            key={asset.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-slate-400 hover:bg-white"
            onClick={() => onAddAsset(asset)}
            type="button"
          >
            <span className="block text-sm font-medium text-slate-900">{asset.label}</span>
            <span className="mt-1 block text-xs uppercase tracking-[0.18em] text-slate-500">
              Add {asset.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
