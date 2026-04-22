import VpnButton from "@/components/vpn/VpnButton";
import StatsBar from "@/components/vpn/StatsBar";
import Icon from "@/components/ui/icon";

type Status = "disconnected" | "connecting" | "connected";

interface HomeScreenProps {
  status: Status;
  onToggle: () => void;
  selectedCountry: { name: string; flag: string; ping: number };
  onCountryClick: () => void;
  notifications: boolean;
}

export default function HomeScreen({
  status,
  onToggle,
  selectedCountry,
  onCountryClick,
  notifications,
}: HomeScreenProps) {
  return (
    <div className="flex flex-col h-full px-5 pt-8 pb-4 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">CedarVPN</h1>
          <p className="text-xs text-[#8ea0b8] mt-0.5">Безопасное соединение</p>
        </div>
        <div className="flex items-center gap-2">
          {notifications && (
            <div className="w-2 h-2 rounded-full bg-[var(--vpn-green)]" />
          )}
          <div className="w-8 h-8 rounded-full bg-[var(--vpn-surface2)] border border-[var(--vpn-border)] flex items-center justify-center">
            <span className="text-xs text-[#8ea0b8]">JD</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <VpnButton status={status} onToggle={onToggle} />

        <button
          onClick={onCountryClick}
          className="glass-card rounded-2xl px-5 py-3.5 flex items-center gap-3 w-full hover:border-[rgba(52,212,94,0.25)] transition-all"
        >
          <span className="text-2xl">{selectedCountry.flag}</span>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">{selectedCountry.name}</p>
            <p className="text-xs text-[#8ea0b8]">Пинг: {selectedCountry.ping} ms</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[var(--vpn-green)] font-medium">Сменить</span>
            <Icon name="ChevronRight" size={14} className="text-[#8ea0b8]" />
          </div>
        </button>
      </div>

      <StatsBar connected={status === "connected"} />

      {status === "connected" && (
        <div className="glass-card rounded-xl px-4 py-2.5 flex items-center gap-2 animate-fade-up">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--vpn-green)]" />
          <p className="text-xs text-[#8ea0b8]">Трафик зашифрован · IP скрыт</p>
          <div className="ml-auto flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="data-bar w-0.5 rounded-full bg-[var(--vpn-green)]"
                style={{ height: `${8 + i * 3}px` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}