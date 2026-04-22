import { useState } from "react";
import Icon from "@/components/ui/icon";

const COUNTRIES = [
  { name: "Авто (лучший)", flag: "⚡", ping: 12, region: "Авто" },
  { name: "Нидерланды", flag: "🇳🇱", ping: 18, region: "Европа" },
  { name: "Германия", flag: "🇩🇪", ping: 22, region: "Европа" },
  { name: "Франция", flag: "🇫🇷", ping: 25, region: "Европа" },
  { name: "Великобритания", flag: "🇬🇧", ping: 28, region: "Европа" },
  { name: "США (Нью-Йорк)", flag: "🇺🇸", ping: 87, region: "Америка" },
  { name: "США (Лос-Анджелес)", flag: "🇺🇸", ping: 145, region: "Америка" },
  { name: "Канада", flag: "🇨🇦", ping: 95, region: "Америка" },
  { name: "Япония", flag: "🇯🇵", ping: 190, region: "Азия" },
  { name: "Сингапур", flag: "🇸🇬", ping: 210, region: "Азия" },
  { name: "Швейцария", flag: "🇨🇭", ping: 24, region: "Европа" },
  { name: "Швеция", flag: "🇸🇪", ping: 32, region: "Европа" },
];

function pingColor(ping: number) {
  if (ping < 50) return "var(--vpn-green)";
  if (ping < 120) return "#f59e0b";
  return "#ff6b6b";
}

interface CountryScreenProps {
  selected: string;
  onSelect: (country: typeof COUNTRIES[0]) => void;
}

export default function CountryScreen({ selected, onSelect }: CountryScreenProps) {
  const [search, setSearch] = useState("");

  const regions = [...new Set(COUNTRIES.map((c) => c.region))];
  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = regions.reduce<Record<string, typeof COUNTRIES>>((acc, region) => {
    const items = filtered.filter((c) => c.region === region);
    if (items.length) acc[region] = items;
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-8 pb-4">
        <h2 className="text-xl font-bold text-white mb-4">Выбор сервера</h2>
        <div className="glass-card rounded-xl flex items-center gap-2 px-3 py-2.5">
          <Icon name="Search" size={16} className="text-[#8ea0b8]" />
          <input
            className="bg-transparent flex-1 text-sm text-white placeholder-[#8ea0b8] outline-none"
            placeholder="Поиск страны..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <Icon name="X" size={14} className="text-[#8ea0b8]" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
        {Object.entries(grouped).map(([region, countries]) => (
          <div key={region}>
            <p className="text-xs font-semibold text-[#8ea0b8] uppercase tracking-wider mb-2">{region}</p>
            <div className="glass-card rounded-2xl overflow-hidden">
              {countries.map((country, idx) => (
                <button
                  key={country.name}
                  onClick={() => onSelect(country)}
                  className={`country-item w-full flex items-center gap-3 px-4 py-3.5 border border-transparent
                    ${idx !== 0 ? "border-t border-[var(--vpn-border)]" : ""}
                    ${selected === country.name ? "selected" : ""}`}
                >
                  <span className="text-xl">{country.flag}</span>
                  <span className="flex-1 text-sm text-left text-white">{country.name}</span>
                  <span className="text-xs font-mono" style={{ color: pingColor(country.ping) }}>
                    {country.ping} ms
                  </span>
                  {selected === country.name && (
                    <Icon name="Check" size={14} className="text-[var(--vpn-green)] ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
