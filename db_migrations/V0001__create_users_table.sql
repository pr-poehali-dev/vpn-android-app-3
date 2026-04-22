CREATE TABLE IF NOT EXISTS t_p77975088_vpn_android_app_3.users (
  id BIGINT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT,
  username TEXT,
  photo_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  plan_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);