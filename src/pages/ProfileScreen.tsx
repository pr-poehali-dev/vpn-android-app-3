import type { TgUser } from "./LoginScreen";
import Icon from "@/components/ui/icon";

interface ProfileScreenProps {
  user: TgUser;
  onLogout: () => void;
}

const PLAN_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  free: { label: "Бесплатный", color: "#8ea0b8", bg: "rgba(142,160,184,0.1)" },
  premium: { label: "Premium", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  pro: { label: "Pro", color: "var(--vpn-green)", bg: "var(--vpn-green-dim)" },
};

export default function ProfileScreen({ user, onLogout }: ProfileScreenProps) {
  const plan = PLAN_LABELS[user.plan] ?? PLAN_LABELS.free;
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");

  const formatExpiry = (iso?: string) => {
    if (!iso) return "Бессрочно";
    return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-5 pt-8 pb-4">
        <h2 className="text-xl font-bold text-white">Профиль</h2>
      </div>

      <div className="px-5 pb-6 flex flex-col gap-5">
        {/* Avatar + name */}
        <div
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: "var(--vpn-surface2)", border: "1px solid var(--vpn-border)" }}
        >
          {user.photo_url ? (
            <img
              src={user.photo_url}
              alt={fullName}
              className="w-16 h-16 rounded-2xl object-cover"
              style={{ border: "2px solid rgba(52,212,94,0.25)" }}
            />
          ) : (
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: "var(--vpn-green-dim)", border: "2px solid rgba(52,212,94,0.2)" }}
            >
              {user.first_name[0]}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold text-white">{fullName}</p>
            {user.username && (
              <p className="text-sm text-[#8ea0b8]">@{user.username}</p>
            )}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mt-1 self-start"
              style={{ background: plan.bg, color: plan.color }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: plan.color }} />
              {plan.label}
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div>
          <p className="text-xs font-semibold text-[#8ea0b8] uppercase tracking-wider mb-2">Подписка</p>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5">
              <p className="text-sm text-[#8ea0b8]">Тариф</p>
              <span
                className="text-sm font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: plan.bg, color: plan.color }}
              >
                {plan.label}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5 border-t border-[var(--vpn-border)]">
              <p className="text-sm text-[#8ea0b8]">Действует до</p>
              <p className="text-sm font-medium text-white">{formatExpiry(user.plan_expires_at)}</p>
            </div>
            {user.plan === "free" && (
              <div className="border-t border-[var(--vpn-border)]">
                <button
                  className="w-full px-4 py-3.5 flex items-center justify-between"
                  style={{ color: "var(--vpn-green)" }}
                >
                  <p className="text-sm font-semibold">Улучшить до Premium</p>
                  <Icon name="ChevronRight" size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account */}
        <div>
          <p className="text-xs font-semibold text-[#8ea0b8] uppercase tracking-wider mb-2">Аккаунт</p>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <Icon name="MessageCircle" size={16} color="#2aabee" />
                <p className="text-sm text-white">Telegram</p>
              </div>
              <p className="text-sm text-[#8ea0b8]">Подключён</p>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 border-t border-[var(--vpn-border)] transition-opacity hover:opacity-70"
            >
              <Icon name="LogOut" size={16} color="#ff6b6b" />
              <p className="text-sm font-medium" style={{ color: "#ff6b6b" }}>Выйти</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
