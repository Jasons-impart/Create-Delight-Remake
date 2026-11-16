//! Temporary pack cache. Caller holds PACK_BUILD for collection/admission.
use std::collections::{HashMap, HashSet};
use std::fs;
use std::path::{Path, PathBuf};
use std::time::{Duration, SystemTime};

pub const PACK_TTL: Duration = Duration::from_secs(2 * 60 * 60);
const PACK_BUDGET: u64 = 4 * 1024 * 1024 * 1024;
const DISK_RESERVE: u64 = 2 * 1024 * 1024 * 1024;

fn json(path: &Path) -> Result<serde_json::Value, String> {
    serde_json::from_slice(&fs::read(path).map_err(|e| e.to_string())?).map_err(|e| e.to_string())
}

pub fn manifest_refs(data: &Path) -> Result<HashSet<String>, String> {
    let mut refs = HashSet::new();
    // Fail closed: never collect when either published manifest is unreadable.
    for side in ["client", "server"] {
        let doc = json(&data.join("manifests").join(format!("{side}.json")))?;
        let files = doc["files"].as_array().ok_or("清单缺少 files")?;
        for file in files {
            let sum = file["sha256"].as_str().ok_or("清单缺少哈希")?;
            if !super::is_sha256(sum) {
                return Err("清单哈希无效".into());
            }
            refs.insert(sum.to_ascii_lowercase());
        }
    }
    if refs.is_empty() {
        return Err("清单为空，停止回收".into());
    }
    Ok(refs)
}

struct Cached {
    object: PathBuf,
    metadata: Vec<PathBuf>,
    used: SystemTime,
}

pub fn collect(data: &Path, now: SystemTime) -> Result<u64, String> {
    let refs = manifest_refs(data)?;
    let packs = data.join("packs");
    fs::create_dir_all(&packs).map_err(|e| e.to_string())?;
    let mut groups: HashMap<String, Cached> = HashMap::new();
    let mut leftovers = Vec::new();
    // Validate the entire inventory before deleting anything.
    for entry in fs::read_dir(&packs).map_err(|e| e.to_string())? {
        let path = entry.map_err(|e| e.to_string())?.path();
        if !path.is_file() {
            continue;
        }
        let info = fs::metadata(&path).map_err(|e| e.to_string())?;
        if path.extension().is_some_and(|x| x == "json") {
            let doc = json(&path)?;
            let sum = doc["sha256"]
                .as_str()
                .filter(|s| super::is_sha256(s))
                .ok_or("压缩包元数据哈希无效")?
                .to_ascii_lowercase();
            let object = data.join("objects").join(&sum[..2]).join(&sum);
            let used = info.modified().map_err(|e| e.to_string())?;
            let group = groups.entry(sum).or_insert(Cached {
                object,
                metadata: Vec::new(),
                used,
            });
            group.used = group.used.max(used);
            group.metadata.push(path);
        } else if path
            .file_name()
            .unwrap()
            .to_string_lossy()
            .starts_with("build-")
            || path.extension().is_some_and(|x| x == "tmp")
        {
            leftovers.push((path, info));
        }
    }
    // A crash after moving the ZIP but before publishing metadata can leave an
    // unreferenced object. Apply the same grace period to that temporary data.
    let mut orphans = Vec::new();
    for shard in fs::read_dir(data.join("objects")).map_err(|e| e.to_string())? {
        let shard = shard.map_err(|e| e.to_string())?;
        if !shard.file_type().map_err(|e| e.to_string())?.is_dir() {
            continue;
        }
        for entry in fs::read_dir(shard.path()).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            if !entry.file_type().map_err(|e| e.to_string())?.is_file() {
                continue;
            }
            let sum = entry.file_name().to_string_lossy().to_string();
            if !super::is_sha256(&sum) || refs.contains(&sum) || groups.contains_key(&sum) {
                continue;
            }
            let info = entry.metadata().map_err(|e| e.to_string())?;
            if info.is_file()
                && now
                    .duration_since(info.modified().map_err(|e| e.to_string())?)
                    .unwrap_or_default()
                    >= PACK_TTL
            {
                orphans.push((entry.path(), info.len()));
            }
        }
    }
    let mut freed = 0;
    for (sum, mut group) in groups {
        let info = match fs::metadata(&group.object) {
            Ok(info) => Some(info),
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => None,
            Err(e) => return Err(e.to_string()),
        };
        if let Some(info) = &info {
            group.used = group.used.max(info.modified().map_err(|e| e.to_string())?);
        }
        if now.duration_since(group.used).unwrap_or_default() < PACK_TTL {
            continue;
        }
        if !refs.contains(&sum) {
            if let Some(info) = info {
                fs::remove_file(&group.object).map_err(|e| e.to_string())?;
                freed += info.len();
            }
        }
        for path in group.metadata {
            fs::remove_file(path).map_err(|e| e.to_string())?;
        }
    }
    for (path, info) in leftovers {
        if now
            .duration_since(info.modified().map_err(|e| e.to_string())?)
            .unwrap_or_default()
            >= PACK_TTL
        {
            fs::remove_file(path).map_err(|e| e.to_string())?;
            freed += info.len();
        }
    }
    for (path, size) in orphans {
        fs::remove_file(path).map_err(|e| e.to_string())?;
        freed += size;
    }
    Ok(freed)
}

pub fn admit(data: &Path, files: &[super::PackItem]) -> Result<(), String> {
    let refs = manifest_refs(data)?;
    let mut used = 0u64;
    for shard in fs::read_dir(data.join("objects")).map_err(|e| e.to_string())? {
        let shard = shard.map_err(|e| e.to_string())?;
        if !shard.file_type().map_err(|e| e.to_string())?.is_dir() {
            continue;
        }
        for entry in fs::read_dir(shard.path()).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            if !refs.contains(&entry.file_name().to_string_lossy().to_string()) {
                used = used.saturating_add(entry.metadata().map_err(|e| e.to_string())?.len());
            }
        }
    }
    // Include interrupted ZIPs and metadata in the same cache budget.
    if data.join("packs").exists() {
        for entry in fs::read_dir(data.join("packs")).map_err(|e| e.to_string())? {
            used = used.saturating_add(
                entry
                    .map_err(|e| e.to_string())?
                    .metadata()
                    .map_err(|e| e.to_string())?
                    .len(),
            );
        }
    }
    // Conservative deflate/ZIP bound; reserve the entire output before writing.
    let mut needed = 2 * 1024 * 1024u64;
    for file in files {
        let size = fs::metadata(
            data.join("objects")
                .join(&file.sha256[..2])
                .join(&file.sha256),
        )
        .map_err(|e| e.to_string())?
        .len();
        needed = needed
            .saturating_add(size)
            .saturating_add(size / 100)
            .saturating_add(65536 + 2 * file.path.len() as u64);
    }
    check_capacity(used, needed, free_bytes(data)?)
}

fn check_capacity(used: u64, needed: u64, free: u64) -> Result<(), String> {
    if used.saturating_add(needed) > PACK_BUDGET {
        return Err("临时压缩包缓存已达 4 GiB 上限，请稍后重试或逐文件下载".into());
    }
    if needed.saturating_add(DISK_RESERVE) > free {
        return Err("磁盘空间不足，需保留 2 GiB 可用空间，请稍后重试或逐文件下载".into());
    }
    Ok(())
}

#[cfg(unix)]
fn free_bytes(path: &Path) -> Result<u64, String> {
    use std::os::unix::ffi::OsStrExt;
    let path = std::ffi::CString::new(path.as_os_str().as_bytes()).map_err(|e| e.to_string())?;
    let mut stat = std::mem::MaybeUninit::<libc::statvfs>::uninit();
    if unsafe { libc::statvfs(path.as_ptr(), stat.as_mut_ptr()) } != 0 {
        return Err(std::io::Error::last_os_error().to_string());
    }
    let stat = unsafe { stat.assume_init() };
    Ok((stat.f_bavail as u64).saturating_mul(stat.f_frsize as u64))
}

#[cfg(windows)]
fn free_bytes(path: &Path) -> Result<u64, String> {
    use std::os::windows::ffi::OsStrExt;
    #[link(name = "kernel32")]
    extern "system" {
        fn GetDiskFreeSpaceExW(
            path: *const u16,
            available: *mut u64,
            total: *mut u64,
            free: *mut u64,
        ) -> i32;
    }
    let wide: Vec<u16> = path.as_os_str().encode_wide().chain(Some(0)).collect();
    let mut available = 0;
    if unsafe {
        GetDiskFreeSpaceExW(
            wide.as_ptr(),
            &mut available,
            std::ptr::null_mut(),
            std::ptr::null_mut(),
        )
    } == 0
    {
        return Err(std::io::Error::last_os_error().to_string());
    }
    Ok(available)
}

#[cfg(not(any(unix, windows)))]
fn free_bytes(_path: &Path) -> Result<u64, String> {
    Err("此平台无法检查磁盘余量".into())
}

#[cfg(test)]
mod tests {
    use super::*;
    fn put(data: &Path, sum: &str, age: SystemTime) -> PathBuf {
        let path = data.join("objects").join(&sum[..2]).join(sum);
        fs::create_dir_all(path.parent().unwrap()).unwrap();
        fs::write(&path, b"payload").unwrap();
        fs::OpenOptions::new()
            .write(true)
            .open(&path)
            .unwrap()
            .set_times(fs::FileTimes::new().set_modified(age))
            .unwrap();
        path
    }
    #[test]
    fn expiry_protects_manifests_and_recent_reuse_and_fails_closed() {
        let data = std::env::temp_dir().join(format!("cdr-gc-{}", std::process::id()));
        let _ = fs::remove_dir_all(&data);
        fs::create_dir_all(data.join("manifests")).unwrap();
        fs::create_dir_all(data.join("packs")).unwrap();
        let now = SystemTime::now();
        let old = now - PACK_TTL - Duration::from_secs(60);
        let official = "a".repeat(64);
        let expired = "b".repeat(64);
        let recent = "c".repeat(64);
        let official_path = put(&data, &official, old);
        let expired_path = put(&data, &expired, old);
        let recent_path = put(&data, &recent, now);
        let orphan_path = put(&data, &"d".repeat(64), old);
        let fresh_orphan = put(&data, &"e".repeat(64), now);
        let interrupted = data.join("packs/build-interrupted.zip");
        fs::write(&interrupted, b"partial").unwrap();
        fs::OpenOptions::new()
            .write(true)
            .open(&interrupted)
            .unwrap()
            .set_times(fs::FileTimes::new().set_modified(old))
            .unwrap();
        for side in ["client", "server"] {
            fs::write(
                data.join("manifests").join(format!("{side}.json")),
                serde_json::to_vec(&serde_json::json!({"files":[{"sha256":official}]})).unwrap(),
            )
            .unwrap();
        }
        for sum in [&official, &expired, &recent] {
            let path = data.join("packs").join(format!("{sum}.json"));
            fs::write(
                &path,
                serde_json::to_vec(
                    &serde_json::json!({"sha256":sum,"holders":50,"leases":["abandoned"]}),
                )
                .unwrap(),
            )
            .unwrap();
            fs::OpenOptions::new()
                .write(true)
                .open(&path)
                .unwrap()
                .set_times(fs::FileTimes::new().set_modified(old))
                .unwrap();
        }
        fs::write(data.join("packs/bad.json"), b"{").unwrap();
        assert!(collect(&data, now).is_err());
        assert!(expired_path.exists());
        fs::remove_file(data.join("packs/bad.json")).unwrap();
        assert_eq!(collect(&data, now).unwrap(), 21);
        assert!(official_path.exists());
        assert!(!expired_path.exists());
        assert!(recent_path.exists());
        assert!(!orphan_path.exists());
        assert!(!interrupted.exists());
        assert!(fresh_orphan.exists());
        fs::write(data.join("manifests/server.json"), b"{").unwrap();
        assert!(collect(&data, now + PACK_TTL).is_err());
        assert!(recent_path.exists());
        fs::remove_dir_all(data).unwrap();
    }
    #[test]
    fn capacity_reserves_output_and_disk_headroom() {
        assert!(check_capacity(PACK_BUDGET - 100, 101, u64::MAX).is_err());
        assert!(check_capacity(0, 101, DISK_RESERVE + 100).is_err());
        assert!(check_capacity(0, 100, DISK_RESERVE + 100).is_ok());
        assert!(check_capacity(u64::MAX, 100, u64::MAX).is_err());
    }
}
