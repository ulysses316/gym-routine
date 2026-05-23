import type { Insight } from "@/lib/stats";

const styles: Record<Insight["type"], string> = {
  warning: "border-yellow-500/30 bg-yellow-500/5 text-yellow-300",
  success: "border-green-500/30 bg-green-500/5 text-green-300",
  info: "border-blue-500/30 bg-blue-500/5 text-blue-300",
};

export default function InsightsList({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) return null;
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Insights
      </h2>
      <div className="space-y-2.5">
        {insights.map((ins) => (
          <div
            key={`${ins.type}-${ins.title}`}
            className={`rounded-xl border px-4 py-3 ${styles[ins.type]}`}
          >
            <p className="text-sm font-medium">{ins.title}</p>
            <p className="mt-0.5 text-xs opacity-80">{ins.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
