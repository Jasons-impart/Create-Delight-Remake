mod serve;

use std::env;
use std::path::PathBuf;
use std::process::ExitCode;

#[tokio::main]
async fn main() -> ExitCode {
    let mut args = env::args().skip(1);
    let command = args.next();
    if command.as_deref() != Some("serve") {
        eprintln!("用法: cdr-updater-server serve --config config.toml");
        return ExitCode::from(2);
    }
    let mut config = PathBuf::from("config.toml");
    while let Some(arg) = args.next() {
        if arg == "--config" {
            if let Some(path) = args.next() {
                config = PathBuf::from(path);
            }
        }
    }
    let settings = serve::Config::read(&config);
    let data = settings.data_dir(&config);
    let addr = format!("{}:{}", settings.listen, settings.port);
    println!("Rust 更新服务器已启动 http://{addr}");
    println!("清单不缓存，文件按哈希长期缓存，支持断点续传。");
    println!("网页管理 http://{addr}/admin/ifgfsgfbijuzoxzq");
    if let Err(error) = serve::listen(addr, data, config).await {
        eprintln!("{error}");
        return ExitCode::from(1);
    }
    ExitCode::SUCCESS
}
