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
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Desktop;
import java.awt.FlowLayout;
import java.awt.Font;
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
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
        privateTable.setAutoResizeMode(JTable.AUTO_RESIZE_LAST_COLUMN);
        privateTable.getColumnModel().getColumn(1).setMinWidth(72);
        privateTable.getColumnModel().getColumn(1).setMaxWidth(96);
        privateTable.getColumnModel().getColumn(1).setPreferredWidth(80);
        List<String> privateRowKeys = new ArrayList<>();
        Map<String, String> pendingSides = new LinkedHashMap<>();
        Set<String> pendingDeletes = new LinkedHashSet<>();
        List<ServerRuntime.PrivateAdd> pendingAdds = new ArrayList<>();
        List<String> pendingFolders = new ArrayList<>();
        JTextField privateSearch = new JTextField();
        privateSearch.putClientProperty("JTextField.placeholderText", "搜索路径、文件名或端侧");
        Font groupFont = privateTable.getFont().deriveFont(Font.BOLD);
        privateTable.setDefaultRenderer(Object.class, new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(JTable table, Object value, boolean selected,
                                                           boolean focused, int row, int column) {
                Component cell = super.getTableCellRendererComponent(table, value, selected, focused, row, column);
                String text = value == null ? "" : String.valueOf(value);
                setToolTipText(text.isBlank() ? null : text);
                boolean group = row >= 0 && row < privateRowKeys.size() && privateRowKeys.get(row) == null;
                String key = row >= 0 && row < privateRowKeys.size() ? privateRowKeys.get(row) : null;
                boolean pending = key != null && (pendingSides.containsKey(key)
                        || pendingAdds.stream().anyMatch(item -> key.equals(item.dest())));
                setFont(group ? groupFont : table.getFont());
                if (!selected) {
                    setBackground(group ? new Color(0xF2, 0xF2, 0xF2) : table.getBackground());
                    if (pending) {
                        setForeground(new Color(0x66, 0x66, 0x66));
                    } else {
                        setForeground(group ? new Color(0x55, 0x55, 0x55) : table.getForeground());
                    }
                }
                if (group && column == 0) {
                    setBorder(BorderFactory.createEmptyBorder(4, 6, 4, 6));
                }
                return cell;
            }
        });

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
        JButton newPrivateFolder = new JButton("新建目录");
        JButton changePrivateSide = new JButton("改端侧");
        JButton removePrivate = new JButton("删除所选");
        JButton refreshTags = new JButton("刷新 GitHub 版本");
        JButton applyVersion = new JButton("应用并重新拉取");
        JButton rebuild = new JButton("保存");
        JButton discard = new JButton("不保存");
        discard.setEnabled(false);
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
                Map<String, Pack.PrivateFile> listed = new LinkedHashMap<>();
                for (Pack.PrivateFile file : Privates.list(runtime.config())) {
                    listed.put(file.path, file);
                }
                for (ServerRuntime.PrivateAdd add : pendingAdds) {
                    if (pendingDeletes.contains(add.dest())) {
                        continue;
                    }
                    listed.put(add.dest(), new Pack.PrivateFile(add.dest(), add.side(), add.source()));
                }
                List<Pack.PrivateFile> files = new ArrayList<>();
                for (Pack.PrivateFile file : listed.values()) {
                    if (pendingDeletes.contains(file.path)) {
                        continue;
                    }
                    String side = pendingSides.getOrDefault(file.path, file.side);
                    files.add(side.equals(file.side) ? file : new Pack.PrivateFile(file.path, side, file.source));
                }
                String query = privateSearch.getText();
                int selected = privateTable.getSelectedRow();
                String keep = selected >= 0 && selected < privateRowKeys.size() ? privateRowKeys.get(selected) : null;
                privateModel.setRowCount(0);
                privateRowKeys.clear();
                for (PrivateViews.Row row : PrivateViews.grouped(files, query)) {
                    if (row.group) {
                        privateModel.addRow(new Object[]{PrivateViews.groupLabel(row.folder, row.count), "", ""});
                        privateRowKeys.add(null);
                    } else {
                        boolean pending = pendingSides.containsKey(row.file.path)
                                || pendingAdds.stream().anyMatch(item -> row.file.path.equals(item.dest()));
                        privateModel.addRow(new Object[]{
                                row.file.path,
                                PrivateViews.sideLabel(row.file.side) + (pending ? " · 未保存" : ""),
                                pendingAdds.stream().anyMatch(item -> row.file.path.equals(item.dest()))
                                        ? "待保存 · " + row.file.source.getFileName()
                                        : row.file.source.toString()
                        });
                        privateRowKeys.add(row.file.path);
                    }
                }
                if (keep != null) {
                    int index = privateRowKeys.indexOf(keep);
                    if (index >= 0) {
                        privateTable.setRowSelectionInterval(index, index);
                    }
                }
                boolean dirty = !pendingSides.isEmpty() || !pendingDeletes.isEmpty()
                        || !pendingAdds.isEmpty() || !pendingFolders.isEmpty();
                discard.setEnabled(dirty && !busy.get());
            } catch (Exception error) {
                append(log, "读取私货失败：" + error.getMessage());
            }
        };
        privateSearch.getDocument().addDocumentListener(new DocumentListener() {
            private void changed() {
                refreshPrivates.run();
            }
            @Override public void insertUpdate(DocumentEvent event) { changed(); }
            @Override public void removeUpdate(DocumentEvent event) { changed(); }
            @Override public void changedUpdate(DocumentEvent event) { changed(); }
        });

        java.util.function.Consumer<String> logger = line -> {
            runtime.note(line);
            SwingUtilities.invokeLater(() -> append(log, line));
        };

        java.util.function.Consumer<Throwing> background = task -> {
            if (!busy.compareAndSet(false, true)) {
                JOptionPane.showMessageDialog(frame, "正在处理上一项操作，请稍候。", "忙碌中", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            setEnabled(false, addPrivate, newPrivateFolder, changePrivateSide, removePrivate, applyVersion, rebuild, discard, refreshTags, exportPcl2, exportServer, applyConnection, generateToken, applyAdminToken, generateAdminToken, detectWan, openWan);
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
                    SwingUtilities.invokeLater(() -> {
                        setEnabled(true, addPrivate, newPrivateFolder, changePrivateSide, removePrivate, applyVersion, rebuild, refreshTags, exportPcl2, exportServer, applyConnection, generateToken, applyAdminToken, generateAdminToken, detectWan, openWan);
                        boolean dirty = !pendingSides.isEmpty() || !pendingDeletes.isEmpty()
                                || !pendingAdds.isEmpty() || !pendingFolders.isEmpty();
                        discard.setEnabled(dirty);
                    });
                }
            }, "cdr-admin").start();
        };

        addPrivate.addActionListener(event -> {
            JFileChooser chooser = new JFileChooser();
            chooser.setDialogTitle("选择要加入私货的文件（可多选同一目录）");
            chooser.setFileSelectionMode(JFileChooser.FILES_ONLY);
            chooser.setMultiSelectionEnabled(true);
            if (chooser.showOpenDialog(frame) != JFileChooser.APPROVE_OPTION) {
                return;
            }
            File[] selected = chooser.getSelectedFiles();
            if (selected == null || selected.length == 0) {
                File one = chooser.getSelectedFile();
                selected = one == null ? new File[0] : new File[]{one};
            }
            List<Path> sources = new ArrayList<>();
            try {
                for (File file : selected) {
                    Path source = realPath(file, chooser.getCurrentDirectory());
                    if (!Files.isRegularFile(source)) {
                        throw new IllegalArgumentException("请从磁盘上的真实文件夹选择文件");
                    }
                    sources.add(source);
                }
            } catch (Exception error) {
                JOptionPane.showMessageDialog(frame, "无法打开该文件。请从桌面、文档或某个磁盘里的真实文件夹选择，不要选「此电脑」。",
                        "文件无效", JOptionPane.WARNING_MESSAGE);
                return;
            }
            if (sources.isEmpty()) {
                return;
            }
            JComboBox<String> destFolder = new JComboBox<>();
            destFolder.setEditable(true);
            try {
                List<String> folders = new ArrayList<>(PrivateViews.destFolders(runtime.config().privateDir, Privates.list(runtime.config())));
                for (String folder : pendingFolders) {
                    if (!folders.contains(folder)) {
                        folders.add(folder);
                    }
                }
                for (String folder : folders) {
                    destFolder.addItem(folder);
                }
            } catch (Exception ignored) {
                for (String folder : PrivateViews.DEST_FOLDERS) {
                    destFolder.addItem(folder);
                }
            }
            String suggested = Privates.defaultDest(sources.get(0));
            destFolder.setSelectedItem(PrivateViews.folderOf(suggested) + "/");
            JButton newDir = new JButton("新建目录");
            newDir.addActionListener(ev -> {
                String folder = promptNewFolder(frame);
                if (folder == null) {
                    return;
                }
                if (!pendingFolders.contains(folder)) {
                    pendingFolders.add(folder);
                }
                boolean found = false;
                for (int i = 0; i < destFolder.getItemCount(); i++) {
                    if (folder.equals(destFolder.getItemAt(i))) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    destFolder.addItem(folder);
                }
                destFolder.setSelectedItem(folder);
            });
            JPanel destRow = new JPanel(new BorderLayout(8, 0));
            destRow.add(destFolder, BorderLayout.CENTER);
            destRow.add(newDir, BorderLayout.EAST);
            JTextField destFile = new JTextField(sources.size() == 1 ? suggested : "");
            destFile.setToolTipText("单文件可填完整游戏内路径；多文件请留空，只用上面的目录。");
            JComboBox<String> side = new JComboBox<>(new String[]{"自动判定", "仅客户端", "仅服务端", "两端"});
            JPanel form = new JPanel(new GridBagLayout());
            GridBagConstraints c = new GridBagConstraints();
            c.insets = new Insets(4, 4, 4, 4);
            c.fill = GridBagConstraints.HORIZONTAL;
            c.gridx = 0;
            c.gridy = 0;
            form.add(new JLabel("已选文件"), c);
            c.gridx = 1;
            c.weightx = 1;
            form.add(new JLabel(sources.size() == 1
                    ? sources.get(0).getFileName().toString()
                    : sources.size() + " 个文件"), c);
            c.gridx = 0;
            c.gridy = 1;
            c.weightx = 0;
            form.add(new JLabel("推送到目录"), c);
            c.gridx = 1;
            form.add(destRow, c);
            c.gridx = 0;
            c.gridy = 2;
            form.add(new JLabel("游戏内路径"), c);
            c.gridx = 1;
            form.add(destFile, c);
            c.gridx = 0;
            c.gridy = 3;
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
            String typed = destFile.getText().trim();
            Object folderItem = destFolder.getEditor().getItem();
            String folder = folderItem == null ? "" : folderItem.toString().trim();
            String dest = typed.isBlank() ? folder : typed;
            List<ServerRuntime.PrivateAdd> items = new ArrayList<>();
            for (Path source : sources) {
                items.add(new ServerRuntime.PrivateAdd(source,
                        Privates.resolveDest(dest, source.getFileName().toString(), sources.size()),
                        chosen));
            }
            for (ServerRuntime.PrivateAdd item : items) {
                pendingDeletes.remove(item.dest());
                pendingAdds.removeIf(existing -> item.dest().equals(existing.dest()));
                pendingAdds.add(item);
            }
            refreshPrivates.run();
            JOptionPane.showMessageDialog(frame, "已加入待保存。点保存后才会写入仓库。", "待保存", JOptionPane.INFORMATION_MESSAGE);
        });

        removePrivate.addActionListener(event -> {
            int row = privateTable.getSelectedRow();
            if (row < 0 || row >= privateRowKeys.size() || privateRowKeys.get(row) == null) {
                JOptionPane.showMessageDialog(frame, "请先在列表中选择要删除的私货文件。", "未选择", JOptionPane.WARNING_MESSAGE);
                return;
            }
            String path = privateRowKeys.get(row);
            if (JOptionPane.showConfirmDialog(frame, "删除私货 " + path + "？\n点保存后才会从仓库移除，已连接的服务端下次同步才会拿到变更。",
                    "确认删除", JOptionPane.OK_CANCEL_OPTION) != JOptionPane.OK_OPTION) {
                return;
            }
            boolean pendingAdd = pendingAdds.removeIf(item -> path.equals(item.dest()));
            pendingSides.remove(path);
            if (!pendingAdd) {
                pendingDeletes.add(path);
            }
            refreshPrivates.run();
        });

        changePrivateSide.addActionListener(event -> {
            int row = privateTable.getSelectedRow();
            if (row < 0 || row >= privateRowKeys.size() || privateRowKeys.get(row) == null) {
                JOptionPane.showMessageDialog(frame, "请先在列表中选择要改端侧的私货文件。", "未选择", JOptionPane.WARNING_MESSAGE);
                return;
            }
            String path = privateRowKeys.get(row);
            String[] labels = {"仅客户端", "仅服务端", "两端"};
            String[] sides = {"client", "server", "both"};
            String current = String.valueOf(privateModel.getValueAt(row, 1));
            int preset = 2;
            for (int i = 0; i < labels.length; i++) {
                if (labels[i].equals(current)) {
                    preset = i;
                    break;
                }
            }
            Object chosen = JOptionPane.showInputDialog(frame, "将 " + path + " 改到哪一端？文件会保留。",
                    "改端侧", JOptionPane.PLAIN_MESSAGE, null, labels, labels[preset]);
            if (chosen == null) {
                return;
            }
            String side = "both";
            for (int i = 0; i < labels.length; i++) {
                if (labels[i].equals(chosen)) {
                    side = sides[i];
                    break;
                }
            }
            String nextSide = side;
            pendingDeletes.remove(path);
            boolean updatedAdd = false;
            for (int i = 0; i < pendingAdds.size(); i++) {
                ServerRuntime.PrivateAdd item = pendingAdds.get(i);
                if (path.equals(item.dest())) {
                    pendingAdds.set(i, new ServerRuntime.PrivateAdd(item.source(), item.dest(), nextSide));
                    updatedAdd = true;
                    break;
                }
            }
            if (!updatedAdd) {
                pendingSides.put(path, nextSide);
            }
            refreshPrivates.run();
        });

        newPrivateFolder.addActionListener(event -> {
            String folder = promptNewFolder(frame);
            if (folder == null) {
                return;
            }
            if (!pendingFolders.contains(folder)) {
                pendingFolders.add(folder);
            }
            JOptionPane.showMessageDialog(frame, "已加入待保存：" + folder + "\n点保存后才会创建。",
                    "待保存", JOptionPane.INFORMATION_MESSAGE);
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
            logger.accept("正在保存改动");
            List<String> folders = List.copyOf(pendingFolders);
            List<ServerRuntime.PrivateAdd> adds = new ArrayList<>();
            for (ServerRuntime.PrivateAdd item : pendingAdds) {
                if (!pendingDeletes.contains(item.dest())) {
                    adds.add(item);
                }
            }
            Map<String, String> sides = new LinkedHashMap<>(pendingSides);
            Set<String> deletes = new LinkedHashSet<>(pendingDeletes);
            for (String folder : folders) {
                Privates.createFolder(runtime.config(), folder);
                logger.accept("已创建目录 " + folder);
            }
            for (String path : deletes) {
                boolean replaced = adds.stream().anyMatch(item -> path.equals(item.dest()));
                if (!replaced) {
                    runtime.removePrivate(path, logger);
                }
            }
            if (!adds.isEmpty()) {
                runtime.addPrivates(adds, logger);
            }
            for (Map.Entry<String, String> entry : sides.entrySet()) {
                if (deletes.contains(entry.getKey()) && adds.stream().noneMatch(item -> entry.getKey().equals(item.dest()))) {
                    continue;
                }
                if (adds.stream().anyMatch(item -> entry.getKey().equals(item.dest()))) {
                    continue;
                }
                runtime.setPrivateSide(entry.getKey(), entry.getValue(), logger);
            }
            runtime.rebuild(logger);
            pendingFolders.clear();
            pendingAdds.clear();
            pendingSides.clear();
            pendingDeletes.clear();
            logger.accept("已保存");
        }));

        discard.addActionListener(event -> {
            boolean dirty = !pendingSides.isEmpty() || !pendingDeletes.isEmpty()
                    || !pendingAdds.isEmpty() || !pendingFolders.isEmpty();
            if (!dirty) {
                JOptionPane.showMessageDialog(frame, "没有待保存的改动。", "不保存", JOptionPane.INFORMATION_MESSAGE);
                return;
            }
            if (JOptionPane.showConfirmDialog(frame, "放弃未保存的改动？",
                    "不保存", JOptionPane.OK_CANCEL_OPTION) != JOptionPane.OK_OPTION) {
                return;
            }
            pendingFolders.clear();
            pendingAdds.clear();
            pendingSides.clear();
            pendingDeletes.clear();
            refreshPrivates.run();
        });

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

        JPanel privateButtons = new JPanel(new BorderLayout(8, 8));
        privateButtons.setBorder(BorderFactory.createEmptyBorder(8, 8, 0, 8));
        JPanel privateActions = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 0));
        privateActions.add(addPrivate);
        privateActions.add(newPrivateFolder);
        privateActions.add(changePrivateSide);
        privateActions.add(removePrivate);
        privateButtons.add(privateActions, BorderLayout.WEST);
        privateButtons.add(privateSearch, BorderLayout.CENTER);
        JPanel privatePanel = new JPanel(new BorderLayout());
        privatePanel.add(privateButtons, BorderLayout.NORTH);
        privatePanel.add(new JScrollPane(privateTable), BorderLayout.CENTER);
        privatePanel.add(new JLabel("  按目录归类。添加、改端侧、删除和新建目录都先留在列表里，点保存后才会写入仓库。"), BorderLayout.SOUTH);

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
        southButtons.add(discard);
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

    private static String promptNewFolder(JFrame frame) {
        String typed = JOptionPane.showInputDialog(frame, "游戏内目录，例如 config/ItemBan 或 kubejs/server_scripts/custom",
                "新建目录", JOptionPane.PLAIN_MESSAGE);
        if (typed == null || typed.isBlank()) {
            return null;
        }
        try {
            String folder = PrivateViews.normalizeFolder(typed);
            return folder.endsWith("/") ? folder : folder + "/";
        } catch (Exception error) {
            JOptionPane.showMessageDialog(frame, error.getMessage(), "无法创建目录", JOptionPane.WARNING_MESSAGE);
            return null;
        }
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
