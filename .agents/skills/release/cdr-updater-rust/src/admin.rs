use std::io::Write;
use std::net::SocketAddr;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use std::time::Instant;

use axum::body::Body;
use axum::extract::{ConnectInfo, FromRequest, Multipart, State};
use axum::http::{header, Request, StatusCode};
use axum::response::{IntoResponse, Response};
use serde::Deserialize;
use serde_json::{json, Value};

use crate::serve::App;

const PAGE: &str = include_str!("../web/admin.html");
const ADMIN_PREFIX: &str = "/admin/ifgfsgfbijuzoxzq";
const LOGIN_GATE: &str = r#"<!DOCTYPE html>
<html lang="zh-CN"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="no-referrer">
<title>CDR 管理登录</title>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:#0a0a0a;color:#f4f4f4}
.card{width:min(420px,92vw);padding:28px;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:#161616;box-shadow:0 16px 40px rgba(0,0,0,.45)}
h1{margin:0 0 8px;font-size:1.25rem}p{margin:0 0 18px;color:#9a9a9a;font-size:.92rem}
label{display:block;margin:0 0 6px;font-size:.85rem;color:#9a9a9a}
input{width:100%;box-sizing:border-box;padding:10px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.14);background:#0a0a0a;color:#fff}
button{margin-top:14px;width:100%;padding:10px 12px;border:0;border-radius:10px;background:#fff;color:#111;font-weight:600;cursor:pointer}
.err{margin-top:10px;color:#ffb4b4;font-size:.85rem;min-height:1.2em}
</style></head><body>
<form class="card" id="f">
<h1>CDR 更新服务器</h1>
<p>管理面板需先登录。未认证不会下发完整管理页。</p>
<label for="token">管理令牌</label>
<input id="token" type="password" autocomplete="current-password" autofocus>
<button type="submit">进入面板</button>
<div class="err" id="err"></div>
</form>
<script>
const apiBase = location.pathname.replace(/\/?$/, '') + '/api';
document.getElementById('f').onsubmit = async (ev) => {
  ev.preventDefault();
  const err = document.getElementById('err');
  err.textContent = '';
  try {
    const res = await fetch(apiBase + '/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({token: document.getElementById('token').value.trim()}),
      credentials: 'same-origin'
    });
    const text = await res.text();
    if (!res.ok) throw new Error(text || ('HTTP ' + res.status));
    location.reload();
  } catch (e) {
    err.textContent = e.message || String(e);
  }
};
</script>
</body></html>"#;

pub struct Admin {
    inner: Mutex<Inner>,
}

pub async fn page(State(app): State<App>, request: Request<Body>) -> Response {
    let html = if allowed(&app, &request) { PAGE } else { LOGIN_GATE };
    (
        StatusCode::OK,
        [
            (header::CONTENT_TYPE, "text/html; charset=utf-8"),
            (header::CACHE_CONTROL, "no-store"),
            (header::HeaderName::from_static("x-content-type-options"), "nosniff"),
            (header::HeaderName::from_static("x-frame-options"), "DENY"),
            (
                header::HeaderName::from_static("content-security-policy"),
                "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
            ),
        ],
        html,
    )
        .into_response()
}

struct Inner {
    listen: String,
    port: String,
    busy: bool,
    logs: Vec<String>,
    progress_active: bool,
    progress_label: String,
    progress_done: i64,
    progress_total: i64,
    progress_speed: i64,
    progress_at: Option<Instant>,
    progress_at_bytes: i64,
    progress_index: i64,
    progress_count: i64,
}

impl Admin {
    pub fn new(listen: String, port: String) -> Arc<Self> {
        Arc::new(Self {
            inner: Mutex::new(Inner {
                listen,
                port,
                busy: false,
                logs: Vec::new(),
                progress_active: false,
                progress_label: String::new(),
                progress_done: 0,
                progress_total: -1,
                progress_speed: 0,
                progress_at: None,
                progress_at_bytes: 0,
                progress_index: 0,
                progress_count: 1,
            }),
        })
    }

    pub fn note(&self, line: impl Into<String>) {
        let line = line.into();
        println!("{line}");
        let mut inner = self.inner.lock().expect("admin");
        inner.logs.push(line);
        let extra = inner.logs.len().saturating_sub(200);
        if extra > 0 {
            inner.logs.drain(0..extra);
        }
    }

    pub fn progress_begin(&self, label: impl Into<String>, total: i64) {
        let mut inner = self.inner.lock().expect("admin");
        inner.progress_active = true;
        inner.progress_label = label.into();
        inner.progress_done = 0;
        inner.progress_total = total;
        inner.progress_speed = 0;
        inner.progress_at = Some(Instant::now());
        inner.progress_at_bytes = 0;
        inner.progress_index = 0;
        inner.progress_count = 1;
    }

    pub fn progress_file(&self, index: i64, count: i64, title: &str, file: &str, total: i64) {
        let mut inner = self.inner.lock().expect("admin");
        if !inner.progress_active {
            inner.progress_at = Some(Instant::now());
            inner.progress_at_bytes = 0;
            inner.progress_speed = 0;
        }
        inner.progress_active = true;
        inner.progress_index = index;
        inner.progress_count = count.max(1);
        inner.progress_label = format!("{index}/{count}  {title}  {file}");
        inner.progress_done = 0;
        inner.progress_total = total;
    }

    pub fn progress_set(&self, done: i64) {
        let mut inner = self.inner.lock().expect("admin");
        if !inner.progress_active {
            return;
        }
        inner.progress_done = done;
        let Some(started) = inner.progress_at else { return };
        let elapsed = started.elapsed();
        if elapsed.as_millis() >= 400 && done >= inner.progress_at_bytes {
            let millis = elapsed.as_millis().max(1) as i64;
            inner.progress_speed = (done - inner.progress_at_bytes) * 1000 / millis;
        }
        if elapsed.as_secs() >= 2 {
            inner.progress_at = Some(Instant::now());
            inner.progress_at_bytes = done;
        }
    }

    pub fn progress_end(&self) {
        let mut inner = self.inner.lock().expect("admin");
        inner.progress_active = false;
        inner.progress_label.clear();
        inner.progress_done = 0;
        inner.progress_total = -1;
        inner.progress_speed = 0;
        inner.progress_at = None;
        inner.progress_at_bytes = 0;
        inner.progress_index = 0;
        inner.progress_count = 1;
    }

    fn progress_snapshot(&self) -> Value {
        let inner = self.inner.lock().expect("admin");
        if !inner.progress_active {
            return idle_progress();
        }
        let file_percent = if inner.progress_total > 0 {
            ((inner.progress_done * 100 + inner.progress_total / 2) / inner.progress_total).clamp(0, 100)
        } else {
            -1
        };
        let percent = if inner.progress_count > 1 && inner.progress_index > 0 {
            let fraction = if file_percent >= 0 { file_percent as f64 / 100.0 } else { 0.0 };
            (((inner.progress_index as f64 - 1.0 + fraction) / inner.progress_count as f64) * 100.0).round() as i64
        } else {
            file_percent
        };
        let text = progress_text(&inner.progress_label, inner.progress_done, inner.progress_total, file_percent, inner.progress_speed);
        json!({
            "active": true, "label": inner.progress_label, "done": inner.progress_done, "total": inner.progress_total,
            "index": inner.progress_index, "count": inner.progress_count, "percent": percent, "speed": inner.progress_speed, "text": text,
        })
    }
}

pub async fn api(State(app): State<App>, request: Request<Body>) -> Response {
    let path = request.uri().path().trim_end_matches('/').to_string();
    let action = path.trim_start_matches(&format!("{ADMIN_PREFIX}/api/")).to_string();
    let method = request.method().clone();
    let loopback = request
        .extensions()
        .get::<ConnectInfo<SocketAddr>>()
        .map(|info| info.0.ip().is_loopback())
        .unwrap_or(false);
    if action == "login" {
        return login(&app, request, loopback).await;
    }
    if action == "logout" {
        return json_status(StatusCode::OK, json!({"ok": true}), Some(clear_cookie()));
    }
    if !allowed(&app, &request) {
        return admin_error(StatusCode::UNAUTHORIZED, "请先登录管理网页");
    }
    if action == "state" || action == "tags" || action == "official-adjust" {
        if method != axum::http::Method::GET {
            if action == "official-adjust" && method == axum::http::Method::POST {
                // fall through to POST handlers below
            } else {
                return admin_error(StatusCode::METHOD_NOT_ALLOWED, "方法不允许");
            }
        } else {
            let body = if action == "state" {
                state(&app)
            } else if action == "official-adjust" {
                let files = list_official_files(&app);
                json!({"files": files, "categories": official_categories(&files)})
            } else {
                match tags(&app).await {
                    Ok(body) => body,
                    Err((status, detail)) => return admin_error(status, &detail),
                }
            };
            return json_ok(body);
        }
    }
    if method != axum::http::Method::POST {
        return admin_error(StatusCode::METHOD_NOT_ALLOWED, "方法不允许");
    }
    let result = match action.as_str() {
        "version" => version(&app, request).await,
        "rebuild" => rebuild(&app).await,
        "connection" => connection(&app, request).await,
        "detect-wan" => detect_wan(&app).await,
        "open-wan" => open_wan(&app).await,
        "private" => add_private(&app, request).await,
        "private/remove" => remove_private(&app, request).await,
        "private/side" => private_side(&app, request).await,
        "private/folder" => private_folder(&app, request).await,
        "official-adjust" => save_official_adjust(&app, request).await,
        _ => Err((StatusCode::NOT_FOUND, "页面不存在".into())),
    };
    match result {
        Ok(body) => json_ok(body),
        Err((status, detail)) => admin_error(status, &detail),
    }
}

async fn login(app: &App, request: Request<Body>, loopback: bool) -> Response {
    if request.method() != axum::http::Method::POST {
        return admin_error(StatusCode::METHOD_NOT_ALLOWED, "方法不允许");
    }
    let bytes = axum::body::to_bytes(request.into_body(), 1 << 20).await.unwrap_or_default();
    let token = serde_json::from_slice::<Value>(&bytes)
        .ok()
        .and_then(|doc| doc.get("token").and_then(|value| value.as_str()).map(|value| value.trim().to_string()))
        .unwrap_or_default();
    let expected = cfg_field(&app.config, "admin_token");
    if !expected.is_empty() {
        if !constant_eq(token.as_bytes(), expected.as_bytes()) {
            return admin_error(StatusCode::UNAUTHORIZED, "网页令牌不正确");
        }
    } else if !loopback {
        return admin_error(StatusCode::UNAUTHORIZED, "请先登录管理网页");
    }
    let cookie_value = if token.is_empty() { "local".to_string() } else { token };
    json_status(StatusCode::OK, json!({"ok": true}), Some(set_cookie(&cookie_value)))
}

fn allowed(app: &App, request: &Request<Body>) -> bool {
    let expected = cfg_field(&app.config, "admin_token");
    if expected.is_empty() {
        return request
            .extensions()
            .get::<ConnectInfo<SocketAddr>>()
            .map(|info| info.0.ip().is_loopback())
            .unwrap_or(false);
    }
    let header = request
        .headers()
        .get("x-cdr-admin-token")
        .and_then(|value| value.to_str().ok())
        .unwrap_or("")
        .trim()
        .to_string();
    if !header.is_empty() {
        return constant_eq(header.as_bytes(), expected.as_bytes());
    }
    constant_eq(cookie_value(request).as_bytes(), expected.as_bytes())
}

fn state(app: &App) -> Value {
    let meta = fs_json(&app.data.join("manifests").join("meta.json"));
    let mut version = meta.get("official_version").and_then(|value| value.as_str()).unwrap_or("").to_string();
    if version.is_empty() {
        version = cfg_field(&app.config, "version");
    }
    let progress = app.admin.progress_snapshot();
    let inner = app.admin.inner.lock().expect("admin");
    let mut host = inner.listen.clone();
    if host == "0.0.0.0" || host == "::" {
        host = "127.0.0.1".into();
    }
    let root = private_root(app);
    let official_files = list_official_files(app);
    let official_categories = official_categories(&official_files);
    json!({
        "official_version": version,
        "github_repo": cfg_field(&app.config, "github_repo"),
        "listen": inner.listen,
        "port": inner.port,
        "public_url": cfg_field(&app.config, "public_url"),
        // Never echo raw tokens — XSS / proxy / log leakage risk.
        "access_token": "",
        "server_access_token": "",
        "token_enabled": !cfg_field(&app.config, "admin_token").is_empty(),
        "sync_token_enabled": !cfg_field(&app.config, "access_token").is_empty(),
        "server_sync_token_enabled": !cfg_field(&app.config, "server_access_token").is_empty(),
        "busy": inner.busy,
        "progress": progress,
        "admin_url": format!("http://{host}:{}/admin/ifgfsgfbijuzoxzq", inner.port),
        "client_fingerprint": meta.get("client_fingerprint").cloned().unwrap_or(Value::Null),
        "server_fingerprint": meta.get("server_fingerprint").cloned().unwrap_or(Value::Null),
        "servers": load_servers(&app.data),
        "privates": list_privates(&root),
        "private_folders": private_folders(&root),
        "official_files": official_files,
        "official_categories": official_categories,
        "logs": inner.logs,
    })
}

fn idle_progress() -> Value {
    json!({"active": false, "label": "", "done": 0, "total": -1, "index": 0, "count": 0, "percent": -1, "speed": 0, "text": ""})
}

fn progress_text(label: &str, done: i64, total: i64, percent: i64, speed: i64) -> String {
    let mut text = label.to_string();
    if percent >= 0 {
        text.push_str(&format!("  {percent}%  {}/{}", format_size(done), format_size(total)));
    } else if done > 0 {
        text.push_str(&format!("  {}", format_size(done)));
    }
    if speed > 0 {
        text.push_str(&format!("  {}/s", format_size(speed)));
    } else if total > 0 && done < total {
        text.push_str("  连接中");
    }
    text.trim().to_string()
}

fn format_size(bytes: i64) -> String {
    let bytes = bytes.max(0) as f64;
    if bytes < 1024.0 {
        return format!("{} B", bytes as i64);
    }
    if bytes < 1024.0 * 1024.0 {
        return format!("{:.1} KB", bytes / 1024.0);
    }
    if bytes < 1024.0 * 1024.0 * 1024.0 {
        return format!("{:.1} MB", bytes / 1048576.0);
    }
    format!("{:.2} GB", bytes / 1073741824.0)
}

async fn tags(app: &App) -> Result<Value, (StatusCode, String)> {
    let repo = nonempty(cfg_field(&app.config, "github_repo"), "Jasons-impart/Create-Delight-Remake");
    let api = nonempty(cfg_field(&app.config, "github_api"), "https://api.github.com");
    let url = format!("{}/repos/{repo}/releases?per_page=50", api.trim_end_matches('/'));
    let body = tokio::task::spawn_blocking(move || http_get(&url))
        .await
        .map_err(|error| (StatusCode::BAD_GATEWAY, error.to_string()))?
        .map_err(|error| (StatusCode::BAD_GATEWAY, format!("无法连接 GitHub: {error}")))?;
    let releases: Vec<Value> = serde_json::from_str(&body).map_err(|error| (StatusCode::BAD_GATEWAY, error.to_string()))?;
    let tags: Vec<&str> = releases.iter().filter_map(|item| item.get("tag_name").and_then(|value| value.as_str())).collect();
    Ok(json!({"tags": tags, "current": cfg_field(&app.config, "version")}))
}

async fn version(app: &App, request: Request<Body>) -> Result<Value, (StatusCode, String)> {
    #[derive(Deserialize)]
    struct BodyTag { tag: Option<String> }
    let bytes = axum::body::to_bytes(request.into_body(), 1 << 20).await.unwrap_or_default();
    let tag = serde_json::from_slice::<BodyTag>(&bytes).ok().and_then(|body| body.tag).unwrap_or_default();
    let tag = tag.trim().to_string();
    if tag.is_empty() {
        return Err((StatusCode::CONFLICT, "版本不能为空".into()));
    }
    set_field(&app.config, "version", &tag).map_err(|error| (StatusCode::CONFLICT, error))?;
    app.admin.note(format!("已切换官方版本为 {tag}"));
    run_build(app).await?;
    Ok(json!({"ok": true, "official_version": tag}))
}

async fn rebuild(app: &App) -> Result<Value, (StatusCode, String)> {
    app.admin.note("正在重新构建仓库");
    run_build(app).await?;
    app.admin.note("仓库已重新构建");
    Ok(json!({"ok": true}))
}

async fn run_build(app: &App) -> Result<(), (StatusCode, String)> {
    {
        let mut inner = app.admin.inner.lock().expect("admin");
        if inner.busy {
            return Err((StatusCode::CONFLICT, "正在处理上一项操作，请稍候".into()));
        }
        inner.busy = true;
    }
    let config = app.config.clone();
    let admin = Arc::clone(&app.admin);
    let result = tokio::task::spawn_blocking(move || java_build(&config, &admin)).await;
    app.admin.progress_end();
    app.admin.inner.lock().expect("admin").busy = false;
    result.map_err(|error| (StatusCode::CONFLICT, error.to_string()))?.map_err(|error| (StatusCode::CONFLICT, error))?;
    Ok(())
}

fn java_build(config: &Path, admin: &Admin) -> Result<(), String> {
    super::build::build_repos(config, admin)
}

async fn connection(app: &App, request: Request<Body>) -> Result<Value, (StatusCode, String)> {
    #[derive(Deserialize)]
    struct BodyConn {
        listen: Option<String>,
        port: Option<i64>,
        public_url: Option<String>,
        access_token: Option<String>,
    }
    let bytes = axum::body::to_bytes(request.into_body(), 1 << 20).await.unwrap_or_default();
    let body: BodyConn = serde_json::from_slice(&bytes).map_err(|error| (StatusCode::CONFLICT, error.to_string()))?;
    let port = body.port.unwrap_or(0);
    if port <= 0 {
        return Err((StatusCode::CONFLICT, "端口必须是数字".into()));
    }
    let listen = nonempty(body.listen.unwrap_or_default(), "127.0.0.1");
    let mut url = body.public_url.unwrap_or_default().trim().to_string();
    if url.is_empty() {
        let host = if listen == "0.0.0.0" || listen == "::" { "127.0.0.1" } else { listen.as_str() };
        url = format!("http://{host}:{port}");
    }
    // Blank means keep the existing token (state no longer echoes it).
    let mut token = body.access_token.unwrap_or_default().trim().to_string();
    if token.is_empty() {
        token = cfg_field(&app.config, "access_token");
    }
    let admin_token = cfg_field(&app.config, "admin_token");
    if !token.is_empty() && !admin_token.is_empty() && token == admin_token {
        return Err((StatusCode::CONFLICT, "访问令牌不能和管理网页令牌相同".into()));
    }
    if listen == "0.0.0.0" || listen == "::" {
        if admin_token.is_empty() {
            return Err((StatusCode::CONFLICT, "对外开放前请先设置管理网页令牌".into()));
        }
        if token.is_empty() {
            return Err((StatusCode::CONFLICT, "对外开放前请先设置访问令牌".into()));
        }
    }
    set_field(&app.config, "listen", &listen).map_err(|error| (StatusCode::CONFLICT, error))?;
    set_field(&app.config, "port", &port.to_string()).map_err(|error| (StatusCode::CONFLICT, error))?;
    set_field(&app.config, "public_url", &url).map_err(|error| (StatusCode::CONFLICT, error))?;
    set_field(&app.config, "access_token", &token).map_err(|error| (StatusCode::CONFLICT, error))?;
    {
        let mut inner = app.admin.inner.lock().expect("admin");
        inner.listen = listen.clone();
        inner.port = port.to_string();
    }
    app.admin.note(format!("客户端/服务端连接地址: {url}"));
    Ok(json!({"ok": true, "listen": listen, "port": port, "public_url": url, "sync_token_enabled": !token.is_empty()}))
}

async fn detect_wan(app: &App) -> Result<Value, (StatusCode, String)> {
    let port = app.admin.inner.lock().expect("admin").port.clone();
    let public_ip = tokio::task::spawn_blocking(|| {
        http_get("https://api.ipify.org").or_else(|_| http_get("https://ifconfig.me/ip")).unwrap_or_default()
    })
    .await
    .unwrap_or_default();
    let public_ip = public_ip.trim().to_string();
    let suggested = if public_ip.parse::<std::net::IpAddr>().is_ok() {
        format!("http://{public_ip}:{port}")
    } else {
        String::new()
    };
    app.admin.note(format!("建议地址 {suggested}"));
    Ok(json!({"public_ip": public_ip, "suggested_url": suggested, "addresses": []}))
}

async fn open_wan(app: &App) -> Result<Value, (StatusCode, String)> {
    let admin_token = cfg_field(&app.config, "admin_token");
    let access_token = cfg_field(&app.config, "access_token");
    if admin_token.is_empty() {
        return Err((StatusCode::CONFLICT, "对外开放前请先设置管理网页令牌".into()));
    }
    if access_token.is_empty() {
        return Err((StatusCode::CONFLICT, "对外开放前请先设置访问令牌".into()));
    }
    if access_token == admin_token {
        return Err((StatusCode::CONFLICT, "访问令牌不能和管理网页令牌相同".into()));
    }
    let report = detect_wan(app).await?;
    let url = report.get("suggested_url").and_then(|value| value.as_str()).unwrap_or("").to_string();
    if url.is_empty() {
        return Err((StatusCode::CONFLICT, "没有检测到公网地址".into()));
    }
    let port = app.admin.inner.lock().expect("admin").port.clone();
    set_field(&app.config, "listen", "0.0.0.0").map_err(|error| (StatusCode::CONFLICT, error))?;
    set_field(&app.config, "public_url", &url).map_err(|error| (StatusCode::CONFLICT, error))?;
    app.admin.inner.lock().expect("admin").listen = "0.0.0.0".into();
    Ok(json!({"ok": true, "listen": "0.0.0.0", "public_url": url, "port": port}))
}

async fn add_private(app: &App, request: Request<Body>) -> Result<Value, (StatusCode, String)> {
    let mut multipart = Multipart::from_request(request, app)
        .await
        .map_err(|error| (StatusCode::CONFLICT, error.to_string()))?;
    let mut dest = String::new();
    let mut side = String::new();
    let mut name = String::new();
    let mut bytes = Vec::new();
    while let Some(field) = multipart.next_field().await.map_err(|error| (StatusCode::CONFLICT, error.to_string()))? {
        match field.name().unwrap_or("") {
            "dest" => dest = field.text().await.unwrap_or_default(),
            "side" => side = field.text().await.unwrap_or_default(),
            "file" => {
                name = field.file_name().unwrap_or("").to_string();
                let file = field.bytes().await.map_err(|error| (StatusCode::CONFLICT, error.to_string()))?;
                if bytes.len() + file.len() > 200 * 1024 * 1024 {
                    return Err((StatusCode::CONFLICT, "私货文件不能超过 200MB".into()));
                }
                bytes.extend_from_slice(&file);
            }
            _ => {}
        }
    }
    if bytes.is_empty() {
        return Err((StatusCode::CONFLICT, "请选择要上传的私货文件".into()));
    }
    let rel = posix_rel(if dest.is_empty() { &name } else { &dest }).map_err(|error| (StatusCode::CONFLICT, error))?;
    let target = private_file(app, &rel)?;
    if let Some(parent) = target.parent() {
        std::fs::create_dir_all(parent).map_err(|error| (StatusCode::CONFLICT, error.to_string()))?;
    }
    std::fs::write(&target, &bytes).map_err(|error| (StatusCode::CONFLICT, error.to_string()))?;
    write_side(&target, side.trim())?;
    app.admin.note(format!("已添加私货 {rel}"));
    Ok(json!({"ok": true}))
}

async fn remove_private(app: &App, request: Request<Body>) -> Result<Value, (StatusCode, String)> {
    let rel = json_path(request).await?;
    let target = private_file(app, &rel)?;
    std::fs::remove_file(&target).map_err(|_| (StatusCode::CONFLICT, format!("找不到私货: {rel}")))?;
    let _ = std::fs::remove_file(side_path(&target));
    app.admin.note(format!("已删除私货 {rel}"));
    Ok(json!({"ok": true}))
}

async fn private_side(app: &App, request: Request<Body>) -> Result<Value, (StatusCode, String)> {
    #[derive(Deserialize)]
    struct BodySide { path: Option<String>, side: Option<String> }
    let bytes = axum::body::to_bytes(request.into_body(), 1 << 20).await.unwrap_or_default();
    let body: BodySide = serde_json::from_slice(&bytes).map_err(|error| (StatusCode::CONFLICT, error.to_string()))?;
    let rel = posix_rel(body.path.unwrap_or_default().trim()).map_err(|error| (StatusCode::CONFLICT, error))?;
    let target = private_file(app, &rel)?;
    if !target.is_file() {
        return Err((StatusCode::CONFLICT, format!("找不到私货: {rel}")));
    }
    let side = body.side.unwrap_or_default();
    write_side(&target, side.trim())?;
    app.admin.note(format!("已将 {rel} 改为 {}", side.trim()));
    Ok(json!({"ok": true}))
}

async fn private_folder(app: &App, request: Request<Body>) -> Result<Value, (StatusCode, String)> {
    let rel = json_path(request).await?.trim_matches('/').to_string();
    let rel = posix_rel(&rel).map_err(|error| (StatusCode::CONFLICT, error))?;
    let target = private_file(app, &rel)?;
    std::fs::create_dir_all(&target).map_err(|error| (StatusCode::CONFLICT, error.to_string()))?;
    app.admin.note(format!("已创建目录 {rel}"));
    Ok(json!({"ok": true, "path": format!("{rel}/")}))
}

async fn json_path(request: Request<Body>) -> Result<String, (StatusCode, String)> {
    let bytes = axum::body::to_bytes(request.into_body(), 1 << 20).await.unwrap_or_default();
    let doc: Value = serde_json::from_slice(&bytes).map_err(|error| (StatusCode::CONFLICT, error.to_string()))?;
    posix_rel(doc.get("path").and_then(|value| value.as_str()).unwrap_or("").trim()).map_err(|error| (StatusCode::CONFLICT, error))
}

fn write_side(target: &Path, side: &str) -> Result<(), (StatusCode, String)> {
    let path = side_path(target);
    if side.is_empty() || side == "auto" {
        let _ = std::fs::remove_file(path);
        return Ok(());
    }
    std::fs::write(path, side).map_err(|error| (StatusCode::CONFLICT, error.to_string()))
}

fn side_path(target: &Path) -> PathBuf {
    PathBuf::from(format!("{}.side", target.display()))
}

fn private_file(app: &App, rel: &str) -> Result<PathBuf, (StatusCode, String)> {
    let root = private_root(app).join("files");
    std::fs::create_dir_all(&root).map_err(|error| (StatusCode::CONFLICT, error.to_string()))?;
    let target = root.join(rel);
    let clean_root = std::fs::canonicalize(&root).map_err(|error| (StatusCode::CONFLICT, error.to_string()))?;
    if let Some(parent) = target.parent() {
        std::fs::create_dir_all(parent).map_err(|error| (StatusCode::CONFLICT, error.to_string()))?;
        let clean_parent = std::fs::canonicalize(parent).map_err(|error| (StatusCode::CONFLICT, error.to_string()))?;
        if !clean_parent.starts_with(&clean_root) {
            return Err((StatusCode::CONFLICT, "私货路径不能跳出 files 目录".into()));
        }
    }
    Ok(target)
}

fn private_root(app: &App) -> PathBuf {
    let dir = cfg_field(&app.config, "overlay_dir");
    let dir = if dir.is_empty() { "./private".to_string() } else { dir };
    let path = PathBuf::from(&dir);
    if path.is_absolute() {
        path
    } else {
        app.config.parent().unwrap_or(Path::new(".")).join(path)
    }
}

fn list_privates(root: &Path) -> Vec<Value> {
    let mut rows = Vec::new();
    let files = root.join("files");
    let Ok(walk) = std::fs::read_dir(&files) else { return rows };
    visit_files(&files, &files, walk, &mut rows);
    rows
}

fn visit_files(files: &Path, dir: &Path, walk: std::fs::ReadDir, rows: &mut Vec<Value>) {
    for entry in walk.flatten() {
        let path = entry.path();
        if path.is_dir() {
            if let Ok(next) = std::fs::read_dir(&path) {
                visit_files(files, &path, next, rows);
            }
            continue;
        }
        let name = entry.file_name().to_string_lossy().to_string();
        if name.ends_with(".side") || name.ends_with(".pw.toml") {
            continue;
        }
        let rel = path.strip_prefix(files).unwrap_or(&path).to_string_lossy().replace('\\', "/");
        let side = std::fs::read_to_string(format!("{}.side", path.display())).unwrap_or_else(|_| "auto".into());
        let side = side.trim().to_string();
        let folder = path.parent().unwrap_or(dir).strip_prefix(files).ok().map(|value| value.to_string_lossy().replace('\\', "/")).unwrap_or_default();
        let folder = if folder.is_empty() { "./".into() } else { format!("{folder}/") };
        rows.push(json!({
            "path": rel,
            "folder": folder,
            "side": if side.is_empty() { "auto".into() } else { side.clone() },
            "side_label": side_label(if side.is_empty() { "auto" } else { &side }),
            "source": path.display().to_string(),
        }));
    }
}

fn private_folders(root: &Path) -> Vec<String> {
    let mut found = Vec::new();
    let files = root.join("files");
    if let Ok(walk) = std::fs::read_dir(&files) {
        visit_dirs(&files, walk, &mut found);
    }
    found
}

fn visit_dirs(files: &Path, walk: std::fs::ReadDir, found: &mut Vec<String>) {
    for entry in walk.flatten() {
        if !entry.path().is_dir() {
            continue;
        }
        if let Ok(rel) = entry.path().strip_prefix(files) {
            found.push(format!("{}/", rel.to_string_lossy().replace('\\', "/")));
        }
        if let Ok(next) = std::fs::read_dir(entry.path()) {
            visit_dirs(files, next, found);
        }
    }
}

fn side_label(side: &str) -> &'static str {
    match side {
        "client" => "仅客户端",
        "server" => "仅服务端",
        "both" => "两端",
        _ => "自动判定",
    }
}

async fn save_official_adjust(app: &App, request: Request<Body>) -> Result<Value, (StatusCode, String)> {
    {
        let inner = app.admin.inner.lock().expect("admin");
        if inner.busy {
            return Err((StatusCode::CONFLICT, "正在处理上一项操作，请稍候".into()));
        }
    }
    let bytes = axum::body::to_bytes(request.into_body(), 8 << 20)
        .await
        .map_err(|error| (StatusCode::BAD_REQUEST, error.to_string()))?;
    let doc: Value = serde_json::from_slice(&bytes).map_err(|_| (StatusCode::BAD_REQUEST, "无效的官方包调整数据".into()))?;
    let excludes = doc.get("excludes").and_then(|value| value.as_array()).cloned().unwrap_or_default();
    let root = private_root(app);
    std::fs::create_dir_all(&root).map_err(|error| (StatusCode::CONFLICT, error.to_string()))?;
    let mut out = String::from("# 官方包调整：排除的文件不会进入客户端/服务端仓库与清单。\n# side: both / client / server\n\n");
    let mut seen = std::collections::HashSet::new();
    let mut count = 0usize;
    for row in excludes {
        let path = row.get("path").and_then(|value| value.as_str()).unwrap_or("").trim().replace('\\', "/");
        if path.is_empty() || path.contains("..") || Path::new(&path).is_absolute() {
            continue;
        }
        let side = normalize_adjust_side(row.get("side").and_then(|value| value.as_str()).unwrap_or("both"));
        let key = format!("{path}|{side}");
        if !seen.insert(key) {
            continue;
        }
        out.push_str("[[exclude]]\n");
        out.push_str(&format!("path = {}\n", toml_quote(&path)));
        out.push_str(&format!("side = {}\n\n", toml_quote(side)));
        count += 1;
    }
    std::fs::write(root.join("official-adjust.toml"), out).map_err(|error| (StatusCode::CONFLICT, error.to_string()))?;
    app.admin.note(format!("已保存官方包调整规则 {count} 条"));
    Ok(json!({"ok": true, "count": count}))
}

fn list_official_files(app: &App) -> Vec<Value> {
    let sides = load_official_side_map(&app.data);
    let (excluded, exclude_side) = load_official_adjust(&private_root(app));
    let mut rows = Vec::new();
    for (path, side) in sides {
        if path.ends_with(".pw.toml") || path.ends_with(".side") {
            continue;
        }
        let is_excluded = excluded.contains(&path);
        rows.push(json!({
            "path": path,
            "side": side,
            "category": category_of(&path),
            "kind": kind_of(&path),
            "excluded": is_excluded,
            "exclude_side": if is_excluded { exclude_side.get(&path).cloned().unwrap_or_else(|| "both".into()) } else { String::new() },
        }));
    }
    rows.sort_by(|a, b| {
        let ca = a.get("category").and_then(|v| v.as_str()).unwrap_or("");
        let cb = b.get("category").and_then(|v| v.as_str()).unwrap_or("");
        ca.to_lowercase().cmp(&cb.to_lowercase()).then_with(|| {
            let pa = a.get("path").and_then(|v| v.as_str()).unwrap_or("");
            let pb = b.get("path").and_then(|v| v.as_str()).unwrap_or("");
            pa.to_lowercase().cmp(&pb.to_lowercase())
        })
    });
    rows
}

fn official_categories(rows: &[Value]) -> Vec<String> {
    let mut out = Vec::new();
    let mut seen = std::collections::HashSet::new();
    for row in rows {
        let cat = row.get("category").and_then(|v| v.as_str()).unwrap_or("根目录").to_string();
        if seen.insert(cat.clone()) {
            out.push(cat);
        }
    }
    out
}

fn load_official_side_map(data: &Path) -> Vec<(String, String)> {
    let mut out = Vec::new();
    let map = fs_json(&data.join("manifests").join("official-side-map.json"));
    if let Some(obj) = map.as_object() {
        for (k, v) in obj {
            out.push((k.replace('\\', "/"), v.as_str().unwrap_or("both").to_string()));
        }
        return out;
    }
    for side in ["client", "server"] {
        let root = data.join("repos").join(side);
        if let Ok(walk) = std::fs::read_dir(&root) {
            collect_repo_files(&root, walk, &mut out);
        }
    }
    out
}

fn collect_repo_files(root: &Path, walk: std::fs::ReadDir, out: &mut Vec<(String, String)>) {
    for entry in walk.flatten() {
        let path = entry.path();
        if path.is_dir() {
            if let Ok(next) = std::fs::read_dir(&path) {
                collect_repo_files(root, next, out);
            }
            continue;
        }
        let rel = path.strip_prefix(root).unwrap_or(&path).to_string_lossy().replace('\\', "/");
        if rel.ends_with(".pw.toml") || rel.ends_with(".side") {
            continue;
        }
        if !out.iter().any(|(p, _)| p == &rel) {
            out.push((rel, "both".into()));
        }
    }
}

fn load_official_adjust(root: &Path) -> (std::collections::HashSet<String>, std::collections::HashMap<String, String>) {
    let mut excluded = std::collections::HashSet::new();
    let mut sides = std::collections::HashMap::new();
    let Ok(text) = std::fs::read_to_string(root.join("official-adjust.toml")) else {
        return (excluded, sides);
    };
    let mut path = String::new();
    let mut side = String::new();
    let mut in_exclude = false;
    let mut flush = |path: &mut String, side: &mut String, excluded: &mut std::collections::HashSet<String>, sides: &mut std::collections::HashMap<String, String>| {
        if path.is_empty() {
            return;
        }
        let p = path.replace('\\', "/");
        let s = normalize_adjust_side(side).to_string();
        excluded.insert(p.clone());
        sides.insert(p, s);
        path.clear();
        side.clear();
    };
    for line in text.lines() {
        let mut trim = line.trim();
        if let Some(i) = trim.find('#') {
            trim = trim[..i].trim();
        }
        if trim.is_empty() {
            continue;
        }
        if trim == "[[exclude]]" {
            flush(&mut path, &mut side, &mut excluded, &mut sides);
            in_exclude = true;
            continue;
        }
        if trim.starts_with('[') {
            flush(&mut path, &mut side, &mut excluded, &mut sides);
            in_exclude = false;
            continue;
        }
        if !in_exclude {
            continue;
        }
        if trim.starts_with("path") {
            path = toml_line_value(trim);
        } else if trim.starts_with("side") {
            side = toml_line_value(trim);
        }
    }
    flush(&mut path, &mut side, &mut excluded, &mut sides);
    (excluded, sides)
}

fn normalize_adjust_side(side: &str) -> &'static str {
    let s = side.trim();
    if s.eq_ignore_ascii_case("client") {
        "client"
    } else if s.eq_ignore_ascii_case("server") {
        "server"
    } else {
        "both"
    }
}

fn category_of(path: &str) -> String {
    let rel = path.replace('\\', "/");
    match rel.find('/') {
        Some(i) if i > 0 => rel[..i].to_string(),
        _ => "根目录".into(),
    }
}

fn kind_of(path: &str) -> &'static str {
    let rel = path.replace('\\', "/").to_ascii_lowercase();
    if rel.starts_with("mods/") && rel.ends_with(".jar") {
        "mod"
    } else if rel.starts_with("config/") || rel.starts_with("defaultconfigs/") {
        "config"
    } else if rel.starts_with("kubejs/") {
        "kubejs"
    } else if rel.starts_with("resourcepacks/") || rel.starts_with("shaderpacks/") {
        "resource"
    } else if rel.starts_with("libraries/") {
        "library"
    } else {
        "other"
    }
}

fn toml_quote(value: &str) -> String {
    format!("\"{}\"", value.replace('\\', "\\\\").replace('"', "\\\""))
}

fn toml_line_value(line: &str) -> String {
    let Some((_, raw)) = line.split_once('=') else { return String::new() };
    let value = raw.trim();
    if value.starts_with('"') && value.ends_with('"') && value.len() >= 2 {
        value[1..value.len() - 1].replace("\\\"", "\"").replace("\\\\", "\\")
    } else {
        value.to_string()
    }
}

fn load_servers(data: &Path) -> Value {
    let doc = fs_json(&data.join("server-connections.json"));
    doc.get("servers").cloned().unwrap_or_else(|| json!([]))
}

fn fs_json(path: &Path) -> Value {
    std::fs::read(path).ok().and_then(|buf| serde_json::from_slice(&buf).ok()).unwrap_or_else(|| json!({}))
}

fn posix_rel(path: &str) -> Result<String, String> {
    let path = path.replace('\\', "/");
    if path.is_empty() || path.contains("..") || path.starts_with('/') {
        return Err("无效的游戏内路径".into());
    }
    Ok(path.trim_start_matches("./").to_string())
}

fn cfg_field(config: &Path, key: &str) -> String {
    let Ok(text) = std::fs::read_to_string(config) else { return String::new() };
    for line in text.lines() {
        let line = line.trim();
        if line.starts_with(key) && line[key.len()..].trim_start().starts_with('=') {
            return crate::serve::toml_value(line).unwrap_or_default();
        }
    }
    String::new()
}

fn set_field(config: &Path, key: &str, value: &str) -> Result<(), String> {
    let text = std::fs::read_to_string(config).unwrap_or_default();
    let mut lines: Vec<String> = text.lines().map(|line| line.to_string()).collect();
    let rendered = if key == "port" {
        format!("{key} = {value}")
    } else {
        format!("{key} = \"{}\"", value.replace('"', ""))
    };
    let mut found = false;
    for line in &mut lines {
        let trim = line.trim();
        if trim.starts_with(key) && trim[key.len()..].trim_start().starts_with('=') {
            *line = rendered.clone();
            found = true;
            break;
        }
    }
    if !found {
        lines.push(rendered);
    }
    let mut file = std::fs::OpenOptions::new().create(true).write(true).truncate(true).open(config).map_err(|error| error.to_string())?;
    file.write_all(lines.join("\n").as_bytes()).map_err(|error| error.to_string())?;
    if !text.ends_with('\n') && !lines.is_empty() {
        file.write_all(b"\n").map_err(|error| error.to_string())?;
    }
    Ok(())
}

fn http_get(url: &str) -> Result<String, String> {
    let response = reqwest::blocking::Client::builder()
        .timeout(std::time::Duration::from_secs(20))
        .user_agent("cdr-updater")
        .build()
        .map_err(|error| error.to_string())?
        .get(url)
        .header("Accept", "application/vnd.github+json")
        .send()
        .map_err(|error| error.to_string())?;
    if !response.status().is_success() {
        return Err(format!("GitHub API 失败: {}", response.status()));
    }
    response.text().map_err(|error| error.to_string())
}

fn nonempty(value: String, fallback: &str) -> String {
    let value = value.trim().to_string();
    if value.is_empty() { fallback.into() } else { value }
}

fn constant_eq(left: &[u8], right: &[u8]) -> bool {
    if left.len() != right.len() {
        return false;
    }
    let mut diff = 0_u8;
    for (a, b) in left.iter().zip(right) {
        diff |= a ^ b;
    }
    diff == 0
}

fn cookie_value(request: &Request<Body>) -> String {
    request
        .headers()
        .get(header::COOKIE)
        .and_then(|value| value.to_str().ok())
        .unwrap_or("")
        .split(';')
        .filter_map(|part| part.trim().strip_prefix("cdr_admin="))
        .next()
        .unwrap_or("")
        .to_string()
}

fn set_cookie(token: &str) -> String {
    format!("cdr_admin={token}; Path={ADMIN_PREFIX}; HttpOnly; SameSite=Lax")
}

fn clear_cookie() -> String {
    format!("cdr_admin=; Path={ADMIN_PREFIX}; HttpOnly; SameSite=Lax; Max-Age=0")
}

fn json_ok(body: Value) -> Response {
    json_status(StatusCode::OK, body, None)
}

fn json_status(status: StatusCode, body: Value, cookie: Option<String>) -> Response {
    let mut response = (status, [(header::CACHE_CONTROL, "no-store"), (header::CONTENT_TYPE, "application/json; charset=utf-8")], axum::Json(body)).into_response();
    if let Some(cookie) = cookie {
        if let Ok(value) = cookie.parse() {
            response.headers_mut().insert(header::SET_COOKIE, value);
        }
    }
    response
}

fn admin_error(status: StatusCode, detail: &str) -> Response {
    json_status(status, json!({"detail": detail}), None)
}
