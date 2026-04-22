"""
Telegram Login Widget — верификация и сохранение пользователя.
POST /: принимает данные от Telegram Login Widget, проверяет подпись, сохраняет пользователя в БД, возвращает профиль.
GET /me: возвращает профиль текущего пользователя по session-токену из заголовка.
"""
import os
import json
import hashlib
import hmac
import time
import secrets

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}


def get_conn():
    import psycopg2
    return psycopg2.connect(os.environ["DATABASE_URL"])


def verify_telegram_data(data: dict) -> bool:
    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    check_hash = data.pop("hash", None)
    if not check_hash:
        return False
    data_check_arr = sorted([f"{k}={v}" for k, v in data.items() if v is not None])
    data_check_string = "\n".join(data_check_arr)
    secret_key = hashlib.sha256(bot_token.encode()).digest()
    computed = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    if computed != check_hash:
        return False
    # Проверяем что данные не старше 1 часа
    auth_date = int(data.get("auth_date", 0))
    if time.time() - auth_date > 3600:
        return False
    return True


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")

    # GET /me — вернуть профиль по сессии
    if method == "GET":
        session_id = (event.get("headers") or {}).get("x-session-id", "")
        if not session_id:
            return {"statusCode": 401, "headers": CORS_HEADERS, "body": json.dumps({"error": "no session"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, first_name, last_name, username, photo_url, plan, plan_expires_at FROM {schema}.users WHERE session_id = %s",
            (session_id,)
        )
        row = cur.fetchone()
        conn.close()

        if not row:
            return {"statusCode": 401, "headers": CORS_HEADERS, "body": json.dumps({"error": "invalid session"})}

        user = {
            "id": row[0],
            "first_name": row[1],
            "last_name": row[2],
            "username": row[3],
            "photo_url": row[4],
            "plan": row[5],
            "plan_expires_at": row[6].isoformat() if row[6] else None,
        }
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"user": user})}

    # POST / — верификация и логин
    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        tg_data = dict(body)

        if not verify_telegram_data(tg_data):
            return {"statusCode": 403, "headers": CORS_HEADERS, "body": json.dumps({"error": "invalid signature"})}

        user_id = int(body["id"])
        first_name = body.get("first_name", "")
        last_name = body.get("last_name")
        username = body.get("username")
        photo_url = body.get("photo_url")
        session_id = secrets.token_urlsafe(32)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"""
            INSERT INTO {schema}.users (id, first_name, last_name, username, photo_url, session_id, last_login_at)
            VALUES (%s, %s, %s, %s, %s, %s, NOW())
            ON CONFLICT (id) DO UPDATE SET
                first_name = EXCLUDED.first_name,
                last_name = EXCLUDED.last_name,
                username = EXCLUDED.username,
                photo_url = EXCLUDED.photo_url,
                session_id = EXCLUDED.session_id,
                last_login_at = NOW()
            RETURNING id, first_name, last_name, username, photo_url, plan, plan_expires_at
        """, (user_id, first_name, last_name, username, photo_url, session_id))
        row = cur.fetchone()
        conn.commit()
        conn.close()

        user = {
            "id": row[0],
            "first_name": row[1],
            "last_name": row[2],
            "username": row[3],
            "photo_url": row[4],
            "plan": row[5],
            "plan_expires_at": row[6].isoformat() if row[6] else None,
        }
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"user": user, "session_id": session_id}),
        }

    return {"statusCode": 405, "headers": CORS_HEADERS, "body": json.dumps({"error": "method not allowed"})}