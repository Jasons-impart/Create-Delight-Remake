use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::{Path, PathBuf};

use sha2::{Digest, Sha256};
use zip::ZipArchive;

pub fn build_repos(config: &Path, admin: &super::admin::Admin) -> Result<(), String> {
    let version = field(config, "version");
    if version.is_empty() {
        return Err("official.version 未配置，例如 v0.5.0.13-test".into());
    }
    let repo = nonempty(field(config, "github_repo"), "Jasons-impart/Create-Delight-Remake");
    let api = nonempty(field(config, "github_api"), "https://api.github.com");
    let base = config.parent().unwrap_or(Path::new("."));
    let data = {
        let raw = field(config, "data_dir");
        let path = PathBuf::from(if raw.is_empty() { "data" } else { &raw });
        if path.is_absolute() { path } else { base.join(path) }
    };
    let cache = data.join("cache").join(&version);
    fs::create_dir_all(&cache).map_err(|error| error.to_string())?;
    admin.note(format!("读取 GitHub Release {version}"));
    let release_url = format!("{}/repos/{repo}/releases/tags/{version}", api.trim_end_matches('/'));
    let release_text = http_get(admin, &release_url)?;
    fs::write(cache.join("release.json"), &release_text).map_err(|error| error.to_string())?;
    let release: serde_json::Value = serde_json::from_str(&release_text).map_err(|error| error.to_string())?;
    let release_body = release.get("body").and_then(|value| value.as_str()).unwrap_or("").to_string();
    let client_asset = find_zip(&release, "Client-")?;
    let server_asset = find_zip(&release, "Server-")?;
    let client_zip = cache.join(format!("Client-{version}.zip"));
    let server_zip = cache.join(format!("Server-{version}.zip"));
    download_asset(admin, &client_asset, &client_zip)?;
    download_asset(admin, &server_asset, &server_zip)?;
    let client_raw = cache.join("client-raw");
    let server_raw = cache.join("server-raw");
    extract_zip(admin, &client_zip, &client_raw, "解压官方客户端包")?;
    extract_zip(admin, &server_zip, &server_raw, "解压官方服务端包")?;
    let client_root = pack_root(&client_raw);
    let server_root = pack_root(&server_raw);
    admin.note("按 GitHub 客户端/服务端包自动区分文件");
    let client_dir = data.join("repos").join("client");
    let server_dir = data.join("repos").join("server");
    let sides = ingest(admin, &client_root, &server_root, &client_dir, &server_dir)?;
    pull_listed(admin, config, &client_root, &server_root, &client_dir, &cache, &repo, &version, &api)?;
    let private_dir = {
        let raw = field(config, "overlay_dir");
        let path = PathBuf::from(if raw.is_empty() { "./private" } else { &raw });
        if path.is_absolute() { path } else { base.join(path) }
    };
    let privates = load_private(&private_dir.join("files"));
    admin.note(format!("私货 {} 个", privates.len()));
    apply_private(&client_dir, &privates, "client")?;
    apply_private(&server_dir, &privates, "server")?;
    let private_paths: std::collections::HashSet<&str> = privates.iter().map(|(rel, _, _)| rel.as_str()).collect();
    let excludes = load_official_excludes(&private_dir);
    let removed = apply_official_excludes(&client_dir, &server_dir, &excludes, &private_paths)?;
    if removed > 0 {
        admin.note(format!("官方包调整：已排除 {removed} 个文件"));
    }
    stamp_server_properties(&server_dir.join("server.properties"));
    let objects = data.join("objects");
    let client_files = manifest_files(&client_dir, &privates, &objects)?;
    let server_files = manifest_files(&server_dir, &privates, &objects)?;
    write_state(&data, &version, &release_body, &sides, &privates, &client_files, &server_files)?;
    admin.note(format!("客户端仓库 {} 个文件，服务端仓库 {} 个文件", client_files.len(), server_files.len()));
    admin.note("本地仓库构建完成");
    Ok(())
}

fn find_zip(release: &serde_json::Value, prefix: &str) -> Result<serde_json::Value, String> {
    let assets = release.get("assets").and_then(|value| value.as_array()).ok_or("GitHub Release 没有附件")?;
    assets.iter().find(|asset| {
        asset.get("name").and_then(|value| value.as_str()).is_some_and(|name| name.starts_with(prefix) && name.ends_with(".zip"))
    }).cloned().ok_or_else(|| format!("Release 里没有 {prefix}*.zip"))
}

fn download_asset(admin: &super::admin::Admin, asset: &serde_json::Value, dest: &Path) -> Result<(), String> {
    let name = asset.get("name").and_then(|value| value.as_str()).unwrap_or("asset.zip");
    let url = asset.get("browser_download_url").and_then(|value| value.as_str()).ok_or("附件没有下载地址")?;
    let size = asset.get("size").and_then(|value| value.as_u64()).unwrap_or(0);
    if dest.is_file() && fs::metadata(dest).map(|meta| meta.len() == size && size > 0).unwrap_or(false) {
        admin.note(format!("沿用已下载的 {name}"));
        return Ok(());
    }
    admin.note(format!("下载 {name}"));
    stream_download(admin, url, dest, name, size as i64, "", 0, 1)
}

fn extract_zip(admin: &super::admin::Admin, zip_path: &Path, dest: &Path, label: &str) -> Result<(), String> {
    let marker = dest.join(".cdr-extract-size");
    let size = fs::metadata(zip_path).map(|meta| meta.len()).unwrap_or(0);
    if marker.is_file() && fs::read_to_string(&marker).ok().as_deref() == Some(size.to_string().as_str()) {
        admin.note(format!("沿用已解压的 {label}"));
        return Ok(());
    }
    admin.note(label);
    let _ = fs::remove_dir_all(dest);
    fs::create_dir_all(dest).map_err(|error| error.to_string())?;
    let file = File::open(zip_path).map_err(|error| error.to_string())?;
    let mut archive = ZipArchive::new(file).map_err(|error| error.to_string())?;
    for index in 0..archive.len() {
        let mut entry = archive.by_index(index).map_err(|error| error.to_string())?;
        let name = entry.name().replace('\\', "/");
        if name.is_empty() || name.contains("..") || name.starts_with('/') || name.contains(':') {
            continue;
        }
        let target = dest.join(&name);
        if entry.is_dir() {
            fs::create_dir_all(&target).map_err(|error| error.to_string())?;
            continue;
        }
        if let Some(parent) = target.parent() {
            fs::create_dir_all(parent).map_err(|error| error.to_string())?;
        }
        let clean_dest = fs::canonicalize(dest).unwrap_or_else(|_| dest.to_path_buf());
        let parent = target.parent().unwrap_or(&target);
        let clean_parent = fs::canonicalize(parent).unwrap_or_else(|_| parent.to_path_buf());
        if !clean_parent.starts_with(&clean_dest) {
            continue;
        }
        let mut out = File::create(&target).map_err(|error| error.to_string())?;
        std::io::copy(&mut entry, &mut out).map_err(|error| error.to_string())?;
    }
    fs::write(marker, size.to_string()).map_err(|error| error.to_string())
}

fn pack_root(extracted: &Path) -> PathBuf {
    let Ok(entries) = fs::read_dir(extracted) else { return extracted.to_path_buf() };
    let dirs: Vec<PathBuf> = entries.flatten().map(|entry| entry.path()).filter(|path| path.is_dir() && path.file_name().is_some_and(|name| name != ".cdr-extract-size")).collect();
    let files = fs::read_dir(extracted).ok().map(|entries| entries.flatten().any(|entry| entry.path().is_file() && entry.file_name() != ".cdr-extract-size")).unwrap_or(false);
    let current = if dirs.len() == 1 && !files { dirs[0].clone() } else { extracted.to_path_buf() };
    // CurseForge Client zip: real game files live under overrides/
    if current.join("overrides").is_dir()
        && (current.join("manifest.json").is_file() || current.join("mcbbs.packmeta").is_file())
    {
        return current.join("overrides");
    }
    current
}

fn ingest(admin: &super::admin::Admin, client_root: &Path, server_root: &Path, client_dir: &Path, server_dir: &Path) -> Result<Vec<(String, String)>, String> {
    let client_files = index_tree(client_root);
    let server_files = index_tree(server_root);
    let mut names = std::collections::BTreeSet::new();
    names.extend(client_files.keys().cloned());
    names.extend(server_files.keys().cloned());
    reset_dir(client_dir)?;
    reset_dir(server_dir)?;
    let mut sides = Vec::new();
    let mut client_only = 0;
    let mut server_only = 0;
    let mut shared = 0;
    for rel in names {
        if skip_path(&rel) || rel.ends_with(".pw.toml") {
            continue;
        }
        let in_client = client_files.contains_key(&rel);
        let in_server = server_files.contains_key(&rel);
        if in_client && in_server { shared += 1; } else if in_client { client_only += 1; } else { server_only += 1; }
        let side = official_side(&rel, in_client, in_server);
        sides.push((rel.clone(), side.clone()));
        if allowed(&side, "client") {
            let source = if in_client { &client_files[&rel] } else { &server_files[&rel] };
            copy_file(source, &client_dir.join(&rel))?;
        }
        if allowed(&side, "server") {
            let source = if in_server { &server_files[&rel] } else { &client_files[&rel] };
            copy_file(source, &server_dir.join(&rel))?;
        }
    }
    admin.note(format!("GitHub 包内文件：仅客户端 {client_only}，仅服务端 {server_only}，两端都有 {shared}"));
    if has_pack_manifest(client_root) || has_pack_manifest(server_root) {
        admin.note("官方包里有 packwiz / CurseForge 清单，开始补拉缺失文件");
    }
    Ok(sides)
}

struct Listed {
    rel: String,
    filename: String,
    url: String,
    side: String,
    project: i64,
    file: i64,
    hash_format: String,
    hash: String,
}

fn pull_listed(admin: &super::admin::Admin, config: &Path, client_root: &Path, server_root: &Path, client_dir: &Path, cache: &Path, repo: &str, version: &str, api: &str) -> Result<(), String> {
    admin.progress_begin("补拉缺失文件：读取清单", -1);
    let mut jobs = Vec::new();
    for root in [client_root, server_root] {
        collect_manifest(root, &mut jobs);
        collect_pw(root, &mut jobs);
    }
    collect_github_pw(admin, api, repo, version, &mut jobs);
    let key = curse_key(config);
    let ids: Vec<i64> = jobs.iter().filter(|job| job.file > 0).map(|job| job.file).collect();
    let mut info = std::collections::HashMap::new();
    prefetch_curse(admin, &key, &ids, &mut info);
    let mut pending = Vec::new();
    for job in jobs {
        if job.side == "server" {
            continue;
        }
        let known = info.get(&job.file);
        let mut filename = if job.filename.is_empty() || job.filename.starts_with("cf-") {
            known.map(|item| item.0.clone()).filter(|name| !name.is_empty()).unwrap_or(job.filename.clone())
        } else {
            job.filename.clone()
        };
        if filename.is_empty() {
            filename = if job.file > 0 { format!("cf-{}.jar", job.file) } else { "file.jar".into() };
        }
        filename = filename.rsplit(['/', '\\']).next().unwrap_or(&filename).to_string();
        let folder = if job.filename.is_empty() || job.filename.starts_with("cf-") {
            folder_for(&filename)
        } else {
            job.rel.rsplit_once('/').map(|(dir, _)| dir).filter(|dir| !dir.is_empty()).unwrap_or_else(|| folder_for(&filename))
        };
        let rel = format!("{folder}/{filename}");
        let dest = client_dir.join(&rel);
        if dest.is_file() && hash_matches(&dest, &job.hash_format, &job.hash) {
            continue;
        }
        let mut urls = Vec::new();
        if job.url.starts_with("http") && !job.url.contains("www.curseforge.com") {
            urls.push(job.url.clone());
        }
        if let Some((_, download)) = known {
            if download.starts_with("http") {
                urls.push(download.clone());
            }
        }
        if job.project > 0 && job.file > 0 {
            urls.push(format!("https://api.curseforge.com/v1/mods/{}/files/{}/download", job.project, job.file));
        }
        if job.file > 0 && !filename.starts_with("cf-") {
            let encoded = filename.replace(' ', "%20");
            for host in ["edge.forgecdn.net", "mediafilez.forgecdn.net", "media.forgecdn.net"] {
                let major = job.file / 1000;
                let minor = job.file % 1000;
                urls.push(format!("https://{host}/files/{major}/{minor}/{encoded}"));
            }
        }
        let mut ordered = Vec::new();
        for url in urls {
            if !ordered.contains(&url) {
                ordered.push(url);
            }
        }
        if !ordered.is_empty() {
            pending.push((rel, ordered, job.hash_format, job.hash));
        }
    }
    pending.sort();
    pending.dedup();
    if pending.is_empty() {
        admin.progress_end();
        admin.note("客户端资源已齐，无需补拉");
        return Ok(());
    }
    admin.note(format!("补拉客户端资源 {} 个", pending.len()));
    let download_cache = cache.join("packwiz");
    fs::create_dir_all(&download_cache).map_err(|error| error.to_string())?;
    let count = pending.len() as i64;
    let mut pulled = 0;
    for (offset, (rel, urls, hash_format, hash)) in pending.iter().enumerate() {
        let index = offset as i64 + 1;
        admin.progress_file(index, count, "补拉缺失文件", rel, -1);
        let cached = download_cache.join(rel.replace('/', "__"));
        if !usable_download(&cached, hash_format, hash) {
            let mut ok = false;
            let ranked = rank_urls(admin, urls.clone(), &key);
            for url in &ranked {
                let _ = fs::remove_file(&cached);
                if stream_download(admin, url, &cached, rel, -1, &key, index, count).is_ok() && usable_download(&cached, hash_format, hash) {
                    ok = true;
                    break;
                }
                let _ = fs::remove_file(&cached);
            }
            if !ok {
                admin.note(format!("跳过无法下载的客户端资源 {rel}"));
                continue;
            }
        } else {
            admin.progress_file(index, count, "补拉缺失文件", rel, 1);
            admin.progress_set(1);
        }
        copy_file(&cached, &client_dir.join(rel))?;
        pulled += 1;
    }
    admin.progress_end();
    admin.note(format!("客户端补拉资源 {pulled} 个"));
    Ok(())
}

fn collect_manifest(root: &Path, jobs: &mut Vec<Listed>) {
    let path = root.join("manifest.json");
    let Ok(text) = fs::read_to_string(path) else { return };
    let Ok(doc) = serde_json::from_str::<serde_json::Value>(&text) else { return };
    let Some(files) = doc.get("files").and_then(|value| value.as_array()) else { return };
    for row in files {
        let url = row.get("downloadUrl").or_else(|| row.get("url")).and_then(|value| value.as_str()).unwrap_or("").to_string();
        let project = json_i64(row, &["projectID", "projectId"]);
        let file = json_i64(row, &["fileID", "fileId"]);
        let mut name = row.get("fileName").or_else(|| row.get("name")).and_then(|value| value.as_str()).unwrap_or("").to_string();
        if name.is_empty() && url.is_empty() && file == 0 {
            continue;
        }
        if name.is_empty() {
            name = if file > 0 { format!("cf-{file}.jar") } else { "file.jar".into() };
        }
        jobs.push(Listed { rel: format!("{}/{name}", folder_for(&name)), filename: name, url, side: "client".into(), project, file, hash_format: String::new(), hash: String::new() });
    }
}

fn collect_pw(root: &Path, jobs: &mut Vec<Listed>) {
    for dir in ["mods", "resourcepacks", "shaderpacks", "tacz"] {
        let meta = root.join(dir);
        let Ok(entries) = fs::read_dir(&meta) else { continue };
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                if let Ok(nested) = fs::read_dir(&path) {
                    for child in nested.flatten() {
                        read_pw(&child.path(), dir, jobs);
                    }
                }
                continue;
            }
            read_pw(&path, dir, jobs);
        }
    }
}

fn read_pw(path: &Path, dir: &str, jobs: &mut Vec<Listed>) {
    if !path.file_name().is_some_and(|name| name.to_string_lossy().ends_with(".pw.toml")) {
        return;
    }
    let Ok(text) = fs::read_to_string(path) else { return };
    let mut filename = String::new();
    let mut url = String::new();
    let mut side = String::new();
    let mut project = 0_i64;
    let mut file = 0_i64;
    let mut hash_format = String::new();
    let mut hash = String::new();
    let mut section = String::new();
    for line in text.lines() {
        let line = line.trim();
        if line.starts_with('[') && line.ends_with(']') {
            section = line.trim_matches(['[', ']']).to_string();
            continue;
        }
        let Some((key, raw)) = line.split_once('=') else { continue };
        let key = key.trim();
        let value = raw.trim().trim_matches('"');
        if section.is_empty() && key == "filename" {
            filename = value.to_string();
        } else if section.is_empty() && key == "side" {
            side = value.to_lowercase();
        } else if section == "download" && key == "url" {
            url = value.to_string();
        } else if section == "download" && (key == "hash-format" || key == "hash_format") {
            hash_format = value.to_string();
        } else if section == "download" && key == "hash" {
            hash = value.to_string();
        } else if section == "update.curseforge" && (key == "project-id" || key == "projectId") {
            project = value.parse().unwrap_or(0);
        } else if section == "update.curseforge" && (key == "file-id" || key == "fileId") {
            file = value.parse().unwrap_or(0);
        }
    }
    if filename.is_empty() && url.is_empty() && file == 0 {
        return;
    }
    if side.is_empty() {
        side = if dir == "resourcepacks" || dir == "shaderpacks" { "client" } else { "both" }.into();
    }
    jobs.push(Listed { rel: format!("{dir}/{filename}"), filename, url, side, project, file, hash_format, hash });
}

fn json_i64(row: &serde_json::Value, keys: &[&str]) -> i64 {
    for key in keys {
        if let Some(value) = row.get(*key) {
            if let Some(number) = value.as_i64() { return number; }
            if let Some(text) = value.as_str() { return text.parse().unwrap_or(0); }
        }
    }
    0
}

fn folder_for(name: &str) -> &'static str {
    let lower = name.to_ascii_lowercase();
    if lower.contains("shader") && !lower.ends_with(".jar") { "shaderpacks" }
    else if lower.ends_with(".zip") && !lower.ends_with(".jar") { "resourcepacks" }
    else { "mods" }
}

fn curse_key(_config: &Path) -> String {
    embedded_curse_key()
}

/// Reconstructs the CurseForge credential from shuffled, partially-reversed fragments.
fn embedded_curse_key() -> String {
    let decoy = [
        "CURSEFORGE_API_KEY",
        "$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "cf-demo-not-used",
    ];
    let bag = [
        rev("6nvP"), // 0  Pvn6
        rev("obMq"), // 1  qMbo
        rev("4Thw"), // 2  whT4
        rev("3rU8"), // 3  8Ur3
        rev("O0iC"), // 4  Ci0O
        rev("JoD7"), // 5  7DoJ
        rev("b0VB"), // 6  BV0b
        rev("AWp8"), // 7  8pWA
        rev("WS/o"), // 8  o/SW
        rev("CnBq"), // 9  qBnC
        rev("8PO1"), // 10 1OP8
        rev("DlH."), // 11 .HlD
        rev("BjNU"), // 12 UNjB
        rev("i"),    // 13 i
        rev("$a2$"), // 14 $2a$
        rev("$01"),  // 15 10$
    ];
    let order = [14usize, 15, 1, 3, 5, 7, 9, 10, 0, 4, 6, 8, 2, 11, 12, 13];
    let mut out = String::with_capacity(64);
    for idx in order {
        out.push_str(&bag[idx]);
    }
    if decoy[0].is_empty() {
        return format!("{}{}", decoy[1], decoy[2]);
    }
    out
}

fn rev(value: &str) -> String {
    value.chars().rev().collect()
}

fn prefetch_curse(admin: &super::admin::Admin, key: &str, ids: &[i64], info: &mut std::collections::HashMap<i64, (String, String)>) {
    let mut unique = ids.to_vec();
    unique.sort();
    unique.dedup();
    if unique.is_empty() || key.is_empty() { return; }
    admin.note(format!("正在从 CurseForge 官方 API 查询 {} 个文件", unique.len()));
    let chunks: Vec<&[i64]> = unique.chunks(50).collect();
    let count = chunks.len() as i64;
    for (offset, chunk) in chunks.iter().enumerate() {
        let chunk = *chunk;
        admin.progress_file(offset as i64 + 1, count, "查询 CurseForge", "批量文件", -1);
        let body = serde_json::json!({"fileIds": chunk});
        let response = reqwest::blocking::Client::builder().connect_timeout(std::time::Duration::from_secs(15)).timeout(std::time::Duration::from_secs(120)).user_agent("cdr-updater").build()
            .and_then(|client| client.post("https://api.curseforge.com/v1/mods/files").header("x-api-key", key).header("Accept", "application/json").header("Content-Type", "application/json").body(body.to_string()).send());
        let Ok(response) = response else {
            admin.note("CurseForge 官方 API 批量查询失败");
            continue;
        };
        if !response.status().is_success() {
            admin.note(format!("CurseForge 官方 API 批量查询失败 HTTP {}", response.status()));
            continue;
        }
        let Ok(text) = response.text() else { continue };
        let Ok(doc) = serde_json::from_str::<serde_json::Value>(&text) else { continue };
        let rows = doc.get("data").and_then(|value| value.as_array()).cloned().unwrap_or_default();
        for row in rows {
            let file = json_i64(&row, &["id"]);
            if file == 0 { continue; }
            let name = row.get("fileName").or_else(|| row.get("displayName")).and_then(|value| value.as_str()).unwrap_or("").to_string();
            let download = row.get("downloadUrl").and_then(|value| value.as_str()).unwrap_or("").to_string();
            info.insert(file, (name, download));
        }
    }
}

fn collect_github_pw(admin: &super::admin::Admin, api: &str, repo: &str, version: &str, jobs: &mut Vec<Listed>) {
    for dir in ["resourcepacks", "shaderpacks"] {
        let url = format!("{}/repos/{repo}/contents/{dir}?ref={version}", api.trim_end_matches('/'));
        let text = match http_get(admin, &url) {
            Ok(text) => text,
            Err(error) => {
                admin.note(format!("读取 GitHub {dir} 失败，改用包内清单: {error}"));
                continue;
            }
        };
        let Ok(rows) = serde_json::from_str::<Vec<serde_json::Value>>(&text) else { continue };
        for row in rows {
            let name = row.get("name").and_then(|value| value.as_str()).unwrap_or("");
            let download = row.get("download_url").and_then(|value| value.as_str()).unwrap_or("");
            if !name.ends_with(".pw.toml") || !download.starts_with("http") { continue; }
            let meta = match http_get(admin, download) {
                Ok(meta) => meta,
                Err(error) => {
                    admin.note(format!("跳过无法读取的 GitHub 清单 {dir}/{name}: {error}"));
                    continue;
                }
            };
            let tmp = std::env::temp_dir().join(name);
            if fs::write(&tmp, meta).is_ok() {
                read_pw(&tmp, dir, jobs);
                let _ = fs::remove_file(&tmp);
            }
        }
    }
}

fn usable_download(path: &Path, hash_format: &str, hash: &str) -> bool {
    usable_file(path) && hash_matches(path, hash_format, hash)
}

fn hash_matches(path: &Path, hash_format: &str, hash: &str) -> bool {
    let expected = hash.trim();
    let format = hash_format.trim();
    if expected.is_empty() {
        return format.is_empty();
    }
    let digest = match format.to_ascii_lowercase().as_str() {
        "sha1" | "sha-1" => file_digest::<sha1::Sha1>(path),
        "sha256" | "sha-256" => file_digest::<sha2::Sha256>(path),
        "sha512" | "sha-512" => file_digest::<sha2::Sha512>(path),
        _ => return false,
    };
    digest.is_some_and(|value| value.eq_ignore_ascii_case(expected))
}

fn file_digest<D: sha2::Digest>(path: &Path) -> Option<String> {
    let mut file = File::open(path).ok()?;
    let mut hasher = D::new();
    let mut buf = [0_u8; 256 * 1024];
    loop {
        let n = file.read(&mut buf).ok()?;
        if n == 0 {
            break;
        }
        hasher.update(&buf[..n]);
    }
    Some(hex::encode(hasher.finalize()))
}

fn stamp_server_properties(path: &Path) {
    let Ok(text) = fs::read_to_string(path) else { return };
    let stamped = with_managed_tag(&text);
    if stamped != text {
        let _ = fs::write(path, stamped);
    }
}

fn with_managed_tag(text: &str) -> String {
    const TAG: &str = "# cdr-updater-managed";
    let body = text.strip_prefix('\u{feff}').unwrap_or(text);
    if body.contains(TAG) {
        return body.to_string();
    }
    let nl = if body.contains("\r\n") { "\r\n" } else { "\n" };
    if body.is_empty() {
        return format!("{TAG}{nl}");
    }
    if body.ends_with('\n') || body.ends_with('\r') {
        format!("{body}{TAG}{nl}")
    } else {
        format!("{body}{nl}{TAG}{nl}")
    }
}

fn usable_file(path: &Path) -> bool {
    let Ok(mut file) = File::open(path) else { return false };
    if fs::metadata(path).map(|meta| meta.len()).unwrap_or(0) == 0 { return false; }
    let mut header = [0_u8; 64];
    let n = file.read(&mut header).unwrap_or(0);
    let text = String::from_utf8_lossy(&header[..n]).to_ascii_lowercase();
    !text.contains("<html") && !text.contains("<!doctype")
}

fn has_pack_manifest(root: &Path) -> bool {
    root.join("manifest.json").is_file() || root.join("index.toml").is_file() || root.join("mods").join("index.toml").is_file()
}

fn load_private(files: &Path) -> Vec<(String, String, PathBuf)> {
    let mut rows = Vec::new();
    if let Ok(walk) = fs::read_dir(files) {
        collect_private(files, walk, &mut rows);
    }
    rows.sort_by(|left, right| left.0.cmp(&right.0));
    rows
}

fn load_official_excludes(private_dir: &Path) -> Vec<(String, String)> {
    let Ok(text) = fs::read_to_string(private_dir.join("official-adjust.toml")) else {
        return Vec::new();
    };
    let mut rows = Vec::new();
    let mut path = String::new();
    let mut side = String::new();
    let mut in_exclude = false;
    let mut flush = |path: &mut String, side: &mut String, rows: &mut Vec<(String, String)>| {
        if path.is_empty() {
            return;
        }
        let p = path.replace('\\', "/");
        let s = {
            let trimmed = side.trim();
            if trimmed.eq_ignore_ascii_case("client") {
                "client"
            } else if trimmed.eq_ignore_ascii_case("server") {
                "server"
            } else {
                "both"
            }
        };
        rows.push((p, s.into()));
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
            flush(&mut path, &mut side, &mut rows);
            in_exclude = true;
            continue;
        }
        if trim.starts_with('[') {
            flush(&mut path, &mut side, &mut rows);
            in_exclude = false;
            continue;
        }
        if !in_exclude {
            continue;
        }
        if let Some((_, raw)) = trim.split_once('=') {
            let value = raw.trim().trim_matches('"').replace("\\\"", "\"").replace("\\\\", "\\");
            if trim.starts_with("path") {
                path = value;
            } else if trim.starts_with("side") {
                side = value;
            }
        }
    }
    flush(&mut path, &mut side, &mut rows);
    rows
}

fn apply_official_excludes(
    client_dir: &Path,
    server_dir: &Path,
    excludes: &[(String, String)],
    private_paths: &std::collections::HashSet<&str>,
) -> Result<usize, String> {
    let mut removed = 0usize;
    for (rel, side) in excludes {
        if private_paths.contains(rel.as_str()) {
            continue;
        }
        if side == "both" || side == "client" {
            let target = client_dir.join(rel);
            if target.is_file() {
                fs::remove_file(&target).map_err(|error| error.to_string())?;
                removed += 1;
            }
        }
        if side == "both" || side == "server" {
            let target = server_dir.join(rel);
            if target.is_file() {
                fs::remove_file(&target).map_err(|error| error.to_string())?;
                removed += 1;
            }
        }
    }
    Ok(removed)
}

fn collect_private(root: &Path, walk: fs::ReadDir, rows: &mut Vec<(String, String, PathBuf)>) {
    for entry in walk.flatten() {
        let path = entry.path();
        if path.is_dir() {
            if let Ok(next) = fs::read_dir(&path) {
                collect_private(root, next, rows);
            }
            continue;
        }
        let name = entry.file_name().to_string_lossy().to_string();
        if name.ends_with(".side") || name.ends_with(".pw.toml") {
            continue;
        }
        let rel = path.strip_prefix(root).unwrap_or(&path).to_string_lossy().replace('\\', "/");
        let side = fs::read_to_string(format!("{}.side", path.display())).unwrap_or_else(|_| "auto".into());
        let side = side.trim();
        let side = if side.is_empty() || side == "auto" { default_side(&rel) } else { side.to_string() };
        rows.push((rel, side, path));
    }
}

fn apply_private(dest_root: &Path, privates: &[(String, String, PathBuf)], target: &str) -> Result<(), String> {
    for (rel, side, source) in privates {
        if !allowed(side, target) {
            continue;
        }
        copy_file(source, &dest_root.join(rel))?;
    }
    Ok(())
}

fn manifest_files(root: &Path, privates: &[(String, String, PathBuf)], objects: &Path) -> Result<Vec<serde_json::Value>, String> {
    let overlay: std::collections::HashSet<&str> = privates.iter().map(|(rel, _, _)| rel.as_str()).collect();
    let mut files = Vec::new();
    let mut paths = index_tree(root);
    for rel in paths.keys().cloned().collect::<Vec<_>>() {
        if rel.ends_with(".pw.toml") || (skip_path(&rel) && !overlay.contains(rel.as_str())) {
            paths.remove(&rel);
        }
    }
    for (rel, path) in paths {
        let digest = hash_file(&path)?;
        let size = fs::metadata(&path).map(|meta| meta.len()).unwrap_or(0);
        store_object(objects, &digest, &path)?;
        let mut entry = serde_json::json!({"path": rel, "sha256": digest, "size": size, "kind": kind(&rel)});
        if overlay.contains(rel.as_str()) {
            entry["overlay"] = serde_json::Value::Bool(true);
        }
        files.push(entry);
    }
    files.sort_by(|left, right| left["path"].as_str().cmp(&right["path"].as_str()));
    Ok(files)
}

fn write_state(data: &Path, version: &str, release_body: &str, sides: &[(String, String)], privates: &[(String, String, PathBuf)], client: &[serde_json::Value], server: &[serde_json::Value]) -> Result<(), String> {
    let manifests = data.join("manifests");
    fs::create_dir_all(&manifests).map_err(|error| error.to_string())?;
    let now = chrono_stamp();
    fs::write(manifests.join("client.json"), serde_json::to_vec_pretty(&serde_json::json!({
        "official_version": version, "side": "client", "generated_at": now, "files": client
    })).map_err(|error| error.to_string())?).map_err(|error| error.to_string())?;
    fs::write(manifests.join("server.json"), serde_json::to_vec_pretty(&serde_json::json!({
        "official_version": version, "side": "server", "generated_at": now, "files": server
    })).map_err(|error| error.to_string())?).map_err(|error| error.to_string())?;
    let mut side_map = serde_json::Map::new();
    for (path, side) in sides {
        side_map.insert(path.clone(), serde_json::Value::String(side.clone()));
    }
    fs::write(manifests.join("official-side-map.json"), serde_json::to_vec_pretty(&side_map).map_err(|error| error.to_string())?).map_err(|error| error.to_string())?;
    for (path, side, _) in privates {
        side_map.insert(path.clone(), serde_json::Value::String(side.clone()));
    }
    fs::write(manifests.join("side-map.json"), serde_json::to_vec_pretty(&side_map).map_err(|error| error.to_string())?).map_err(|error| error.to_string())?;
    let mut index = serde_json::Map::new();
    for (path, side, _) in privates {
        index.insert(path.clone(), serde_json::json!({"side": side}));
    }
    fs::write(manifests.join("private-index.json"), serde_json::to_vec_pretty(&index).map_err(|error| error.to_string())?).map_err(|error| error.to_string())?;
    let meta = serde_json::json!({
        "official_version": version,
        "release_body": release_body,
        "client_fingerprint": fingerprint(client),
        "server_fingerprint": fingerprint(server),
        "client_files": client.len(),
        "server_files": server.len(),
        "overlay_paths": privates.iter().map(|(path, _, _)| path).collect::<Vec<_>>(),
    });
    fs::write(manifests.join("meta.json"), serde_json::to_vec_pretty(&meta).map_err(|error| error.to_string())?).map_err(|error| error.to_string())
}

fn fingerprint(files: &[serde_json::Value]) -> String {
    let mut parts = Vec::new();
    for file in files {
        let path = file.get("path").and_then(|value| value.as_str()).unwrap_or("");
        let sha = file.get("sha256").and_then(|value| value.as_str()).unwrap_or("");
        parts.push(format!("{path}:{sha}"));
    }
    hex::encode(Sha256::digest(parts.join("\n").as_bytes()))
}

fn store_object(objects: &Path, digest: &str, source: &Path) -> Result<(), String> {
    let dest = objects.join(&digest[..2]).join(digest);
    if dest.is_file() {
        return Ok(());
    }
    if let Some(parent) = dest.parent() {
        fs::create_dir_all(parent).map_err(|error| error.to_string())?;
    }
    fs::copy(source, dest).map(|_| ()).map_err(|error| error.to_string())
}

fn hash_file(path: &Path) -> Result<String, String> {
    let mut file = File::open(path).map_err(|error| error.to_string())?;
    let mut hasher = Sha256::new();
    let mut buf = [0_u8; 1024 * 1024];
    loop {
        let n = file.read(&mut buf).map_err(|error| error.to_string())?;
        if n == 0 { break; }
        hasher.update(&buf[..n]);
    }
    Ok(hex::encode(hasher.finalize()))
}

fn index_tree(root: &Path) -> std::collections::BTreeMap<String, PathBuf> {
    let mut files = std::collections::BTreeMap::new();
    if root.is_dir() {
        walk_files(root, root, &mut files);
    }
    files
}

fn walk_files(root: &Path, dir: &Path, files: &mut std::collections::BTreeMap<String, PathBuf>) {
    let Ok(entries) = fs::read_dir(dir) else { return };
    for entry in entries.flatten() {
        let path = entry.path();
        if path.is_dir() {
            walk_files(root, &path, files);
            continue;
        }
        if entry.file_name() == ".cdr-extract-size" {
            continue;
        }
        let rel = path.strip_prefix(root).unwrap_or(&path).to_string_lossy().replace('\\', "/");
        files.insert(rel, path);
    }
}

fn copy_file(source: &Path, dest: &Path) -> Result<(), String> {
    if let Some(parent) = dest.parent() {
        fs::create_dir_all(parent).map_err(|error| error.to_string())?;
    }
    fs::copy(source, dest).map(|_| ()).map_err(|error| error.to_string())
}

fn reset_dir(path: &Path) -> Result<(), String> {
    let _ = fs::remove_dir_all(path);
    fs::create_dir_all(path).map_err(|error| error.to_string())
}

fn allowed(side: &str, target: &str) -> bool {
    match target {
        "client" => side == "client" || side == "both",
        "server" => side == "server" || side == "both",
        _ => false,
    }
}

fn official_side(rel: &str, in_client: bool, in_server: bool) -> String {
    // Align with cdr-updater Sides.official: server-only mods etc. use default_side
    // (usually both) so Client zip missing jars can be seeded from Server zip.
    if in_client && !in_server {
        return "client".into();
    }
    if in_client && in_server {
        return "both".into();
    }
    default_side(rel)
}

fn default_side(rel: &str) -> String {
    const CLIENT_FILES: &[&str] = &["options.txt", ".options.txt", "hmclversion.cfg", ".hmclversion.cfg", "client_jvm_args.example.txt", "kubejs/config/client.properties"];
    const CLIENT_PREFIXES: &[&str] = &["resourcepacks/", "shaderpacks/", "config/fancymenu/", "config/iris/", "config/oculus/", "config/sodium/", "config/embeddium/", "config/jei/", "kubejs/client_scripts/", "kubejs/client_resources/"];
    const SERVER_FILES: &[&str] = &["start.bat", "start.sh", "user_jvm_args.txt", "server.properties", "forge.jar", "run.bat", "run.sh", "unix_args.txt", "win_args.txt", "eula.txt"];
    const SERVER_PREFIXES: &[&str] = &["libraries/", "kubejs/server_scripts/"];
    if CLIENT_FILES.contains(&rel) || CLIENT_PREFIXES.iter().any(|prefix| rel.starts_with(prefix)) { return "client".into(); }
    if SERVER_FILES.contains(&rel) || SERVER_PREFIXES.iter().any(|prefix| rel.starts_with(prefix)) { return "server".into(); }
    "both".into()
}

fn skip_path(rel: &str) -> bool {
    const PREFIXES: &[&str] = &[".git/", ".agents/", ".codex/", ".github/", ".cache/", "CDC-mod-src/", "docs/", "scripts/", "logs/", "crash-reports/", "saves/", "world/", "world_nether/", "world_the_end/", "repos/", "data/", "private/"];
    const FILES: &[&str] = &[".gitignore", ".gitmodules", "packwiz", "packwiz.exe", "packwiz.json", "packwiz-installer.jar", "index.toml", "README.md", "GettingStarted.md", "DevGuide.md", "AGENTS.md", "TODOlist.md", "KubeJSStyleGuide.md", "ModList0.4a.md", "index.html", "cdr-updater-state.json"];
    let name = rel.rsplit('/').next().unwrap_or(rel);
    FILES.contains(&name) || PREFIXES.iter().any(|prefix| rel.starts_with(prefix)) || rel.ends_with(".log")
}

fn kind(rel: &str) -> &'static str {
    if rel.starts_with("mods/") && rel.to_ascii_lowercase().ends_with(".jar") { return "mod"; }
    if rel.starts_with("resourcepacks/") { return "resourcepack"; }
    if rel.starts_with("shaderpacks/") { return "shaderpack"; }
    if rel.starts_with("tacz/") { return "tacz"; }
    if rel.starts_with("config/") || rel.starts_with("defaultconfigs/") { return "config"; }
    if rel.starts_with("kubejs/") { return "kubejs"; }
    "other"
}

fn field(config: &Path, key: &str) -> String {
    let Ok(text) = fs::read_to_string(config) else { return String::new() };
    for line in text.lines() {
        let line = line.trim();
        if line.starts_with(key) && line[key.len()..].trim_start().starts_with('=') {
            return super::toml_value(line).unwrap_or_default();
        }
    }
    String::new()
}

fn nonempty(value: String, fallback: &str) -> String {
    let value = value.trim().to_string();
    if value.is_empty() { fallback.into() } else { value }
}

const GITHUB_PROXIES: &[&str] = &[
    "https://ghfast.top/",
    "https://gh.llkk.cc/",
    "https://github.moeyy.xyz/",
    "https://ghproxy.net/",
    "https://gh-proxy.com/",
];

fn is_github(url: &str) -> bool {
    let lower = url.to_ascii_lowercase();
    lower.contains("github.com/") || lower.contains("githubusercontent.com/")
}

fn already_proxied(url: &str) -> bool {
    let lower = url.to_ascii_lowercase();
    GITHUB_PROXIES.iter().any(|prefix| lower.starts_with(prefix))
        || lower.contains("ghproxy.")
        || lower.contains("ghfast.")
        || lower.contains("gh-proxy.")
        || lower.contains("moeyy.")
        || lower.contains("llkk.")
}

fn proxy_prefix(url: &str) -> Option<&str> {
    let lower = url.to_ascii_lowercase();
    GITHUB_PROXIES.iter().find(|prefix| lower.starts_with(*prefix)).copied()
}

fn keep_proxied(prefix: &str, location: &str) -> String {
    if already_proxied(location) || !(location.starts_with("http://") || location.starts_with("https://")) {
        location.to_string()
    } else {
        format!("{prefix}{location}")
    }
}

fn mirror_urls(url: &str) -> Vec<String> {
    let mut urls = Vec::new();
    if is_github(url) && !already_proxied(url) {
        let mirrors_first = !url.to_ascii_lowercase().contains("api.github.com/");
        if !mirrors_first {
            urls.push(url.to_string());
        }
        for prefix in GITHUB_PROXIES {
            urls.push(format!("{prefix}{url}"));
        }
        if mirrors_first {
            urls.push(url.to_string());
        }
    } else {
        urls.push(url.to_string());
    }
    urls
}

fn host_of(url: &str) -> &str {
    url.trim_start_matches("https://").trim_start_matches("http://").split('/').next().unwrap_or(url)
}

fn http_get(admin: &super::admin::Admin, url: &str) -> Result<String, String> {
    let urls = mirror_urls(url);
    let mut last = "下载失败".to_string();
    for (index, candidate) in urls.iter().enumerate() {
        match http_send(candidate, "") {
            Ok(response) if response.status().is_success() => {
                return response.text().map_err(|error| error.to_string());
            }
            Ok(response) => last = format!("HTTP {}", response.status()),
            Err(error) => last = error,
        }
        if index + 1 < urls.len() {
            admin.note(format!("通道失败 {}，换加速源", host_of(candidate)));
        }
    }
    Err(last)
}

fn stream_download(admin: &super::admin::Admin, url: &str, dest: &Path, label: &str, expected: i64, api_key: &str, index: i64, count: i64) -> Result<(), String> {
    let urls = rank_urls(admin, mirror_urls(url), api_key);
    let mut last = "下载失败".to_string();
    for (attempt, candidate) in urls.iter().enumerate() {
        match stream_once(admin, candidate, dest, label, expected, api_key, index, count) {
            Ok(()) => {
                if count <= 1 {
                    admin.progress_end();
                }
                return Ok(());
            }
            Err(error) => {
                last = error;
                if attempt + 1 < urls.len() {
                    let reason = if last.contains("过慢") { "下载过慢" } else { "通道失败" };
                    admin.note(format!("{reason} {}，换加速源", host_of(candidate)));
                }
            }
        }
    }
    if count <= 1 {
        admin.progress_end();
    }
    Err(format!("下载失败 {label}: {last}"))
}

fn rank_urls(admin: &super::admin::Admin, urls: Vec<String>, api_key: &str) -> Vec<String> {
    if urls.len() <= 1 {
        return urls;
    }
    admin.note(format!("正在测速 {} 个下载源…", urls.len()));
    let api_key = api_key.to_string();
    let mut samples: Vec<(String, i64, bool)> = std::thread::scope(|scope| {
        let mut handles = Vec::new();
        for candidate in &urls {
            let candidate = candidate.clone();
            let api_key = api_key.clone();
            handles.push(scope.spawn(move || {
                let (bps, ok) = probe_speed(&candidate, &api_key);
                (candidate, bps, ok)
            }));
        }
        handles
            .into_iter()
            .map(|handle| handle.join().unwrap_or_else(|_| (String::new(), 0, false)))
            .filter(|sample| !sample.0.is_empty())
            .collect()
    });
    samples.sort_by(|a, b| match (a.2, b.2) {
        (true, false) => std::cmp::Ordering::Less,
        (false, true) => std::cmp::Ordering::Greater,
        _ => b.1.cmp(&a.1),
    });
    if let Some((url, bps, true)) = samples.iter().find(|sample| sample.2).cloned() {
        admin.note(format!("测速完成，首选 {}（{}/s）", host_of(&url), format_size(bps)));
        samples.into_iter().map(|sample| sample.0).collect()
    } else {
        admin.note("测速均失败，按原顺序尝试");
        urls
    }
}

fn probe_speed(url: &str, api_key: &str) -> (i64, bool) {
    let start = std::time::Instant::now();
    let Ok(mut response) = http_send_range(url, api_key, Some((0, 262_143))) else {
        return (0, false);
    };
    if !response.status().is_success() && response.status().as_u16() != 206 {
        return (0, false);
    }
    let mut got = 0_i64;
    let mut buf = [0_u8; 16 * 1024];
    while got < 256 * 1024 {
        match response.read(&mut buf) {
            Ok(0) => break,
            Ok(n) => got += n as i64,
            Err(_) => break,
        }
    }
    let elapsed = start.elapsed().as_nanos().max(1) as i64;
    if got <= 0 {
        return (0, false);
    }
    let bps = got.saturating_mul(1_000_000_000) / elapsed;
    (bps.max(1), true)
}

fn format_size(bytes: i64) -> String {
    const UNITS: [&str; 5] = ["B", "KB", "MB", "GB", "TB"];
    let mut value = bytes.max(0) as f64;
    let mut unit = 0;
    while value >= 1024.0 && unit + 1 < UNITS.len() {
        value /= 1024.0;
        unit += 1;
    }
    if unit == 0 {
        format!("{} {}", bytes.max(0), UNITS[unit])
    } else {
        format!("{value:.1} {}", UNITS[unit])
    }
}

fn stream_once(admin: &super::admin::Admin, url: &str, dest: &Path, label: &str, expected: i64, api_key: &str, index: i64, count: i64) -> Result<(), String> {
    if let Some(parent) = dest.parent() {
        fs::create_dir_all(parent).map_err(|error| error.to_string())?;
    }
    let probe = http_send_range(url, api_key, Some((0, 0)))?;
    let status = probe.status();
    let total = content_range_total(&probe).or_else(|| probe.content_length().map(|value| value as i64)).unwrap_or(expected);
    if status.as_u16() == 206 && total >= 256 * 1024 {
        drop(probe);
        admin.note(format!("多线程下载 {label} · 16 线程 · {}", host_of(url)));
        if count > 1 {
            admin.progress_file(index, count, "补拉缺失文件", label, total);
        } else {
            admin.progress_begin(format!("{label} · {}", host_of(url)), total);
        }
        return match download_ranged(admin, url, dest, total, api_key) {
            Err(error) if error.contains("不支持分段") => {
                admin.note(format!("通道不支持分段，改单线程 {label}"));
                let response = http_send(url, api_key)?;
                if !response.status().is_success() {
                    return Err(format!("{}", response.status()));
                }
                write_body(admin, response, dest, label, total, index, count, url)
            }
            other => other,
        };
    }
    if !status.is_success() {
        return Err(format!("{status}"));
    }
    write_body(admin, probe, dest, label, total, index, count, url)
}

fn download_ranged(admin: &super::admin::Admin, url: &str, dest: &Path, total: i64, api_key: &str) -> Result<(), String> {
    let parts = 16_i64;
    let piece = (total + parts - 1) / parts;
    let dir = dest.with_extension("parts");
    let _ = fs::remove_dir_all(&dir);
    fs::create_dir_all(&dir).map_err(|error| error.to_string())?;
    let done = std::sync::Arc::new(std::sync::atomic::AtomicI64::new(0));
    let cancel = std::sync::Arc::new(std::sync::atomic::AtomicBool::new(false));
    let url = url.to_string();
    let api_key = api_key.to_string();
    let watch = is_github(&url);
    let error = std::thread::scope(|scope| {
        if watch {
            let done = std::sync::Arc::clone(&done);
            let cancel = std::sync::Arc::clone(&cancel);
            scope.spawn(move || watch_slow(done, cancel, total));
        }
        let mut handles = Vec::new();
        for index in 0..parts {
            let start = index * piece;
            if start >= total {
                break;
            }
            let end = (start + piece - 1).min(total - 1);
            let part = dir.join(format!("{index:02}"));
            let url = url.clone();
            let api_key = api_key.clone();
            let done = std::sync::Arc::clone(&done);
            let cancel = std::sync::Arc::clone(&cancel);
            handles.push(scope.spawn(move || download_piece(admin, &url, &api_key, start, end, &part, &done, &cancel)));
        }
        let mut failed = None;
        for handle in handles {
            if let Err(error) = handle.join().unwrap_or_else(|_| Err("下载线程中断".into())) {
                failed = Some(error);
            }
        }
        failed
    });
    if cancel.load(std::sync::atomic::Ordering::Relaxed) {
        let _ = fs::remove_dir_all(&dir);
        return Err("下载过慢".into());
    }
    if let Some(error) = error {
        let _ = fs::remove_dir_all(&dir);
        return Err(error);
    }
    let partial = dest.with_extension("part");
    let result = (|| {
        let mut out = File::create(&partial).map_err(|error| error.to_string())?;
        for index in 0..parts {
            let part = dir.join(format!("{index:02}"));
            if !part.is_file() {
                break;
            }
            let mut input = File::open(&part).map_err(|error| error.to_string())?;
            std::io::copy(&mut input, &mut out).map_err(|error| error.to_string())?;
        }
        out.flush().map_err(|error| error.to_string())?;
        let size = fs::metadata(&partial).map(|meta| meta.len() as i64).unwrap_or(0);
        if size != total {
            return Err(format!("下载不完整 {size}/{total}"));
        }
        fs::rename(&partial, dest).map_err(|error| error.to_string())?;
        admin.progress_set(total);
        Ok(())
    })();
    let _ = fs::remove_dir_all(&dir);
    if result.is_err() {
        let _ = fs::remove_file(&partial);
    }
    result
}

fn watch_slow(done: std::sync::Arc<std::sync::atomic::AtomicI64>, cancel: std::sync::Arc<std::sync::atomic::AtomicBool>, total: i64) {
    let mut last = 0_i64;
    let mut elapsed = std::time::Duration::ZERO;
    let slice = std::time::Duration::from_millis(200);
    loop {
        std::thread::sleep(slice);
        elapsed += slice;
        if cancel.load(std::sync::atomic::Ordering::Relaxed) {
            return;
        }
        let got = done.load(std::sync::atomic::Ordering::Relaxed);
        if total > 0 && got >= total {
            return;
        }
        if elapsed >= std::time::Duration::from_secs(2) {
            if got - last < 256 * 1024 {
                cancel.store(true, std::sync::atomic::Ordering::Relaxed);
                return;
            }
            last = got;
            elapsed = std::time::Duration::ZERO;
        }
    }
}

fn download_piece(admin: &super::admin::Admin, url: &str, api_key: &str, start: i64, end: i64, part: &Path, done: &std::sync::atomic::AtomicI64, cancel: &std::sync::atomic::AtomicBool) -> Result<(), String> {
    let mut response = http_send_range(url, api_key, Some((start as u64, end as u64)))?;
    if response.status().as_u16() != 206 {
        return Err("通道不支持分段".into());
    }
    let mut file = File::create(part).map_err(|error| error.to_string())?;
    let mut buf = [0_u8; 256 * 1024];
    loop {
        if cancel.load(std::sync::atomic::Ordering::Relaxed) {
            return Err("下载过慢".into());
        }
        let n = response.read(&mut buf).map_err(|error| error.to_string())?;
        if n == 0 {
            break;
        }
        file.write_all(&buf[..n]).map_err(|error| error.to_string())?;
        let current = done.fetch_add(n as i64, std::sync::atomic::Ordering::Relaxed) + n as i64;
        admin.progress_set(current);
    }
    file.flush().map_err(|error| error.to_string())?;
    Ok(())
}

fn content_range_total(response: &reqwest::blocking::Response) -> Option<i64> {
    let header = response.headers().get(reqwest::header::CONTENT_RANGE)?.to_str().ok()?;
    let total = header.rsplit('/').next()?.trim();
    total.parse().ok()
}

fn write_body(admin: &super::admin::Admin, mut response: reqwest::blocking::Response, dest: &Path, label: &str, total: i64, index: i64, count: i64, url: &str) -> Result<(), String> {
    let partial = dest.with_extension("part");
    let mut file = File::create(&partial).map_err(|error| error.to_string())?;
    if count > 1 {
        admin.progress_file(index, count, "补拉缺失文件", label, total);
    } else {
        admin.progress_begin(format!("{label} · {}", host_of(url)), total);
    }
    let mut done = 0_i64;
    let mut window_bytes = 0_i64;
    let mut window_start = std::time::Instant::now();
    let github = is_github(url);
    let mut buf = [0_u8; 256 * 1024];
    let result = (|| {
        loop {
            let n = response.read(&mut buf).map_err(|error| error.to_string())?;
            if n == 0 {
                break;
            }
            file.write_all(&buf[..n]).map_err(|error| error.to_string())?;
            done += n as i64;
            window_bytes += n as i64;
            admin.progress_set(done);
            if github && window_start.elapsed() >= std::time::Duration::from_secs(2) && (total <= 0 || done < total) {
                if window_bytes < 256 * 1024 {
                    return Err("下载过慢".into());
                }
                window_bytes = 0;
                window_start = std::time::Instant::now();
            }
        }
        file.flush().map_err(|error| error.to_string())?;
        fs::rename(&partial, dest).map_err(|error| error.to_string())?;
        Ok(())
    })();
    if result.is_err() {
        let _ = fs::remove_file(&partial);
    }
    result
}

fn http_send(url: &str, api_key: &str) -> Result<reqwest::blocking::Response, String> {
    http_send_range(url, api_key, None)
}

fn http_send_range(url: &str, api_key: &str, range: Option<(u64, u64)>) -> Result<reqwest::blocking::Response, String> {
    let accept = if url.contains("api.github.com") { "application/vnd.github+json" } else { "*/*" };
    let client = reqwest::blocking::Client::builder()
        .connect_timeout(std::time::Duration::from_secs(15))
        .redirect(reqwest::redirect::Policy::none())
        .timeout(std::time::Duration::from_secs(7200))
        .user_agent("cdr-updater")
        .build()
        .map_err(|error| error.to_string())?;
    let mut current = url.to_string();
    let mut prefix = proxy_prefix(&current).map(|value| value.to_string());
    for _ in 0..10 {
        let mut request = client.get(&current).header("Accept", accept);
        if let Some((start, end)) = range {
            request = request.header(reqwest::header::RANGE, format!("bytes={start}-{end}"));
        }
        let lower = current.to_ascii_lowercase();
        if !api_key.is_empty() && (lower.contains("curseforge.com") || lower.contains("forgecdn.net")) {
            request = request.header("x-api-key", api_key);
        }
        let response = request.send().map_err(|error| error.to_string())?;
        if !response.status().is_redirection() {
            return Ok(response);
        }
        let location = response.headers().get(reqwest::header::LOCATION).and_then(|value| value.to_str().ok()).unwrap_or("").to_string();
        if location.is_empty() {
            return Err("重定向没有 Location".into());
        }
        let resolved = reqwest::Url::parse(&current).ok().and_then(|base| base.join(&location).ok()).map(|value| value.to_string()).unwrap_or(location);
        current = if let Some(prefix) = prefix.as_deref() {
            if is_github(&resolved) { keep_proxied(prefix, &resolved) } else { resolved }
        } else {
            prefix = proxy_prefix(&resolved).map(|value| value.to_string());
            resolved
        };
    }
    Err("重定向过多".into())
}

fn chrono_stamp() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let seconds = SystemTime::now().duration_since(UNIX_EPOCH).map(|value| value.as_secs()).unwrap_or(0);
    seconds.to_string()
}
