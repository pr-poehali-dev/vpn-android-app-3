import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import HomeScreen from "./HomeScreen";
import CountryScreen from "./CountryScreen";
import SettingsScreen from "./SettingsScreen";

type Tab = "home" | "servers" | "settings";
type Status = "disconnected" | "connecting" | "connected";

const COUNTRIES = [
  { name: "Авто (лучший)", flag: "⚡", ping: 12, region: "Авто" },
  { name: "Нидерланды", flag: "🇳🇱", ping: 18, region: "Европа" },
  { name: "Германия", flag: "🇩🇪", ping: 22, region: "Европа" },
];

export default function Index() {
  const [tab, setTab] = useState<Tab>("home");
  const [status, setStatus] = useState<Status>("disconnected");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [notifications, setNotifications] = useState(true);

  const handleToggle = () => {
    if (status === "disconnected") {
      setStatus("connecting");
      setTimeout(() => setStatus("connected"), 2200);
    } else if (status === "connected") {
      setStatus("disconnected");
      if (notifications) {
        showNotification("VPN отключён", "Ваше соединение больше не защищено");
      }
    }
  };

  const showNotification = (title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico" });
    }
  };

  useEffect(() => {
    if (notifications && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [notifications]);

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setTab("home");
  };

  const navItems: { id: Tab; icon: string; label: string }[] = [
    { id: "home", icon: "Shield", label: "VPN" },
    { id: "servers", icon: "Globe", label: "Серверы" },
    { id: "settings", icon: "Settings", label: "Настройки" },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-noise"
      style={{ background: "var(--vpn-bg)" }}
    >
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: "min(100vw, 390px)",
          height: "min(100vh, 844px)",
          background: "var(--vpn-bg)",
          borderRadius: "clamp(0px, calc((100vw - 390px) * 999), 36px)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              status === "connected"
                ? "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(52,212,94,0.08) 0%, transparent 70%)"
                : "radial-gradient(ellipse 60% 30% at 50% 0%, rgba(91,156,246,0.05) 0%, transparent 70%)",
            transition: "background 0.8s ease",
          }}
        />

        <div className="flex-1 overflow-hidden relative">
          {tab === "home" && (
            <HomeScreen
              status={status}
              onToggle={handleToggle}
              selectedCountry={selectedCountry}
              onCountryClick={() => setTab("servers")}
              notifications={notifications}
            />
          )}
          {tab === "servers" && (
            <CountryScreen
              selected={selectedCountry.name}
              onSelect={handleCountrySelect}
            />
          )}
          {tab === "settings" && (
            <SettingsScreen
              notifications={notifications}
              onNotificationsChange={setNotifications}
            />
          )}
        </div>

        <nav
          className="flex-shrink-0 border-t flex"
          style={{
            borderColor: "var(--vpn-border)",
            background: "rgba(13,15,20,0.95)",
            backdropFilter: "blur(20px)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          {navItems.map(({ id, icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`nav-item flex-1 flex flex-col items-center justify-center py-3 gap-1 ${tab === id ? "active" : ""}`}
            >
              <Icon
                name={icon}
                size={20}
                style={{
                  color: tab === id ? "var(--vpn-green)" : "#4a6080",
                  transition: "color 0.2s",
                }}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: tab === id ? "var(--vpn-green)" : "#4a6080" }}
              >
                {label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}