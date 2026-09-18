package com.jsi.cdr.updater;

import javax.swing.BorderFactory;
import javax.swing.DefaultComboBoxModel;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JProgressBar;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTable;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;
import javax.swing.SwingUtilities;
import javax.swing.Timer;
import javax.swing.UIManager;
import javax.swing.WindowConstants;
import javax.swing.filechooser.FileSystemView;
import javax.swing.table.DefaultTableModel;
import java.awt.BorderLayout;
import java.awt.Desktop;
import java.awt.FlowLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.Toolkit;
import java.awt.datatransfer.StringSelection;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.File;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicBoolean;

final class AdminApp {
    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
            .withZone(ZoneId.systemDefault());

    private AdminApp() {}

    static void launchBlocking(ServerRuntime runtime) throws InterruptedException {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception ignored) {
            // keep default look
        }
        CountDownLatch done = new CountDownLatch(1);
        SwingUtilities.invokeLater(() -> {
            JFrame frame = create(runtime);
            frame.addWindowListener(new WindowAdapter() {
                @Override
                public void windowClosed(WindowEvent event) {
                    done.countDown();
                }
            });
            frame.setVisible(true);
        });
        done.await();
    }

    private static JFrame create(ServerRuntime runtime) {
        JFrame frame = new JFrame("Create Delight Remake 更新服务器");
        frame.setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);
        frame.setSize(980, 680);
        frame.setLocationRelativeTo(null);

        JLabel summary = new JLabel();
        JTextArea log = new JTextArea();
        log.setEditable(false);
        log.setLineWrap(true);
        log.setWrapStyleWord(true);
        JProgressBar progress = new JProgressBar(0, 1000);
        progress.setStringPainted(true);
        progress.setString("");
        progress.setVisible(false);

        DefaultTableModel serversModel = new DefaultTableModel(new Object[]{"主机", "实例目录", "远程地址", "首次连接", "最近连接", "同步次数"}, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        JTable serversTable = new JTable(serversModel);
        serversTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        serversTable.setAutoResizeMode(JTable.AUTO_RESIZE_LAST_COLUMN);

        DefaultTableModel privateModel = new DefaultTableModel(new Object[]{"游戏内路径", "端侧", "本地文件"}, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };
        JTable privateTable = new JTable(privateModel);
        privateTable.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);

        JComboBox<String> versions = new JComboBox<>();
        versions.setEditable(true);
        versions.setModel(new DefaultComboBoxModel<>());
        versions.setSelectedItem(runtime.config().officialVersion);

        JTextField listenField = new JTextField(runtime.config().listen);
        JTextField portField = new JTextField(Integer.toString(runtime.config().port));
        JTextField publicUrlField = new JTextField(runtime.config().updateServerUrl);
        JTextField tokenField = new JTextField(runtime.config().accessToken);
        JTextField adminTokenField = new JTextField(runtime.config().adminToken);
        JTextField adminUrlField = new JTextField(adminUrl(runtime));
        adminUrlField.setEditable(false);

        AtomicBoolean busy = new AtomicBoolean(false);
        JButton addPrivate = new JButton("添加私货");
        JButton removePrivate = new JButton("删除所选");
        JButton refreshTags = new JButton("刷新 GitHub 版本");
        JButton applyVersion = new JButton("应用并重新拉取");
        JButton rebuild = new JButton("重新构建仓库");
        JButton exportPcl2 = new JButton("导出 PCL2 整合包");
        JButton exportServer = new JButton("导出服务端");
        JButton applyConnection = new JButton("保存连接地址");
        JButton generateToken = new JButton("随机生成同步令牌");
        JButton applyAdminToken = new JButton("保存网页令牌");
        JButton generateAdminToken = new JButton("随机生成网页令牌");
        JButton openAdminPage = new JButton("打开管理网页");
        JButton copyAdminUrl = new JButton("复制地址");
        JButton detectWan = new JButton("检测地址");
        JButton openWan = new JButton("开放外网访问");

        Runnable refreshServers = () -> {
            try {
                List<Connections.Record> records = Connections.list(runtime.config());
                serversModel.setRowCount(0);
                for (Connections.Record record : records) {
                    serversModel.addRow(new Object[]{
                            record.hostname,
                            record.instancePath,
                            record.remote,
                            formatTime(record.firstSeen),
                            formatTime(record.lastSeen),
                            record.syncCount
                    });
                }
                Pack.Config config = runtime.config();
                adminUrlField.setText(adminUrl(runtime));
                summary.setText("  监听 " + config.listen + ":" + config.port
                        + "    对外 " + config.updateServerUrl
                        + "    官方版本 " + config.officialVersion
                        + "    同步令牌 " + (config.accessToken.isBlank() ? "未设置" : "已启用")
                        + "    网页令牌 " + (config.adminToken.isBlank() ? "未设置" : "已启用")
                        + "    网页 " + adminUrl(runtime)
                        + "    已有 " + records.size() + " 台服务端连接过（客户端连接不记录）");
            } catch (Exception error) {
                summary.setText("  无法读取连接记录：" + error.getMessage());
            }
        };

        Runnable refreshPrivates = () -> {
            try {
                privateModel.setRowCount(0);
                for (Pack.PrivateFile file : Privates.list(runtime.config())) {
                    privateModel.addRow(new Object[]{file.path, sideLabel(file.side), file.source.toString()});
                }
            } catch (Exception error) {
                append(log, "读取私货失败：" + error.getMessage());
            }
        };

        java.util.function.Consumer<String> logger = line -> {
            runtime.note(line);
            SwingUtilities.invokeLater(() -> append(log, line));
        };

        java.util.function.Consumer<Throwing> background = task -> {
            if (!busy.compareAndSet(false, true)) {
                JOptionPane.showMessageDialog(frame, "正在处理上一项操作，请稍候。", "忙碌中", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            setEnabled(false, addPrivate, removePrivate, applyVersion, rebuild, refreshTags, exportPcl2, exportServer, applyConnection, generateToken, applyAdminToken, generateAdminToken, detectWan, openWan);
            new Thread(() -> {
                try {
                    task.run();
                    SwingUtilities.invokeLater(() -> {
                        versions.setSelectedItem(runtime.config().officialVersion);
                        listenField.setText(runtime.config().listen);
                        portField.setText(Integer.toString(runtime.config().port));
                        publicUrlField.setText(runtime.config().updateServerUrl);
                        tokenField.setText(runtime.config().accessToken);
                        adminTokenField.setText(runtime.config().adminToken);
                        refreshServers.run();
                        refreshPrivates.run();
                    });
                } catch (Exception error) {
                    SwingUtilities.invokeLater(() -> {
                        append(log, "失败：" + error.getMessage());
                        JOptionPane.showMessageDialog(frame, error.getMessage(), "操作失败", JOptionPane.ERROR_MESSAGE);
                    });
                } finally {
                    busy.set(false);
                    SwingUtilities.invokeLater(() -> setEnabled(true, addPrivate, removePrivate, applyVersion, rebuild, refreshTags, exportPcl2, exportServer, applyConnection, generateToken, applyAdminToken, generateAdminToken, detectWan, openWan));
                }
            }, "cdr-admin").start();
        };

        addPrivate.addActionListener(event -> {
            JFileChooser chooser = new JFileChooser();
            chooser.setDialogTitle("选择要加入私货的文件");
            chooser.setFileSelectionMode(JFileChooser.FILES_ONLY);
            if (chooser.showOpenDialog(frame) != JFileChooser.APPROVE_OPTION) {
                return;
            }
            Path source;
            try {
                source = realPath(chooser.getSelectedFile(), chooser.getCurrentDirectory());
                if (!Files.isRegularFile(source)) {
                    throw new IllegalArgumentException("请从磁盘上的真实文件夹选择文件");
                }
            } catch (Exception error) {
                JOptionPane.showMessageDialog(frame, "无法打开该文件。请从桌面、文档或某个磁盘里的真实文件夹选择，不要选「此电脑」。",
                        "文件无效", JOptionPane.WARNING_MESSAGE);
                return;
            }
            JTextField dest = new JTextField(Privates.defaultDest(source));
            JComboBox<String> side = new JComboBox<>(new String[]{"自动判定", "仅客户端", "仅服务端", "两端"});
            JPanel form = new JPanel(new GridBagLayout());
            GridBagConstraints c = new GridBagConstraints();
            c.insets = new Insets(4, 4, 4, 4);
            c.fill = GridBagConstraints.HORIZONTAL;
            c.gridx = 0;
            c.gridy = 0;
            form.add(new JLabel("游戏内路径"), c);
            c.gridx = 1;
            c.weightx = 1;
            form.add(dest, c);
            c.gridx = 0;
            c.gridy = 1;
            c.weightx = 0;
            form.add(new JLabel("端侧"), c);
            c.gridx = 1;
            form.add(side, c);
            if (JOptionPane.showConfirmDialog(frame, form, "添加私货", JOptionPane.OK_CANCEL_OPTION) != JOptionPane.OK_OPTION) {
                return;
            }
            String chosen = switch (String.valueOf(side.getSelectedItem())) {
                case "仅客户端" -> "client";
                case "仅服务端" -> "server";
                case "两端" -> "both";
                default -> "auto";
            };
            background.accept(() -> runtime.addPrivate(source, dest.getText().trim(), chosen, logger));
        });

        removePrivate.addActionListener(event -> {
            int row = privateTable.getSelectedRow();
            if (row < 0) {
                JOptionPane.showMessageDialog(frame, "请先在列表中选择要删除的私货。", "未选择", JOptionPane.WARNING_MESSAGE);
                return;
            }
            String path = String.valueOf(privateModel.getValueAt(row, 0));
            if (JOptionPane.showConfirmDialog(frame, "删除私货 " + path + "？\n仓库会重新构建，已连接的服务端下次同步才会拿到变更。",
                    "确认删除", JOptionPane.OK_CANCEL_OPTION) != JOptionPane.OK_OPTION) {
                return;
            }
            background.accept(() -> runtime.removePrivate(path, logger));
        });

        refreshTags.addActionListener(event -> background.accept(() -> {
            logger.accept("正在读取 GitHub Release 列表");
            List<String> tags = Pack.listReleaseTags(runtime.config());
            SwingUtilities.invokeLater(() -> {
                DefaultComboBoxModel<String> model = new DefaultComboBoxModel<>();
                for (String tag : tags) {
                    model.addElement(tag);
                }
                versions.setModel(model);
                versions.setSelectedItem(runtime.config().officialVersion);
            });
            logger.accept("已加载 " + tags.size() + " 个 GitHub 版本");
        }));

        applyVersion.addActionListener(event -> {
            Object selected = versions.getEditor().getItem();
            String tag = selected == null ? "" : selected.toString().trim();
            if (tag.isBlank()) {
                JOptionPane.showMessageDialog(frame, "请填写 GitHub Release 标签，例如 v0.5.0.13-test。", "缺少版本", JOptionPane.WARNING_MESSAGE);
                return;
            }
            if (JOptionPane.showConfirmDialog(frame,
                    "将官方版本改为 " + tag + " 并重新从 GitHub 拉取？\n完整服务端包可能超过 800MB。",
                    "切换版本", JOptionPane.OK_CANCEL_OPTION) != JOptionPane.OK_OPTION) {
                return;
            }
            background.accept(() -> runtime.setOfficialVersion(tag, logger));
        });

        rebuild.addActionListener(event -> background.accept(() -> {
            logger.accept("开始重新构建仓库");
            runtime.rebuild(logger);
        }));

        exportPcl2.addActionListener(event -> {
            Path chosen = chooseSave(frame, "导出 PCL2 整合包",
                    runtime.config().packName + "-" + runtime.config().officialVersion + "-PCL2.zip");
            if (chosen == null) {
                return;
            }
            background.accept(() -> runtime.exportPcl2(chosen, logger));
        });

        exportServer.addActionListener(event -> {
            Path chosen = chooseSave(frame, "导出服务端",
                    runtime.config().packName + "-" + runtime.config().officialVersion + "-Server.zip");
            if (chosen == null) {
                return;
            }
            background.accept(() -> runtime.exportServer(chosen, logger));
        });

        applyConnection.addActionListener(event -> {
            int port;
            try {
                port = Integer.parseInt(portField.getText().trim());
            } catch (NumberFormatException error) {
                JOptionPane.showMessageDialog(frame, "端口必须是数字。", "端口无效", JOptionPane.WARNING_MESSAGE);
                return;
            }
            String bind = listenField.getText().trim();
            String url = publicUrlField.getText().trim();
            String token = tokenField.getText().trim();
            if (JOptionPane.showConfirmDialog(frame,
                    "将监听改为 " + bind + ":" + port + "\n对外地址改为 " + url
                            + "\n同步令牌：" + (token.isBlank() ? "空（不校验）" : "已填写")
                            + "\n\n已经装好的客户端/服务端不会自动改，需要重新导出，或手动改实例里的 cdr-updater.toml。\n网页登录令牌请到「网页管理」页设置。",
                    "保存连接地址", JOptionPane.OK_CANCEL_OPTION) != JOptionPane.OK_OPTION) {
                return;
            }
            background.accept(() -> runtime.setConnection(bind, port, url, token, runtime.config().adminToken, logger));
        });

        applyAdminToken.addActionListener(event -> {
            String adminToken = adminTokenField.getText().trim();
            if (JOptionPane.showConfirmDialog(frame,
                    "网页登录地址：" + adminUrl(runtime)
                            + "\n网页令牌：" + (adminToken.isBlank() ? "空（仅本机可登录网页）" : "已填写")
                            + "\n\n这是管理网页的登录密码，不会写入导出的整合包，也不能和同步令牌相同。",
                    "保存网页令牌", JOptionPane.OK_CANCEL_OPTION) != JOptionPane.OK_OPTION) {
                return;
            }
            background.accept(() -> runtime.setAdminToken(adminToken, logger));
        });

        generateToken.addActionListener(event -> tokenField.setText(java.util.UUID.randomUUID().toString().replace("-", "")));
        generateAdminToken.addActionListener(event -> adminTokenField.setText(java.util.UUID.randomUUID().toString().replace("-", "")));
        openAdminPage.addActionListener(event -> openUrl(frame, adminUrl(runtime)));
        copyAdminUrl.addActionListener(event -> {
            copyText(adminUrl(runtime));
            append(log, "已复制管理网页地址");
        });

        detectWan.addActionListener(event -> background.accept(() -> {
            logger.accept("正在检测本机网卡和外网 IP");
            Wan.Report report = Wan.discover(runtime.config().port, logger);
            SwingUtilities.invokeLater(() -> {
                listenField.setText("0.0.0.0");
                if (report.suggestedUrl != null && !report.suggestedUrl.isBlank()) {
                    publicUrlField.setText(report.suggestedUrl);
                }
            });
        }));

        openWan.addActionListener(event -> {
            if (JOptionPane.showConfirmDialog(frame,
                    "将监听改为 0.0.0.0，并用检测到的公网 IP 作为对外地址。\n会尝试放行 Windows 防火墙。\n若电脑在路由器后面，还要在路由器把 TCP 端口映射到这台电脑。",
                    "开放外网访问", JOptionPane.OK_CANCEL_OPTION) != JOptionPane.OK_OPTION) {
                return;
            }
            background.accept(() -> runtime.enableWan(logger));
        });

        JPanel versionBar = new JPanel(new BorderLayout(8, 8));
        versionBar.setBorder(BorderFactory.createEmptyBorder(12, 12, 12, 12));
        JPanel versionRow = new JPanel(new BorderLayout(8, 0));
        versionRow.add(new JLabel("GitHub 版本"), BorderLayout.WEST);
        versionRow.add(versions, BorderLayout.CENTER);
        JPanel versionButtons = new JPanel(new FlowLayout(FlowLayout.RIGHT, 8, 0));
        versionButtons.add(refreshTags);
        versionButtons.add(applyVersion);
        versionBar.add(versionRow, BorderLayout.NORTH);
        versionBar.add(versionButtons, BorderLayout.CENTER);
        versionBar.add(new JLabel("<html>填写仓库 Release 标签，例如 v0.5.0.13-test。<br>应用后会写入 config.toml 并重新拉取 Client / Server 包，不完整的下载会被删掉重来。</html>"), BorderLayout.SOUTH);

        JPanel connectionForm = new JPanel(new GridBagLayout());
        connectionForm.setBorder(BorderFactory.createEmptyBorder(12, 12, 12, 12));
        GridBagConstraints gc = new GridBagConstraints();
        gc.insets = new Insets(4, 4, 4, 4);
        gc.fill = GridBagConstraints.HORIZONTAL;
        gc.gridx = 0;
        gc.gridy = 0;
        gc.weightx = 0;
        connectionForm.add(new JLabel("监听地址"), gc);
        gc.gridx = 1;
        gc.weightx = 1;
        connectionForm.add(listenField, gc);
        gc.gridx = 0;
        gc.gridy = 1;
        gc.weightx = 0;
        connectionForm.add(new JLabel("端口"), gc);
        gc.gridx = 1;
        gc.weightx = 1;
        connectionForm.add(portField, gc);
        gc.gridx = 0;
        gc.gridy = 2;
        gc.weightx = 0;
        connectionForm.add(new JLabel("对外地址"), gc);
        gc.gridx = 1;
        gc.weightx = 1;
        connectionForm.add(publicUrlField, gc);
        gc.gridx = 0;
        gc.gridy = 3;
        gc.weightx = 0;
        connectionForm.add(new JLabel("同步令牌"), gc);
        gc.gridx = 1;
        gc.weightx = 1;
        connectionForm.add(tokenField, gc);

        JPanel connectionButtons = new JPanel(new FlowLayout(FlowLayout.LEFT));
        connectionButtons.add(applyConnection);
        connectionButtons.add(generateToken);
        connectionButtons.add(detectWan);
        connectionButtons.add(openWan);
        JPanel connectionPanel = new JPanel(new BorderLayout());
        connectionPanel.add(connectionForm, BorderLayout.NORTH);
        connectionPanel.add(connectionButtons, BorderLayout.CENTER);
        connectionPanel.add(new JLabel("<html>  本机：监听 127.0.0.1，对外 http://127.0.0.1:端口。<br>  局域网：监听 0.0.0.0，对外 http://局域网IP:端口。<br>  外网：点「开放外网访问」，或监听 0.0.0.0、对外填 http://公网IP或域名:端口。路由器需把该 TCP 端口映射到这台电脑，防火墙放行该端口。<br>  同步令牌给客户端/服务端用，会写入导出的整合包。网页登录令牌请到「网页管理」页设置。旧实例改 cdr-updater.toml 的 update_server 和 update_token。</html>"), BorderLayout.SOUTH);

        JPanel webForm = new JPanel(new GridBagLayout());
        webForm.setBorder(BorderFactory.createEmptyBorder(12, 12, 12, 12));
        GridBagConstraints wg = new GridBagConstraints();
        wg.insets = new Insets(4, 4, 4, 4);
        wg.fill = GridBagConstraints.HORIZONTAL;
        wg.gridx = 0;
        wg.gridy = 0;
        wg.weightx = 0;
        webForm.add(new JLabel("管理网页地址"), wg);
        wg.gridx = 1;
        wg.weightx = 1;
        webForm.add(adminUrlField, wg);
        wg.gridx = 0;
        wg.gridy = 1;
        wg.weightx = 0;
        webForm.add(new JLabel("网页令牌"), wg);
        wg.gridx = 1;
        wg.weightx = 1;
        webForm.add(adminTokenField, wg);

        JPanel webButtons = new JPanel(new FlowLayout(FlowLayout.LEFT));
        webButtons.add(applyAdminToken);
        webButtons.add(generateAdminToken);
        webButtons.add(openAdminPage);
        webButtons.add(copyAdminUrl);
        JPanel webPanel = new JPanel(new BorderLayout());
        webPanel.add(webForm, BorderLayout.NORTH);
        webPanel.add(webButtons, BorderLayout.CENTER);
        webPanel.add(new JLabel("<html>  这是打开 /admin 时用的登录密码，和「连接地址」里的同步令牌不是同一个，也不会写入导出的整合包。<br>  未设置时只能在这台电脑打开网页。外网访问网页需要先在「连接地址」开放端口，再在这里设置网页令牌。</html>"), BorderLayout.SOUTH);

        JPanel privateButtons = new JPanel(new FlowLayout(FlowLayout.LEFT));
        privateButtons.add(addPrivate);
        privateButtons.add(removePrivate);
        JPanel privatePanel = new JPanel(new BorderLayout());
        privatePanel.add(privateButtons, BorderLayout.NORTH);
        privatePanel.add(new JScrollPane(privateTable), BorderLayout.CENTER);
        privatePanel.add(new JLabel("  放到 private/files 下，保持游戏内相对路径。删除后下次同步才会从服务端实例移除。"), BorderLayout.SOUTH);

        JPanel serversPanel = new JPanel(new BorderLayout());
        serversPanel.add(new JScrollPane(serversTable), BorderLayout.CENTER);
        serversPanel.add(new JLabel("  只记录 side=server 的同步。同一台服务端按实例 ID 去重。"), BorderLayout.SOUTH);

        JTabbedPane tabs = new JTabbedPane();
        tabs.addTab("已连接的服务端", serversPanel);
        tabs.addTab("私货", privatePanel);
        tabs.addTab("连接地址", connectionPanel);
        tabs.addTab("网页管理", webPanel);
        tabs.addTab("GitHub 版本", versionBar);

        JPanel south = new JPanel(new BorderLayout());
        JPanel southButtons = new JPanel(new FlowLayout(FlowLayout.LEFT));
        southButtons.add(rebuild);
        southButtons.add(exportPcl2);
        southButtons.add(exportServer);
        south.add(southButtons, BorderLayout.NORTH);
        JPanel logWrap = new JPanel(new BorderLayout(0, 4));
        logWrap.setBorder(BorderFactory.createEmptyBorder(0, 8, 8, 8));
        logWrap.add(progress, BorderLayout.NORTH);
        logWrap.add(new JScrollPane(log), BorderLayout.CENTER);
        south.add(logWrap, BorderLayout.CENTER);
        south.setPreferredSize(new java.awt.Dimension(980, 200));

        frame.add(summary, BorderLayout.NORTH);
        frame.add(tabs, BorderLayout.CENTER);
        frame.add(south, BorderLayout.SOUTH);

        Timer timer = new Timer(2000, event -> refreshServers.run());
        timer.setRepeats(true);
        timer.start();
        Timer progressTimer = new Timer(200, event -> showProgress(progress, runtime.busy()));
        progressTimer.setRepeats(true);
        progressTimer.start();
        frame.addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosed(WindowEvent event) {
                timer.stop();
                progressTimer.stop();
                if (runtime.http != null) {
                    runtime.http.stop(0);
                }
            }
        });

        refreshServers.run();
        refreshPrivates.run();
        append(log, "更新服务器已启动。关闭本窗口将停止服务。");
        return frame;
    }

    private static Path chooseSave(JFrame frame, String title, String defaultName) {
        JFileChooser chooser = new JFileChooser();
        chooser.setDialogTitle(title);
        File start = writableHome();
        chooser.setCurrentDirectory(start);
        chooser.setSelectedFile(new File(start, defaultName));
        if (chooser.showSaveDialog(frame) != JFileChooser.APPROVE_OPTION) {
            return null;
        }
        try {
            Path path = realPath(chooser.getSelectedFile(), chooser.getCurrentDirectory());
            Path parent = path.getParent();
            if (parent == null || !Files.isDirectory(parent)) {
                throw new IllegalArgumentException("父目录不存在");
            }
            return path;
        } catch (Exception error) {
            JOptionPane.showMessageDialog(frame,
                    "无法保存到该位置。请选择桌面、文档或某个磁盘里的真实文件夹，不要选「此电脑」。",
                    "保存位置无效", JOptionPane.WARNING_MESSAGE);
            return null;
        }
    }

    static Path realPath(File selected, File currentDirectory) {
        if (selected == null) {
            throw new IllegalArgumentException("没有选择文件");
        }
        Path direct = tryPath(selected);
        if (direct != null && direct.isAbsolute()) {
            return direct;
        }
        Path dir = tryPath(currentDirectory);
        if (dir == null || !Files.isDirectory(dir)) {
            dir = writableHome().toPath();
        }
        return dir.resolve(selected.getName());
    }

    private static Path tryPath(File file) {
        if (file == null) {
            return null;
        }
        try {
            String raw = file.getPath();
            if (raw == null || raw.contains("ShellFolder")) {
                return canonicalPath(file);
            }
            return file.toPath();
        } catch (InvalidPathException ignored) {
            return canonicalPath(file);
        }
    }

    private static Path canonicalPath(File file) {
        try {
            File canonical = file.getCanonicalFile();
            String raw = canonical.getPath();
            if (raw == null || raw.contains("ShellFolder")) {
                return null;
            }
            return canonical.toPath();
        } catch (Exception ignored) {
            return null;
        }
    }

    private static File writableHome() {
        Path desktop = Path.of(System.getProperty("user.home"), "Desktop");
        if (Files.isDirectory(desktop)) {
            return desktop.toFile();
        }
        File documents = FileSystemView.getFileSystemView().getDefaultDirectory();
        Path documentsPath = tryPath(documents);
        if (documentsPath != null && Files.isDirectory(documentsPath)) {
            return documentsPath.toFile();
        }
        return new File(System.getProperty("user.home"));
    }

    private interface Throwing {
        void run() throws Exception;
    }

    private static void append(JTextArea log, String line) {
        log.append(line + "\n");
        log.setCaretPosition(log.getDocument().getLength());
    }

    private static void setEnabled(boolean enabled, JButton... buttons) {
        for (JButton button : buttons) {
            button.setEnabled(enabled);
        }
    }

    private static void showProgress(JProgressBar bar, boolean busy) {
        Progress.Snapshot snap = Progress.get();
        if (snap.active) {
            bar.setVisible(true);
            String text = snap.text();
            if (snap.total > 0) {
                bar.setIndeterminate(false);
                bar.setMaximum(1000);
                bar.setValue((int) Math.min(1000, snap.done * 1000 / snap.total));
            } else {
                bar.setIndeterminate(true);
            }
            bar.setString(text.isBlank() ? "下载中…" : text);
            return;
        }
        if (busy) {
            bar.setVisible(true);
            bar.setIndeterminate(true);
            bar.setString("处理中…");
            return;
        }
        bar.setIndeterminate(false);
        bar.setValue(0);
        bar.setString("");
        bar.setVisible(false);
    }

    private static String adminUrl(ServerRuntime runtime) {
        Pack.Config config = runtime.config();
        String host = config.listen;
        if (host == null || host.isBlank() || "0.0.0.0".equals(host) || "::".equals(host)) {
            host = "127.0.0.1";
        }
        int port = config.port;
        if (runtime.http != null && runtime.http.getAddress() != null) {
            int bound = runtime.http.getAddress().getPort();
            if (bound > 0) {
                port = bound;
            }
        }
        return "http://" + host + ":" + port + "/admin";
    }

    private static void copyText(String text) {
        Toolkit.getDefaultToolkit().getSystemClipboard().setContents(new StringSelection(text == null ? "" : text), null);
    }

    private static void openUrl(JFrame frame, String url) {
        try {
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(URI.create(url));
                return;
            }
        } catch (Exception ignored) {
            // fall through
        }
        JOptionPane.showMessageDialog(frame, url, "请手动打开管理网页", JOptionPane.INFORMATION_MESSAGE);
    }

    private static String sideLabel(String side) {
        return switch (side) {
            case "client" -> "仅客户端";
            case "server" -> "仅服务端";
            default -> "两端";
        };
    }

    private static String formatTime(String iso) {
        if (iso == null || iso.isBlank()) {
            return "";
        }
        try {
            return TIME.format(Instant.parse(iso));
        } catch (Exception ignored) {
            return iso;
        }
    }
}
