ALTER TABLE t_p77975088_vpn_android_app_3.users
  ADD COLUMN IF NOT EXISTS session_id TEXT UNIQUE;