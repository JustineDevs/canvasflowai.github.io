import type { Scene } from "@/lib/scene/types";

interface SceneCanvasProps {
  scene: Scene;
  onNudge: (elementId: string, axis: "x" | "y", delta: number) => void;
  onRemove: (elementId: string) => void;
}

export function SceneCanvas({ scene, onNudge, onRemove }: SceneCanvasProps) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-[#f7f3e8] p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Scene Canvas</h2>
          <p className="mt-1 text-sm text-slate-600">Elements on canvas: {scene.elements.length}</p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          {scene.viewport.width} x {scene.viewport.height}
        </span>
      </div>

      <div className="mt-4 rounded-[1.75rem] border border-dashed border-slate-300 bg-[linear-gradient(135deg,#fff9ec_0%,#edf7ff_100%)] p-4">
        <div className="grid gap-3 md:grid-cols-2">
          {scene.elements.map((element) => (
            <article key={element.id} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{element.label}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
                    {element.kind}
                  </p>
                </div>
                <button
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-slate-400"
                  onClick={() => onRemove(element.id)}
                  type="button"
                >
                  Remove
                </button>
              </div>
              <div className="mt-4 h-16 rounded-2xl" style={{ backgroundColor: element.color }} />
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                <button className="rounded-full border border-slate-200 px-3 py-1 hover:border-slate-400" onClick={() => onNudge(element.id, "x", -20)} type="button">Left</button>
                <button className="rounded-full border border-slate-200 px-3 py-1 hover:border-slate-400" onClick={() => onNudge(element.id, "x", 20)} type="button">Right</button>
                <button className="rounded-full border border-slate-200 px-3 py-1 hover:border-slate-400" onClick={() => onNudge(element.id, "y", -20)} type="button">Up</button>
                <button className="rounded-full border border-slate-200 px-3 py-1 hover:border-slate-400" onClick={() => onNudge(element.id, "y", 20)} type="button">Down</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
