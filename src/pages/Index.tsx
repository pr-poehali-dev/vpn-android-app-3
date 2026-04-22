import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import HomeScreen from "./HomeScreen";
import CountryScreen from "./CountryScreen";
import SettingsScreen from "./SettingsScreen";
import LoginScreen, { type TgUser } from "./LoginScreen";
import ProfileScreen from "./ProfileScreen";

type Tab = "home" | "servers" | "settings" | "profile";
type Status = "disconnected" | "connecting" | "connected";

const COUNTRIES = [
  { name: "Авто (лучший)", flag: "⚡", ping: 12, region: "Авто" },
  { name: "Нидерланды", flag: "🇳🇱", ping: 18, region: "Европа" },
  { name: "Германия", flag: "🇩🇪", ping: 22, region: "Европа" },
];

const TG_AUTH_URL = "https://functions.poehali.dev/58bd900f-b23b-4a95-9503-c3037230fbb0";

// Укажи username своего Telegram-бота (без @)
const BOT_USERNAME = "";

export default function Index() {
  const [tab, setTab] = useState<Tab>("home");
  const [status, setStatus] = useState<Status>("disconnected");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [notifications, setNotifications] = useState(true);
  const [user, setUser] = useState<TgUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Восстановить сессию при загрузке
  useEffect(() => {
    const session = localStorage.getItem("vpn_session");
    if (!session) { setAuthLoading(false); return; }
    fetch(TG_AUTH_URL, { headers: { "x-session-id": session } })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data?.user) setUser(data.user); })
      .finally(() => setAuthLoading(false));
  }, []);

  const handleLogin = useCallback((tgUser: TgUser, sessionId: string) => {
    setUser(tgUser);
    localStorage.setItem("vpn_session", sessionId);
    setTab("home");
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("vpn_session");
    setStatus("disconnected");
    setTab("home");
  }, []);

  const handleToggle = () => {
    if (status === "disconnected") {
      setStatus("connecting");
      setTimeout(() => setStatus("connected"), 2200);
    } else if (status === "connected") {
      setStatus("disconnected");
      if (notifications) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("VPN отключён", { body: "Ваше соединение больше не защищено", icon: "/favicon.ico" });
        }
      }
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
    { id: "profile", icon: "User", label: "Профиль" },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--vpn-bg)" }}>
        <div className="connecting-spin">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="16" stroke="var(--vpn-green)" strokeWidth="3" strokeDasharray="40 60" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--vpn-bg)" }}>
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
          <LoginScreen onLogin={handleLogin} botUsername={BOT_USERNAME} />
        </div>
      </div>
    );
  }

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
          {tab === "profile" && (
            <ProfileScreen user={user} onLogout={handleLogout} />
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
              {id === "profile" && user?.photo_url ? (
                <img
                  src={user.photo_url}
                  alt=""
                  className="w-5 h-5 rounded-full object-cover"
                  style={{ border: tab === id ? "1.5px solid var(--vpn-green)" : "1.5px solid #4a6080" }}
                />
              ) : (
                <Icon
                  name={icon}
                  size={20}
                  style={{ color: tab === id ? "var(--vpn-green)" : "#4a6080", transition: "color 0.2s" }}
                />
              )}
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
