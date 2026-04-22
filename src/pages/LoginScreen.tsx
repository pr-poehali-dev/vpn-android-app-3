import { useEffect, useRef } from "react";

interface LoginScreenProps {
  onLogin: (user: TgUser, sessionId: string) => void;
  botUsername: string;
}

export interface TgUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  plan: string;
  plan_expires_at?: string;
}

const TG_AUTH_URL = "https://functions.poehali.dev/58bd900f-b23b-4a95-9503-c3037230fbb0";

export default function LoginScreen({ onLogin, botUsername }: LoginScreenProps) {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!widgetRef.current || !botUsername) return;

    (window as Record<string, unknown>).onTelegramAuth = async (data: Record<string, string>) => {
      const res = await fetch(TG_AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        onLogin(json.user, json.session_id);
        localStorage.setItem("vpn_session", json.session_id);
      }
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "12");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.async = true;
    widgetRef.current.innerHTML = "";
    widgetRef.current.appendChild(script);

    return () => {
      delete (window as Record<string, unknown>).onTelegramAuth;
    };
  }, [botUsername, onLogin]);

  return (
    <div className="flex flex-col h-full px-6 pt-16 pb-8 items-center">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{ background: "var(--vpn-green-dim)", border: "1px solid rgba(52,212,94,0.2)" }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M20 4C11.163 4 4 11.163 4 20s7.163 16 16 16 16-7.163 16-16S28.837 4 20 4z"
                fill="var(--vpn-green)"
                opacity="0.15"
              />
              <path
                d="M20 4C11.163 4 4 11.163 4 20s7.163 16 16 16 16-7.163 16-16S28.837 4 20 4z"
                stroke="var(--vpn-green)"
                strokeWidth="1.5"
              />
              <path
                d="M14 20C14 16.686 16.686 14 20 14s6 2.686 6 6v2h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H12a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h2v-2z"
                stroke="var(--vpn-green)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="20" cy="25" r="1.5" fill="var(--vpn-green)" />
            </svg>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">CedarVPN</h1>
            <p className="text-sm text-[#8ea0b8] mt-1.5">Безопасное соединение</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 w-full">
          <div
            className="w-full rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: "var(--vpn-surface2)", border: "1px solid var(--vpn-border)" }}
          >
            {[
              { icon: "🔒", text: "Военное шифрование AES-256" },
              { icon: "🌍", text: "Серверы в 12+ странах" },
              { icon: "⚡", text: "Скорость до 1 Гбит/с" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <p className="text-sm text-[#8ea0b8]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 w-full">
          <p className="text-xs text-[#8ea0b8] text-center">
            Войдите через Telegram для доступа к VPN
          </p>

          {botUsername ? (
            <div ref={widgetRef} className="flex justify-center" />
          ) : (
            <div
              className="w-full rounded-2xl px-4 py-3 text-center text-sm"
              style={{ background: "rgba(255,180,0,0.1)", border: "1px solid rgba(255,180,0,0.2)", color: "#ffb400" }}
            >
              ⚠️ Настройте Telegram-бота в настройках платформы
            </div>
          )}
        </div>
      </div>

      <p className="text-[10px] text-[#4a6080] text-center">
        Нажимая «Войти», вы соглашаетесь с условиями использования
      </p>
    </div>
  );
}