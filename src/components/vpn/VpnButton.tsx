import { useState, useEffect } from "react";

type Status = "disconnected" | "connecting" | "connected";

interface VpnButtonProps {
  status: Status;
  onToggle: () => void;
}

export default function VpnButton({ status, onToggle }: VpnButtonProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (status !== "connected") {
      setSeconds(0);
      return;
    }
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

  return (
    <div className="flex flex-col items-center gap-5">
      <button
        onClick={onToggle}
        disabled={isConnecting}
        className={`relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none
          ${isConnected
            ? "bg-[var(--vpn-green)] vpn-pulse-green"
            : isConnecting
            ? "bg-[var(--vpn-surface2)] border-2 border-[var(--vpn-green)]"
            : "bg-[var(--vpn-surface2)] border-2 border-[var(--vpn-border)] hover:border-[rgba(52,212,94,0.4)] vpn-pulse-red"
          }`}
        style={isConnected ? { boxShadow: "0 0 40px var(--vpn-green-glow)" } : {}}
      >
        {isConnecting ? (
          <svg
            className="connecting-spin"
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="var(--vpn-green)"
              strokeWidth="4"
              strokeDasharray="60 110"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg
            width="52"
            height="52"
            viewBox="0 0 52 52"
            fill="none"
          >
            <path
              d="M26 8C20.477 8 16 12.477 16 18v3H12a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V23a2 2 0 0 0-2-2h-4v-3c0-5.523-4.477-10-10-10z"
              stroke={isConnected ? "var(--vpn-bg)" : "var(--vpn-green)"}
              strokeWidth="2.5"
              strokeLinejoin="round"
              fill={isConnected ? "rgba(12,14,20,0.3)" : "none"}
            />
            <circle
              cx="26"
              cy="33"
              r="3.5"
              fill={isConnected ? "var(--vpn-bg)" : "var(--vpn-green)"}
            />
            <line
              x1="26"
              y1="36.5"
              x2="26"
              y2="41"
              stroke={isConnected ? "var(--vpn-bg)" : "var(--vpn-green)"}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      <div className="text-center animate-fade-up">
        <p
          className="text-sm font-semibold tracking-widest uppercase"
          style={{
            color: isConnected
              ? "var(--vpn-green)"
              : isConnecting
              ? "#8ea0b8"
              : "#ff6b6b",
          }}
        >
          {isConnected ? "Подключено" : isConnecting ? "Подключение..." : "Отключено"}
        </p>
        {isConnected && (
          <p className="text-xs text-[#8ea0b8] mt-1 font-mono">{formatTime(seconds)}</p>
        )}
      </div>
    </div>
  );
}
