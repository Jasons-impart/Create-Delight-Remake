#[path = "admin.rs"]
mod admin;
#[path = "build.rs"]
mod build;

use std::fs::{self, File};
use std::io::{self, Read};
use std::net::SocketAddr;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};

use axum::body::Body;
use axum::extract::{ConnectInfo, Path as UrlPath, Query, State};
use axum::http::{header, HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::routing::{get, post};
use axum::extract::DefaultBodyLimit;
use axum::{Json, Router};
use serde::Deserialize;
use sha2::{Digest, Sha256};
use tokio::sync::mpsc;
use tokio_stream::wrappers::UnboundedReceiverStream;
use tokio_util::io::ReaderStream;
use zip::write::SimpleFileOptions;
use zip::CompressionMethod;

static PACK_BUILD: Mutex<()> = Mutex::new(());
static CONNECTIONS: Mutex<()> = Mutex::new(());
static LEASE_SEQ: AtomicU64 = AtomicU64::new(1);

const MAX_CONN_HOSTNAME: usize = 128;
const MAX_CONN_ID: usize = 128;
const MAX_CONN_PATH: usize = 512;
const MAX_CONN_RECORDS: usize = 500;

#[derive(Clone)]
pub struct App {
    data: PathBuf,
    config: PathBuf,
    overlay: std::collections::HashSet<String>,
    admin: std::sync::Arc<admin::Admin>,
}

pub struct Config {
    pub listen: String,
    pub port: String,
    data_dir: String,
}

impl Config {
    pub fn read(path: &Path) -> Self {
        let mut cfg = Config {
            listen: "127.0.0.1".into(),
            port: "8765".into(),
            data_dir: "data".into(),
        };
        let Ok(text) = fs::read_to_string(path) else {
            return cfg;
        };
        for line in text.lines() {
            let line = line.trim();
            if line.starts_with("listen") {
                if let Some(value) = toml_value(line) {
                    cfg.listen = value;
                }
            } else if line.starts_with("port") {
                if let Some(value) = toml_value(line) {
                    cfg.port = value;
                }
            } else if line.starts_with("data_dir") {
                if let Some(value) = toml_value(line) {
                    cfg.data_dir = value;
                }
            }
        }
        cfg
    }

    pub fn data_dir(&self, config: &Path) -> PathBuf {
        let path = PathBuf::from(&self.data_dir);
        if path.is_absolute() {
            path
        } else {
            config.parent().unwrap_or(Path::new(".")).join(path)
        }
    }
}

pub async fn listen(addr: String, data: PathBuf, config: PathBuf) -> io::Result<()> {
    let version = config_field(&config, "version");
    let tag = if version.is_empty() { config_field(&config, "tag") } else { version };
    match build::reclaim_storage(&data, &tag, true) {
        Ok(report) if !report.is_empty() => println!("{}", report.summary()),
        Err(error) => eprintln!("存储回收失败: {error}"),
        _ => {}
    }
    let settings = Config::read(&config);
    let overlay = load_overlay(&data.join("manifests").join("private-index.json"));
    let app = App {
        admin: admin::Admin::new(settings.listen, settings.port),
        data,
        config,
        overlay,
    };
    let router = Router::new()
        .route("/api/status", get(status))
        .route("/api/manifest", get(manifest))
        .route("/api/file/{digest}", get(file).head(file))
        .route("/api/pack", post(pack).get(pack))
        .route("/admin/ifgfsgfbijuzoxzq", get(admin::page))
        .route("/admin/ifgfsgfbijuzoxzq/", get(admin::page))
        .route("/admin/ifgfsgfbijuzoxzq/api/{*action}", get(admin::api).post(admin::api))
        // Private uploads can be large jars; axum's default 2MB limit rejects multipart early.
        .layer(DefaultBodyLimit::max(200 * 1024 * 1024))
        .with_state(app);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    axum::serve(listener, router.into_make_service_with_connect_info::<std::net::SocketAddr>()).await
}

fn load_overlay(path: &Path) -> std::collections::HashSet<String> {
    let mut out = std::collections::HashSet::new();
    let Ok(buf) = fs::read(path) else {
        return out;
    };
    let Ok(doc) = serde_json::from_slice::<serde_json::Map<String, serde_json::Value>>(&buf) else {
        return out;
    };
    for key in doc.keys() {
        out.insert(posix(key));
    }
    out
}

async fn status(State(app): State<App>, headers: HeaderMap) -> Response {
    if !player_allowed(&app.config, &headers, None) {
        return plain(StatusCode::UNAUTHORIZED, "需要访问令牌");
    }
    let path = app.data.join("manifests").join("meta.json");
    let buf = match fs::read(&path) {
        Ok(buf) => buf,
        Err(_) => return plain(StatusCode::CONFLICT, "更新仓库尚未构建"),
    };
    let doc: serde_json::Value = match serde_json::from_slice(&buf) {
        Ok(doc) => doc,
        Err(_) => return plain(StatusCode::INTERNAL_SERVER_ERROR, "清单损坏"),
    };
    json_no_store(serde_json::json!({
        "official_version": doc.get("official_version").cloned().unwrap_or(serde_json::Value::Null),
        "client_fingerprint": doc.get("client_fingerprint").cloned().unwrap_or(serde_json::Value::Null),
        "server_fingerprint": doc.get("server_fingerprint").cloned().unwrap_or(serde_json::Value::Null),
    }))
}

#[derive(Deserialize)]
struct SideQuery {
    side: Option<String>,
}

async fn manifest(State(app): State<App>, ConnectInfo(peer): ConnectInfo<SocketAddr>, headers: HeaderMap, Query(query): Query<SideQuery>) -> Response {
    let Some(side) = query.side.as_deref() else {
        return plain(StatusCode::BAD_REQUEST, "side 只能是 client 或 server");
    };
    if side != "client" && side != "server" {
        return plain(StatusCode::BAD_REQUEST, "side 只能是 client 或 server");
    }
    if !player_allowed(&app.config, &headers, Some(side)) {
        return plain(StatusCode::UNAUTHORIZED, "需要访问令牌");
    }
    note_server(&app.data, &headers, &peer, side);
    match app.manifest_body(side) {
        Ok(body) => (
            StatusCode::OK,
            [
                (header::CONTENT_TYPE, "application/json; charset=utf-8"),
                (header::CACHE_CONTROL, "no-store"),
            ],
            body,
        )
            .into_response(),
        Err(error) => plain(StatusCode::CONFLICT, &error),
    }
}

impl App {
    fn manifest_body(&self, side: &str) -> Result<Vec<u8>, String> {
        let path = self.data.join("manifests").join(format!("{side}.json"));
        let buf = fs::read(&path).map_err(|_| format!("尚未构建 {side} 清单"))?;
        let mut doc: serde_json::Value = serde_json::from_slice(&buf).map_err(|error| error.to_string())?;
        if let Some(files) = doc.get_mut("files").and_then(|value| value.as_array_mut()) {
            for file in files {
                let Some(path) = file.get("path").and_then(|value| value.as_str()) else {
                    continue;
                };
                if load_overlay(&self.data.join("manifests").join("private-index.json")).contains(&posix(path)) {
                    if let Some(object) = file.as_object_mut() {
                        object.insert("overlay".into(), serde_json::Value::Bool(true));
                    }
                }
            }
        }
        serde_json::to_vec(&doc).map_err(|error| error.to_string())
    }
}

async fn file(State(app): State<App>, UrlPath(digest): UrlPath<String>, headers: HeaderMap) -> Response {
    if !player_allowed(&app.config, &headers, None) {
        return plain(StatusCode::UNAUTHORIZED, "需要访问令牌");
    }
    let digest = digest.trim().to_ascii_lowercase();
    if !is_sha256(&digest) {
        return plain(StatusCode::BAD_REQUEST, "无效文件哈希");
    }
    let object = app.data.join("objects").join(&digest[..2]).join(&digest);
    let meta = match fs::metadata(&object) {
        Ok(meta) if meta.is_file() => meta,
        _ => return plain(StatusCode::NOT_FOUND, "文件对象不存在"),
    };
    let size = meta.len();
    let mut response = Response::builder()
        .header(header::CONTENT_TYPE, "application/octet-stream")
        .header(header::CACHE_CONTROL, "public, max-age=31536000, immutable")
        .header(header::ETAG, format!("\"{digest}\""))
        .header(header::ACCEPT_RANGES, "bytes");
    let range = headers.get(header::RANGE).and_then(|value| value.to_str().ok());
    let (status, start, len) = match range {
        None => (StatusCode::OK, 0, size),
        Some(value) => match parse_range(value, size) {
            Range::Ignore => (StatusCode::OK, 0, size),
            Range::Bytes { start, end } => {
                let len = end - start + 1;
                response = response
                    .header(header::CONTENT_RANGE, format!("bytes {start}-{end}/{size}"));
                (StatusCode::PARTIAL_CONTENT, start, len)
            }
            Range::Unsatisfiable => {
                return (
                    StatusCode::RANGE_NOT_SATISFIABLE,
                    [(header::CONTENT_RANGE, format!("bytes */{size}"))],
                    "请求范围无法满足\n",
                )
                    .into_response();
            }
        },
    };
    let async_file = match tokio::fs::File::open(&object).await {
        Ok(mut file) => {
            use tokio::io::{AsyncReadExt, AsyncSeekExt, SeekFrom};
            if file.seek(SeekFrom::Start(start)).await.is_err() {
                return plain(StatusCode::NOT_FOUND, "文件对象不存在");
            }
            file.take(len)
        }
        Err(_) => return plain(StatusCode::NOT_FOUND, "文件对象不存在"),
    };
    let body = Body::from_stream(ReaderStream::new(async_file));
    response
        .status(status)
        .header(header::CONTENT_LENGTH, len.to_string())
        .body(body)
        .unwrap_or_else(|_| plain(StatusCode::INTERNAL_SERVER_ERROR, "服务器内部错误"))
}

enum Range {
    Ignore,
    Bytes { start: u64, end: u64 },
    Unsatisfiable,
}

fn parse_range(header: &str, size: u64) -> Range {
    let Some(spec) = header.trim().strip_prefix("bytes=") else {
        return Range::Ignore;
    };
    if spec.contains(',') || size == 0 {
        return if spec.contains(',') { Range::Ignore } else { Range::Unsatisfiable };
    }
    let Some((left, right)) = spec.split_once('-') else {
        return Range::Ignore;
    };
    if left.is_empty() {
        let Ok(suffix) = right.parse::<u64>() else {
            return Range::Ignore;
        };
        if suffix == 0 {
            return Range::Unsatisfiable;
        }
        let start = size.saturating_sub(suffix);
        return Range::Bytes { start, end: size - 1 };
    }
    let Ok(start) = left.parse::<u64>() else {
        return Range::Ignore;
    };
    if start >= size {
        return Range::Unsatisfiable;
    }
    let end = if right.is_empty() {
        size - 1
    } else {
        match right.parse::<u64>() {
            Ok(end) => end.min(size - 1),
            Err(_) => return Range::Ignore,
        }
    };
    if end < start {
        return Range::Unsatisfiable;
    }
    Range::Bytes { start, end }
}

#[derive(Deserialize)]
struct PackRequest {
    side: Option<String>,
    paths: Option<Vec<String>>,
    discard: Option<String>,
    lease: Option<String>,
}

async fn pack(
    State(app): State<App>,
    ConnectInfo(peer): ConnectInfo<SocketAddr>,
    headers: HeaderMap,
    Query(query): Query<SideQuery>,
    method: axum::http::Method,
    body: axum::body::Bytes,
) -> Response {
    if method != axum::http::Method::POST && method != axum::http::Method::GET {
        return plain(StatusCode::METHOD_NOT_ALLOWED, "方法不允许");
    }
    let req = if method == axum::http::Method::GET {
        PackRequest {
            side: query.side,
            paths: None,
            discard: None,
            lease: None,
        }
    } else {
        if body.len() > 8 << 20 {
            return plain(StatusCode::BAD_REQUEST, "请求无效");
        }
        match serde_json::from_slice::<PackRequest>(&body) {
            Ok(req) => req,
            Err(_) => return plain(StatusCode::BAD_REQUEST, "请求无效"),
        }
    };
    if let Some(discard) = req.discard.as_deref().filter(|value| !value.is_empty()) {
        if !player_allowed(&app.config, &headers, None) {
            return plain(StatusCode::UNAUTHORIZED, "需要访问令牌");
        }
        let lease = req.lease.as_deref().unwrap_or("").trim().to_string();
        if lease.is_empty() {
            return plain(StatusCode::BAD_REQUEST, "discard 需要 lease");
        }
        let app = app.clone();
        let discard = discard.to_string();
        let result = tokio::task::spawn_blocking(move || {
            let _guard = PACK_BUILD.lock().unwrap_or_else(|error| error.into_inner());
            app.discard_pack(&discard, &lease)
        })
        .await;
        return match result {
            Ok(Ok(())) => json_no_store(serde_json::json!({"ok": true})),
            Ok(Err(error)) => plain(StatusCode::BAD_REQUEST, &error),
            Err(_) => plain(StatusCode::INTERNAL_SERVER_ERROR, "服务器内部错误"),
        };
    }
    let side = req.side.unwrap_or_default();
    if side != "client" && side != "server" {
        return plain(StatusCode::BAD_REQUEST, "side 只能是 client 或 server");
    }
    if !player_allowed(&app.config, &headers, Some(&side)) {
        return plain(StatusCode::UNAUTHORIZED, "需要访问令牌");
    }
    note_server(&app.data, &headers, &peer, &side);
    let files = match app.manifest_files(&side) {
        Ok(files) => files,
        Err(error) => return plain(StatusCode::CONFLICT, &error),
    };
    let mut selected = Vec::new();
    let mut seen = std::collections::HashSet::new();
    for raw in req.paths.unwrap_or_default() {
        let rel = posix(&raw);
        if rel.is_empty() || rel.contains("..") || rel.starts_with('/') {
            return plain(StatusCode::BAD_REQUEST, "无效路径");
        }
        if !seen.insert(rel.clone()) {
            continue;
        }
        let Some(file) = files.iter().find(|file| file.path == rel) else {
            return plain(StatusCode::BAD_REQUEST, &format!("清单中没有 {rel}"));
        };
        selected.push(file.clone());
    }
    if selected.is_empty() {
        return plain(StatusCode::BAD_REQUEST, "没有要打包的文件");
    }
    let (tx, rx) = mpsc::unbounded_channel::<Result<Vec<u8>, std::io::Error>>();
    tokio::task::spawn_blocking(move || {
        let _guard = PACK_BUILD.lock().unwrap_or_else(|error| error.into_inner());
        let send = |value: serde_json::Value| {
            let mut line = serde_json::to_vec(&value).unwrap_or_default();
            line.push(b'\n');
            let _ = tx.send(Ok(line));
        };
        match app.ensure_pack(&selected, |done, total| {
            send(serde_json::json!({"event": "progress", "done": done, "total": total}));
        }) {
            Ok((sha, size, lease)) => {
                send(serde_json::json!({"event": "done", "sha256": sha, "size": size, "lease": lease}))
            }
            Err(error) => send(serde_json::json!({"event": "error", "detail": error})),
        }
    });
    let stream = UnboundedReceiverStream::new(rx);
    Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/x-ndjson; charset=utf-8")
        .header(header::CACHE_CONTROL, "no-store")
        .header("X-Accel-Buffering", "no")
        .body(Body::from_stream(stream))
        .unwrap_or_else(|_| plain(StatusCode::INTERNAL_SERVER_ERROR, "服务器内部错误"))
}

#[derive(Clone)]
struct PackItem {
    path: String,
    sha256: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct PackMeta {
    sha256: String,
    size: u64,
    #[serde(default)]
    holders: i32,
    #[serde(default)]
    leases: Vec<String>,
}

impl App {
    fn manifest_files(&self, side: &str) -> Result<Vec<PackItem>, String> {
        let path = self.data.join("manifests").join(format!("{side}.json"));
        let buf = fs::read(&path).map_err(|_| format!("尚未构建 {side} 清单"))?;
        let doc: serde_json::Value = serde_json::from_slice(&buf).map_err(|error| error.to_string())?;
        let mut out = Vec::new();
        let Some(files) = doc.get("files").and_then(|value| value.as_array()) else {
            return Ok(out);
        };
        for file in files {
            let Some(rel) = file.get("path").and_then(|value| value.as_str()) else {
                continue;
            };
            let rel = posix(rel);
            let Some(sum) = file.get("sha256").and_then(|value| value.as_str()) else {
                continue;
            };
            let sum = sum.trim().to_ascii_lowercase();
            if rel.is_empty() || !is_sha256(&sum) {
                continue;
            }
            out.push(PackItem { path: rel, sha256: sum });
        }
        Ok(out)
    }

    fn ensure_pack(&self, files: &[PackItem], mut report: impl FnMut(usize, usize)) -> Result<(String, u64, String), String> {
        let mut key_hash = Sha256::new();
        for file in files {
            key_hash.update(file.path.as_bytes());
            key_hash.update(b"\n");
            key_hash.update(file.sha256.as_bytes());
            key_hash.update(b"\n");
        }
        let key = hex::encode(key_hash.finalize());
        let meta_path = self.data.join("packs").join(format!("{key}.json"));
        let lease = new_pack_lease(&self.config);
        if let Ok(buf) = fs::read(&meta_path) {
            if let Ok(mut meta) = serde_json::from_slice::<PackMeta>(&buf) {
                if is_sha256(&meta.sha256) {
                    let object = self.data.join("objects").join(&meta.sha256[..2]).join(&meta.sha256);
                    if let Ok(info) = fs::metadata(&object) {
                        if info.is_file() {
                            migrate_pack_leases(&mut meta);
                            meta.leases.push(lease.clone());
                            meta.holders = meta.leases.len() as i32;
                            write_pack_meta(&meta_path, &meta)?;
                            report(files.len(), files.len());
                            return Ok((meta.sha256, info.len(), lease));
                        }
                    }
                }
            }
        }
        fs::create_dir_all(self.data.join("packs")).map_err(|error| error.to_string())?;
        let tmp = self.data.join("packs").join(format!("build-{key}.zip"));
        let result = (|| {
            let file = File::create(&tmp).map_err(|error| error.to_string())?;
            let mut writer = zip::ZipWriter::new(file);
            let options = SimpleFileOptions::default()
                .compression_method(CompressionMethod::Deflated)
                .compression_level(Some(1));
            let total = files.len();
            for (index, file) in files.iter().enumerate() {
                let source = self.data.join("objects").join(&file.sha256[..2]).join(&file.sha256);
                let mut input = File::open(&source).map_err(|error| error.to_string())?;
                writer.start_file(&file.path, options).map_err(|error| error.to_string())?;
                io::copy(&mut input, &mut writer).map_err(|error| error.to_string())?;
                let done = index + 1;
                if done == 1 || done == total || done % 20 == 0 {
                    report(done, total);
                }
            }
            writer.finish().map_err(|error| error.to_string())?;
            let digest = hash_file(&tmp)?;
            let size = fs::metadata(&tmp).map_err(|error| error.to_string())?.len();
            let object = self.data.join("objects").join(&digest[..2]).join(&digest);
            fs::create_dir_all(object.parent().unwrap()).map_err(|error| error.to_string())?;
            if fs::metadata(&object).is_err() {
                fs::rename(&tmp, &object).map_err(|error| error.to_string())?;
            }
            write_pack_meta(
                &meta_path,
                &PackMeta {
                    sha256: digest.clone(),
                    size,
                    holders: 1,
                    leases: vec![lease.clone()],
                },
            )?;
            Ok((digest, size, lease))
        })();
        let _ = fs::remove_file(&tmp);
        result
    }

    fn discard_pack(&self, sum: &str, lease: &str) -> Result<(), String> {
        let sum = sum.trim().to_ascii_lowercase();
        let lease = lease.trim();
        if !is_sha256(&sum) {
            return Err("无效压缩包哈希".into());
        }
        if lease.is_empty() || lease.len() > 128 {
            return Err("无效 lease".into());
        }
        let mut keep_object = false;
        for side in ["client", "server"] {
            let Ok(files) = self.manifest_files(side) else {
                continue;
            };
            if files.iter().any(|file| file.sha256 == sum) {
                keep_object = true;
            }
        }
        let packs = self.data.join("packs");
        let entries = match fs::read_dir(&packs) {
            Ok(entries) => entries,
            Err(error) if error.kind() == io::ErrorKind::NotFound => return Ok(()),
            Err(error) => return Err(error.to_string()),
        };
        let mut holders_left = 0;
        let mut drop = Vec::new();
        let mut matched = false;
        for entry in entries.flatten() {
            let name = entry.file_name();
            let name = name.to_string_lossy();
            if !name.ends_with(".json") || entry.path().is_dir() {
                continue;
            }
            let path = entry.path();
            let Ok(buf) = fs::read(&path) else {
                continue;
            };
            let Ok(mut meta) = serde_json::from_slice::<PackMeta>(&buf) else {
                continue;
            };
            if meta.sha256 != sum {
                continue;
            }
            migrate_pack_leases(&mut meta);
            let before = meta.leases.len();
            meta.leases.retain(|item| item != lease);
            if meta.leases.len() == before {
                holders_left += meta.leases.len();
                continue;
            }
            matched = true;
            meta.holders = meta.leases.len() as i32;
            if !meta.leases.is_empty() {
                holders_left += meta.leases.len();
                write_pack_meta(&path, &meta)?;
                continue;
            }
            drop.push(path);
        }
        if !matched {
            return Err("lease 无效或不匹配".into());
        }
        if holders_left == 0 && !keep_object && !drop.is_empty() {
            let _ = fs::remove_file(self.data.join("objects").join(&sum[..2]).join(&sum));
        }
        for path in drop {
            let _ = fs::remove_file(path);
        }
        Ok(())
    }
}

fn write_pack_meta(path: &Path, meta: &PackMeta) -> Result<(), String> {
    let buf = serde_json::to_vec(meta).map_err(|error| error.to_string())?;
    fs::write(path, buf).map_err(|error| error.to_string())
}

fn hash_file(path: &Path) -> Result<String, String> {
    let mut file = File::open(path).map_err(|error| error.to_string())?;
    let mut hasher = Sha256::new();
    let mut buf = [0_u8; 1024 * 1024];
    loop {
        let n = file.read(&mut buf).map_err(|error| error.to_string())?;
        if n == 0 {
            break;
        }
        hasher.update(&buf[..n]);
    }
    Ok(hex::encode(hasher.finalize()))
}

fn is_sha256(value: &str) -> bool {
    value.len() == 64 && value.bytes().all(|byte| byte.is_ascii_hexdigit()) && !value.contains(['/', '.', '\\'])
}

fn presented_player_token(headers: &HeaderMap) -> String {
    let mut provided = header_value(headers, "x-cdr-token");
    if provided.is_empty() {
        let auth = header_value(headers, "authorization");
        if let Some(rest) = auth.strip_prefix("Bearer ").or_else(|| auth.strip_prefix("bearer ")) {
            provided = rest.trim().to_string();
        }
    }
    provided
}

fn player_allowed(config: &Path, headers: &HeaderMap, side: Option<&str>) -> bool {
    let client_token = config_field(config, "access_token");
    let server_token = config_field(config, "server_access_token");
    let provided = presented_player_token(headers);
    match side {
        Some("server") => {
            let expected = if server_token.is_empty() {
                client_token
            } else {
                server_token
            };
            if expected.is_empty() {
                return true;
            }
            constant_eq(provided.as_bytes(), expected.as_bytes())
        }
        Some("client") => {
            if client_token.is_empty() {
                return true;
            }
            // When server token is configured, refuse using it for client side.
            if !server_token.is_empty() && constant_eq(provided.as_bytes(), server_token.as_bytes()) {
                return false;
            }
            constant_eq(provided.as_bytes(), client_token.as_bytes())
        }
        _ => {
            // status / file / discard: either configured token is enough
            if client_token.is_empty() && server_token.is_empty() {
                return true;
            }
            (!client_token.is_empty() && constant_eq(provided.as_bytes(), client_token.as_bytes()))
                || (!server_token.is_empty() && constant_eq(provided.as_bytes(), server_token.as_bytes()))
        }
    }
}

fn new_pack_lease(config: &Path) -> String {
    let mut hasher = Sha256::new();
    let nanos = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_nanos()).unwrap_or(0);
    hasher.update(nanos.to_le_bytes());
    hasher.update(LEASE_SEQ.fetch_add(1, Ordering::Relaxed).to_le_bytes());
    hasher.update(config_field(config, "access_token").as_bytes());
    hasher.update(config_field(config, "admin_token").as_bytes());
    hex::encode(hasher.finalize())
}

fn migrate_pack_leases(meta: &mut PackMeta) {
    if !meta.leases.is_empty() {
        meta.holders = meta.leases.len() as i32;
        return;
    }
    // Legacy metas only had a counter — treat as zero transferable leases so
    // anonymous discard cannot delete them. Fresh packs always create leases.
    meta.holders = 0;
}

fn config_field(config: &Path, key: &str) -> String {
    let Ok(text) = fs::read_to_string(config) else {
        return String::new();
    };
    for line in text.lines() {
        let line = line.trim();
        if line.starts_with(key) && line[key.len()..].trim_start().starts_with('=') {
            return toml_value(line).unwrap_or_default();
        }
    }
    String::new()
}

fn constant_eq(left: &[u8], right: &[u8]) -> bool {
    if left.len() != right.len() {
        return false;
    }
    left.iter().zip(right.iter()).fold(0_u8, |acc, (a, b)| acc | (a ^ b)) == 0
}

fn note_server(data: &Path, headers: &HeaderMap, peer: &SocketAddr, side: &str) {
    if side != "server" || header_value(headers, "x-cdr-side") != "server" {
        return;
    }
    let _guard = CONNECTIONS.lock().unwrap_or_else(|error| error.into_inner());
    let path = data.join("server-connections.json");
    let mut doc = fs::read(&path)
        .ok()
        .and_then(|buf| serde_json::from_slice::<serde_json::Value>(&buf).ok())
        .unwrap_or_else(|| serde_json::json!({"servers": []}));
    let servers = doc.get_mut("servers").and_then(|value| value.as_array_mut());
    let Some(servers) = servers else {
        return;
    };
    let remote = peer.ip().to_string();
    let mut id = truncate_chars(&header_value(headers, "x-cdr-instance-id"), MAX_CONN_ID);
    let hostname = truncate_chars(&header_value(headers, "x-cdr-hostname"), MAX_CONN_HOSTNAME);
    let instance_path = truncate_chars(
        &decode_base64(&header_value(headers, "x-cdr-instance-path")),
        MAX_CONN_PATH,
    );
    if id.is_empty() {
        let mark = format!("{remote}:{instance_path}");
        id = truncate_chars(&format!("ip:{remote}:{:x}", simple_hash(&mark)), MAX_CONN_ID);
    }
    let now = utc_now();
    if let Some(row) = servers
        .iter_mut()
        .find(|row| row.get("id").and_then(|value| value.as_str()) == Some(id.as_str()))
    {
        let count = row.get("sync_count").and_then(|value| value.as_u64()).unwrap_or(0) + 1;
        let first = row.get("first_seen").and_then(|value| value.as_str()).unwrap_or("").to_string();
        if let Some(object) = row.as_object_mut() {
            if !hostname.is_empty() {
                object.insert("hostname".into(), serde_json::Value::String(hostname));
            }
            if !instance_path.is_empty() {
                object.insert("instance_path".into(), serde_json::Value::String(instance_path));
            }
            if !remote.is_empty() {
                object.insert("remote".into(), serde_json::Value::String(remote));
            }
            if first.is_empty() {
                object.insert("first_seen".into(), serde_json::Value::String(now.clone()));
            }
            object.insert("last_seen".into(), serde_json::Value::String(now));
            object.insert("sync_count".into(), serde_json::Value::from(count));
        }
    } else {
        if servers.len() >= MAX_CONN_RECORDS {
            // Drop oldest by last_seen to bound file growth.
            let mut oldest_idx = 0usize;
            let mut oldest = servers
                .first()
                .and_then(|row| row.get("last_seen").and_then(|v| v.as_str()))
                .unwrap_or("")
                .to_string();
            for (idx, row) in servers.iter().enumerate().skip(1) {
                let stamp = row.get("last_seen").and_then(|v| v.as_str()).unwrap_or("");
                if stamp < oldest.as_str() {
                    oldest = stamp.to_string();
                    oldest_idx = idx;
                }
            }
            servers.remove(oldest_idx);
        }
        servers.push(serde_json::json!({
            "id": id, "hostname": hostname, "instance_path": instance_path, "remote": remote,
            "first_seen": now, "last_seen": now, "sync_count": 1,
        }));
    }
    if let Some(parent) = path.parent() {
        let _ = fs::create_dir_all(parent);
    }
    if let Ok(buf) = serde_json::to_vec_pretty(&doc) {
        let _ = fs::write(path, buf);
    }
}

fn truncate_chars(text: &str, max: usize) -> String {
    let trimmed = text.trim();
    if trimmed.chars().count() <= max {
        return trimmed.to_string();
    }
    trimmed.chars().take(max).collect()
}

fn header_value(headers: &HeaderMap, name: &str) -> String {
    headers.get(name).and_then(|value| value.to_str().ok()).unwrap_or("").trim().to_string()
}

fn decode_base64(text: &str) -> String {
    if text.is_empty() {
        return String::new();
    }
    const TABLE: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut out = Vec::new();
    let mut buf = 0_u32;
    let mut bits = 0;
    for byte in text.bytes() {
        if byte == b'=' { break; }
        let Some(pos) = TABLE.iter().position(|item| *item == byte) else { continue };
        buf = (buf << 6) | pos as u32;
        bits += 6;
        if bits >= 8 {
            bits -= 8;
            out.push((buf >> bits) as u8);
        }
    }
    String::from_utf8(out).unwrap_or_else(|_| text.to_string())
}

fn simple_hash(text: &str) -> u32 {
    text.bytes().fold(0_u32, |hash, byte| hash.wrapping_mul(31).wrapping_add(byte as u32))
}

fn utc_now() -> String {
    let seconds = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).map(|value| value.as_secs()).unwrap_or(0);
    let days = seconds / 86400;
    let time = seconds % 86400;
    let mut year = 1970;
    let mut day = days;
    loop {
        let year_days = if is_leap(year) { 366 } else { 365 };
        if day < year_days { break; }
        day -= year_days;
        year += 1;
    }
    let mdays = [31, if is_leap(year) { 29 } else { 28 }, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let mut month = 1;
    for days_in_month in mdays {
        if day < days_in_month { break; }
        day -= days_in_month;
        month += 1;
    }
    format!("{year:04}-{month:02}-{day:02}T{hour:02}:{minute:02}:{second:02}Z",
        day = day + 1, hour = time / 3600, minute = (time % 3600) / 60, second = time % 60)
}

fn is_leap(year: u64) -> bool {
    (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
}

fn posix(path: &str) -> String {
    let mut path = path.replace('\\', "/");
    if let Some(rest) = path.strip_prefix("./") {
        path = rest.to_string();
    }
    while path.contains("//") {
        path = path.replace("//", "/");
    }
    path.trim_start_matches('/').to_string()
}

pub(crate) fn toml_value(line: &str) -> Option<String> {
    let (_, value) = line.split_once('=')?;
    let value = value.trim().trim_matches('"').to_string();
    if value.is_empty() { None } else { Some(value) }
}

fn plain(status: StatusCode, message: &str) -> Response {
    (status, [(header::CONTENT_TYPE, "text/plain; charset=utf-8")], format!("{message}\n")).into_response()
}

fn json_no_store(body: serde_json::Value) -> Response {
    (
        StatusCode::OK,
        [(header::CACHE_CONTROL, "no-store"), (header::CONTENT_TYPE, "application/json; charset=utf-8")],
        Json(body),
    )
        .into_response()
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::to_bytes;
    use axum::http::Request;
    use tower::ServiceExt;

    fn app_with(dir: &Path) -> Router {
        let app = App {
            data: dir.to_path_buf(),
            config: dir.join("config.toml"),
            overlay: std::collections::HashSet::new(),
            admin: admin::Admin::new("127.0.0.1".into(), "8765".into()),
        };
        Router::new()
            .route("/api/file/{digest}", get(file).head(file))
            .route("/api/pack", post(pack).get(pack))
            .with_state(app)
    }

    #[tokio::test]
    async fn pack_bundles_requested_files() {
        let dir = std::env::temp_dir().join(format!("cdr-rs-pack-{}", std::process::id()));
        let _ = fs::remove_dir_all(&dir);
        let payload = b"pack-me";
        let digest = hex::encode(Sha256::digest(payload));
        let object = dir.join("objects").join(&digest[..2]).join(&digest);
        fs::create_dir_all(object.parent().unwrap()).unwrap();
        fs::write(&object, payload).unwrap();
        let manifest = dir.join("manifests");
        fs::create_dir_all(&manifest).unwrap();
        let doc = serde_json::json!({
            "files": [
                {"path": "mods/a.jar", "sha256": digest},
                {"path": "mods/skip.jar", "sha256": digest}
            ]
        });
        fs::write(manifest.join("client.json"), serde_json::to_vec(&doc).unwrap()).unwrap();
        let router = app_with(&dir);
        let response = router
            .clone()
            .oneshot({
                let mut request = Request::post("/api/pack")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(r#"{"side":"client","paths":["mods/a.jar"]}"#))
                    .unwrap();
                request.extensions_mut().insert(ConnectInfo(std::net::SocketAddr::from(([127, 0, 0, 1], 9))));
                request
            })
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let bytes = to_bytes(response.into_body(), 1024 * 1024).await.unwrap();
        let mut sha = String::new();
        let mut lease = String::new();
        for line in bytes.split(|byte| *byte == b'\n') {
            if line.is_empty() || !line.windows(6).any(|window| window == b"sha256") {
                continue;
            }
            let value: serde_json::Value = serde_json::from_slice(line).unwrap();
            sha = value["sha256"].as_str().unwrap().to_string();
            lease = value["lease"].as_str().unwrap_or("").to_string();
        }
        assert_eq!(sha.len(), 64);
        assert!(!lease.is_empty());
        let packed = dir.join("objects").join(&sha[..2]).join(&sha);
        let raw = fs::read(&packed).unwrap();
        let reader = std::io::Cursor::new(raw);
        let mut archive = zip::ZipArchive::new(reader).unwrap();
        assert_eq!(archive.len(), 1);
        let mut entry = archive.by_index(0).unwrap();
        assert_eq!(entry.name(), "mods/a.jar");
        assert_eq!(entry.compression(), CompressionMethod::Deflated);
        let mut got = Vec::new();
        entry.read_to_end(&mut got).unwrap();
        assert_eq!(got, payload);
        let bad = router
            .clone()
            .oneshot({
                let mut request = Request::post("/api/pack")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(format!(r#"{{"discard":"{sha}"}}"#)))
                    .unwrap();
                request.extensions_mut().insert(ConnectInfo(std::net::SocketAddr::from(([127, 0, 0, 1], 9))));
                request
            })
            .await
            .unwrap();
        assert_eq!(bad.status(), StatusCode::BAD_REQUEST);
        assert!(packed.exists());
        let discard = router
            .clone()
            .oneshot({
                let mut request = Request::post("/api/pack")
                    .header(header::CONTENT_TYPE, "application/json")
                    .body(Body::from(format!(r#"{{"discard":"{sha}","lease":"{lease}"}}"#)))
                    .unwrap();
                request.extensions_mut().insert(ConnectInfo(std::net::SocketAddr::from(([127, 0, 0, 1], 9))));
                request
            })
            .await
            .unwrap();
        assert_eq!(discard.status(), StatusCode::OK);
        assert!(!packed.exists());
        assert!(object.exists());
        let ranged = router
            .oneshot(
                Request::get(format!("/api/file/{digest}"))
                    .header(header::RANGE, "bytes=0-3")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(ranged.status(), StatusCode::PARTIAL_CONTENT);
        let piece = to_bytes(ranged.into_body(), 64).await.unwrap();
        assert_eq!(&piece[..], &payload[..4]);
        let _ = fs::remove_dir_all(&dir);
    }

    #[tokio::test]
    async fn player_routes_require_access_token() {
        let dir = std::env::temp_dir().join(format!("cdr-rs-token-{}", std::process::id()));
        let _ = fs::remove_dir_all(&dir);
        fs::create_dir_all(dir.join("manifests")).unwrap();
        fs::write(dir.join("config.toml"), "access_token = \"secret\"\n").unwrap();
        fs::write(dir.join("manifests").join("meta.json"), br#"{"official_version":"v1"}"#).unwrap();
        let digest = hex::encode(Sha256::digest(b"x"));
        let object = dir.join("objects").join(&digest[..2]).join(&digest);
        fs::create_dir_all(object.parent().unwrap()).unwrap();
        fs::write(&object, b"x").unwrap();
        let app = App {
            data: dir.clone(),
            config: dir.join("config.toml"),
            overlay: std::collections::HashSet::new(),
            admin: admin::Admin::new("127.0.0.1".into(), "8765".into()),
        };
        let router = Router::new()
            .route("/api/status", get(status))
            .route("/api/file/{digest}", get(file).head(file))
            .with_state(app);
        let denied = router
            .clone()
            .oneshot(Request::get("/api/status").body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(denied.status(), StatusCode::UNAUTHORIZED);
        let allowed = router
            .clone()
            .oneshot(
                Request::get("/api/status")
                    .header("X-CDR-Token", "secret")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(allowed.status(), StatusCode::OK);
        let file_denied = router
            .clone()
            .oneshot(Request::get(format!("/api/file/{digest}")).body(Body::empty()).unwrap())
            .await
            .unwrap();
        assert_eq!(file_denied.status(), StatusCode::UNAUTHORIZED);
        let file_ok = router
            .oneshot(
                Request::get(format!("/api/file/{digest}"))
                    .header("Authorization", "Bearer secret")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(file_ok.status(), StatusCode::OK);
        let _ = fs::remove_dir_all(&dir);
    }
}
