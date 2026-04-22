interface StatsBarProps {
  connected: boolean;
}

export default function StatsBar({ connected }: StatsBarProps) {
  return (
    <div className="glass-card rounded-2xl p-4 flex justify-between items-center gap-3">
      <StatItem label="Скачано" value={connected ? "128 MB" : "—"} icon="↓" color="var(--vpn-green)" />
      <div className="w-px h-8 bg-[var(--vpn-border)]" />
      <StatItem label="Загружено" value={connected ? "34 MB" : "—"} icon="↑" color="#5b9cf6" />
      <div className="w-px h-8 bg-[var(--vpn-border)]" />
      <StatItem label="Пинг" value={connected ? "24 ms" : "—"} icon="◉" color="#c084fc" />
    </div>
  );
}

function StatItem({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="flex-1 text-center">
      <p className="text-xs mb-1" style={{ color }}>{icon} {label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
