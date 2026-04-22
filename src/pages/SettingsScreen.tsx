import { useState } from "react";

const PROTOCOLS = [
  { id: "auto", name: "Авто", desc: "Лучший протокол автоматически" },
  { id: "wireguard", name: "WireGuard", desc: "Быстрый и современный" },
  { id: "openvpn", name: "OpenVPN UDP", desc: "Надёжный и популярный" },
  { id: "openvpn_tcp", name: "OpenVPN TCP", desc: "Для ограниченных сетей" },
  { id: "ikev2", name: "IKEv2/IPSec", desc: "Стабильный на мобильных" },
];

interface SettingsScreenProps {
  notifications: boolean;
  onNotificationsChange: (v: boolean) => void;
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className={`toggle-track ${on ? "on" : ""}`} onClick={() => onChange(!on)}>
      <div className="toggle-thumb" />
    </div>
  );
}

export default function SettingsScreen({ notifications, onNotificationsChange }: SettingsScreenProps) {
  const [protocol, setProtocol] = useState("auto");
  const [killSwitch, setKillSwitch] = useState(true);
  const [dnsLeak, setDnsLeak] = useState(true);
  const [autoConnect, setAutoConnect] = useState(false);
  const [splitTunnel, setSplitTunnel] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-5 pt-8 pb-4">
        <h2 className="text-xl font-bold text-white">Настройки</h2>
      </div>

      <div className="px-5 pb-6 space-y-5">
        <Section title="Протокол">
          <div className="glass-card rounded-2xl overflow-hidden">
            {PROTOCOLS.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setProtocol(p.id)}
                className={`protocol-item w-full flex items-center gap-3 px-4 py-3.5 border border-transparent text-left
                  ${idx !== 0 ? "border-t border-[var(--vpn-border)]" : ""}
                  ${protocol === p.id ? "selected" : ""}`}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <p className="text-xs text-[#8ea0b8] mt-0.5">{p.desc}</p>
                </div>
                {protocol === p.id && (
                  <div className="w-4 h-4 rounded-full border-2 border-[var(--vpn-green)] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[var(--vpn-green)]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Безопасность">
          <div className="glass-card rounded-2xl overflow-hidden">
            <ToggleRow label="Kill Switch" desc="Блокировать интернет при разрыве VPN" on={killSwitch} onChange={setKillSwitch} />
            <ToggleRow label="Защита от DNS-утечек" desc="Скрыть DNS-запросы" on={dnsLeak} onChange={setDnsLeak} border />
            <ToggleRow label="Раздельное туннелирование" desc="Выбрать приложения для VPN" on={splitTunnel} onChange={setSplitTunnel} border />
          </div>
        </Section>

        <Section title="Уведомления">
          <div className="glass-card rounded-2xl overflow-hidden">
            <ToggleRow label="Push-уведомления" desc="Оповещения об отключении и ошибках" on={notifications} onChange={onNotificationsChange} />
            <ToggleRow label="Автоподключение" desc="При запуске приложения" on={autoConnect} onChange={setAutoConnect} border />
          </div>
        </Section>

        <Section title="Аккаунт">
          <div className="glass-card rounded-2xl overflow-hidden">
            <InfoRow label="Тариф" value="Premium" />
            <InfoRow label="Устройства" value="3 / 5" border />
            <InfoRow label="Действует до" value="22.04.2027" border />
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-[#8ea0b8] uppercase tracking-wider mb-2">{title}</p>
      {children}
    </div>
  );
}

function ToggleRow({ label, desc, on, onChange, border }: { label: string; desc: string; on: boolean; onChange: (v: boolean) => void; border?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 ${border ? "border-t border-[var(--vpn-border)]" : ""}`}>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-[#8ea0b8] mt-0.5">{desc}</p>
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  );
}

function InfoRow({ label, value, border }: { label: string; value: string; border?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3.5 ${border ? "border-t border-[var(--vpn-border)]" : ""}`}>
      <p className="text-sm text-[#8ea0b8]">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}
