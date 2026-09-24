package com.jsi.cdr.updater;

import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JProgressBar;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import javax.swing.UIManager;
import javax.swing.WindowConstants;
import java.awt.BorderLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.GridLayout;
import java.awt.Insets;
import java.nio.file.Path;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

final class ClientApp {
    static Sync.Result updateBlocking(Path instanceDir, String serverUrl) throws Exception {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception ignored) {
            // keep default look
        }
        CountDownLatch uiReady = new CountDownLatch(1);
        AtomicReference<JFrame> frameRef = new AtomicReference<>();
        AtomicReference<JTextArea> logRef = new AtomicReference<>();
        AtomicReference<JProgressBar> progressRef = new AtomicReference<>();
        AtomicReference<JProgressBar> totalRef = new AtomicReference<>();
        AtomicReference<JLabel> statusRef = new AtomicReference<>();
        AtomicReference<javax.swing.Timer> timerRef = new AtomicReference<>();
        SwingUtilities.invokeLater(() -> {
            try {
                JFrame frame = new JFrame("Create Delight Remake 更新器");
                frame.setDefaultCloseOperation(WindowConstants.DO_NOTHING_ON_CLOSE);
                frame.setSize(720, 500);
                frame.setLocationRelativeTo(null);
                JTextArea log = new JTextArea();
                log.setEditable(false);
                log.setLineWrap(true);
                log.setWrapStyleWord(true);
                JProgressBar progress = new JProgressBar(0, 1000);
                progress.setStringPainted(true);
                progress.setIndeterminate(true);
                progress.setString("正在同步…");
                JLabel status = new JLabel("正在同步文件，完成后会继续进入游戏。");
                JProgressBar total = new JProgressBar(0, 1000);
                total.setStringPainted(true);
                total.setString("总进度");
                JPanel bars = new JPanel(new GridLayout(2, 1, 0, 4));
                bars.setBorder(BorderFactory.createEmptyBorder(4, 8, 8, 8));
                bars.add(progress);
                bars.add(total);
                frame.add(status, BorderLayout.NORTH);
                frame.add(new JScrollPane(log), BorderLayout.CENTER);
                frame.add(bars, BorderLayout.SOUTH);
                frame.setVisible(true);
                javax.swing.Timer tick = new javax.swing.Timer(200, event -> {
                    paintProgress(progress, true);
                    paintTotal(total);
                });
                tick.start();
                frameRef.set(frame);
                logRef.set(log);
                progressRef.set(progress);
                totalRef.set(total);
                statusRef.set(status);
                timerRef.set(tick);
            } finally {
                uiReady.countDown();
            }
        });
        uiReady.await(3, TimeUnit.SECONDS);
        try {
            Sync.Result sync = runVisibleUpdate(instanceDir, serverUrl, line -> {
                try {
                    java.nio.file.Files.writeString(instanceDir.resolve("logs").resolve("cdr-updater.log"),
                            line + System.lineSeparator(), java.nio.file.StandardOpenOption.CREATE, java.nio.file.StandardOpenOption.APPEND);
                } catch (Exception ignored) {
                    // 日志写不进去不影响下载
                }
                JTextArea log = logRef.get();
                if (log == null) {
                    return;
                }
                SwingUtilities.invokeLater(() -> {
                    log.append(line + "\n");
                    log.setCaretPosition(log.getDocument().getLength());
                });
            });
            JTextArea log = logRef.get();
            JProgressBar progress = progressRef.get();
            JProgressBar total = totalRef.get();
            JLabel status = statusRef.get();
            if (log != null && progress != null && status != null) {
                SwingUtilities.invokeLater(() -> {
                    log.append("\n" + sync.changelogText + "\n");
                    status.setText(sync.changed ? "更新完成。" : "已是最新。");
                    progress.setIndeterminate(false);
                    progress.setValue(1000);
                    progress.setString(sync.changed ? "更新完成" : "已是最新");
                    if (total != null) {
                        total.setIndeterminate(false);
                        total.setValue(1000);
                        total.setString(sync.changed ? "总进度  100%" : "已是最新");
                    }
                });
                Thread.sleep(800);
            }
            return sync;
        } finally {
            javax.swing.Timer tick = timerRef.get();
            JFrame frame = frameRef.get();
            if (tick != null || frame != null) {
                SwingUtilities.invokeLater(() -> {
                    if (tick != null) {
                        tick.stop();
                    }
                    if (frame != null) {
                        frame.dispose();
                    }
                });
            }
        }
    }

    static void launch() {
        SwingUtilities.invokeLater(() -> {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception ignored) {
                // keep default look
            }
            JFrame frame = new JFrame("Create Delight Remake 更新器");
            frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
            frame.setSize(860, 580);
            frame.setLocationRelativeTo(null);

            JTextField server = new JTextField("http://127.0.0.1:8765");
            JTextField instance = new JTextField();
            JTextField launch = new JTextField();
            JTextArea log = new JTextArea();
            log.setEditable(false);
            log.setLineWrap(true);
            log.setWrapStyleWord(true);
            JProgressBar progress = new JProgressBar(0, 1000);
            progress.setStringPainted(true);
            progress.setIndeterminate(false);
            progress.setString("");
            JButton update = new JButton("检查并更新");
            JButton startGame = new JButton("启动游戏");
            startGame.setEnabled(false);
            AtomicBoolean busy = new AtomicBoolean(false);

            JPanel form = new JPanel(new GridBagLayout());
            form.setBorder(BorderFactory.createEmptyBorder(12, 12, 8, 12));
            GridBagConstraints c = new GridBagConstraints();
            c.insets = new Insets(4, 4, 4, 4);
            c.fill = GridBagConstraints.HORIZONTAL;
            c.gridy = 0;
            c.gridx = 0;
            form.add(new JLabel("更新服务器"), c);
            c.gridx = 1;
            c.weightx = 1;
            form.add(server, c);
            c.gridy = 1;
            c.gridx = 0;
            c.weightx = 0;
            form.add(new JLabel("客户端实例目录"), c);
            c.gridx = 1;
            c.weightx = 1;
            form.add(instance, c);
            JButton browse = new JButton("浏览");
            c.gridx = 2;
            c.weightx = 0;
            form.add(browse, c);
            c.gridy = 2;
            c.gridx = 0;
            form.add(new JLabel("启动命令（可选）"), c);
            c.gridx = 1;
            c.gridwidth = 2;
            c.weightx = 1;
            form.add(launch, c);

            JPanel buttons = new JPanel();
            buttons.add(update);
            buttons.add(startGame);

            JPanel north = new JPanel(new BorderLayout());
            north.add(form, BorderLayout.CENTER);
            north.add(buttons, BorderLayout.SOUTH);
            north.add(progress, BorderLayout.NORTH);

            frame.add(north, BorderLayout.NORTH);
            frame.add(new JScrollPane(log), BorderLayout.CENTER);
            JLabel hint = new JLabel("  玩家自行添加的模组、资源包和其他文件不会被删除。");
            JProgressBar total = new JProgressBar(0, 1000);
            total.setStringPainted(true);
            total.setString("");
            JPanel south = new JPanel(new BorderLayout());
            south.add(total, BorderLayout.NORTH);
            south.add(hint, BorderLayout.SOUTH);
            frame.add(south, BorderLayout.SOUTH);
            javax.swing.Timer tick = new javax.swing.Timer(200, event -> {
                paintProgress(progress, busy.get());
                paintTotal(total);
            });
            tick.start();

            browse.addActionListener(event -> {
                JFileChooser chooser = new JFileChooser();
                chooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
                chooser.setDialogTitle("选择 Minecraft 客户端实例目录");
                if (chooser.showOpenDialog(frame) == JFileChooser.APPROVE_OPTION) {
                    instance.setText(chooser.getSelectedFile().getAbsolutePath());
                }
            });

            update.addActionListener(event -> {
                if (!busy.compareAndSet(false, true)) {
                    return;
                }
                String instanceDir = instance.getText().trim();
                String serverUrl = server.getText().trim();
                if (instanceDir.isBlank()) {
                    busy.set(false);
                    JOptionPane.showMessageDialog(frame, "请先选择客户端实例目录。", "缺少目录", JOptionPane.ERROR_MESSAGE);
                    return;
                }
                update.setEnabled(false);
                progress.setVisible(true);
                progress.setIndeterminate(true);
                progress.setString("正在比对文件…");
                log.setText("开始与更新服务器比对文件哈希…\n玩家自行添加的模组、资源包和其他文件将被保留。\n");
                new Thread(() -> {
                    try {
                        Sync.Result result = Sync.apply(Path.of(instanceDir), "client",
                                new Sync.Client(serverUrl, "client", Path.of(instanceDir), LaunchHook.updateToken(Path.of(instanceDir))), line ->
                                SwingUtilities.invokeLater(() -> {
                                    log.append(line + "\n");
                                    log.setCaretPosition(log.getDocument().getLength());
                                }));
                        SwingUtilities.invokeLater(() -> {
                            log.append("\n" + result.changelogText + "\n");
                            if (result.changed) {
                                log.append("\n已同步到官方版本 " + result.officialVersion + "，共处理 " + result.applied.size() + " 个文件。\n");
                            } else {
                                log.append("\n本地文件已是最新。\n");
                            }
                            startGame.setEnabled(true);
                        });
                    } catch (Exception error) {
                        SwingUtilities.invokeLater(() -> {
                            log.append("更新失败：" + error.getMessage() + "\n");
                            JOptionPane.showMessageDialog(frame, error.getMessage(), "更新失败", JOptionPane.ERROR_MESSAGE);
                        });
                    } finally {
                        SwingUtilities.invokeLater(() -> {
                            busy.set(false);
                            update.setEnabled(true);
                            paintProgress(progress, false);
                        });
                    }
                }, "cdr-client-update").start();
            });

            startGame.addActionListener(event -> {
                String command = launch.getText().trim();
                if (command.isBlank()) {
                    JOptionPane.showMessageDialog(frame, "更新已完成。请在启动器中启动游戏。", "未配置启动命令", JOptionPane.INFORMATION_MESSAGE);
                    return;
                }
                try {
                    new ProcessBuilder("cmd", "/c", command)
                            .directory(instance.getText().isBlank() ? null : Path.of(instance.getText().trim()).toFile())
                            .start();
                    log.append("已执行启动命令：" + command + "\n");
                } catch (Exception error) {
                    JOptionPane.showMessageDialog(frame, error.getMessage(), "启动失败", JOptionPane.ERROR_MESSAGE);
                }
            });

            frame.setVisible(true);
        });
    }

    private static Sync.Result runVisibleUpdate(Path instanceDir, String serverUrl, java.util.function.Consumer<String> log) throws Exception {
        return Sync.apply(instanceDir, "client",
                new Sync.Client(serverUrl, "client", instanceDir, LaunchHook.updateToken(instanceDir)), log, true);
    }

    private static int totalFiles(String text) {
        int at = text.lastIndexOf("需要下载 ");
        if (at < 0) {
            return 0;
        }
        int end = text.indexOf(" 个文件", at);
        if (end < 0) {
            return 0;
        }
        try {
            return Integer.parseInt(text.substring(at + "需要下载 ".length(), end).trim());
        } catch (NumberFormatException error) {
            return 0;
        }
    }

    private static int doneFiles(String text) {
        int count = 0;
        int from = 0;
        while (true) {
            int at = text.indexOf("下载完成", from);
            if (at < 0) {
                break;
            }
            count++;
            from = at + 4;
        }
        from = 0;
        while (true) {
            int at = text.indexOf("进程完成", from);
            if (at < 0) {
                break;
            }
            count++;
            from = at + 4;
        }
        return count;
    }

    private static final java.util.concurrent.atomic.AtomicReference<javax.swing.JTextArea> packLog = new java.util.concurrent.atomic.AtomicReference<>();

    private static JFrame packFrame;
    private static javax.swing.Timer packTick;

    static void showPackWindow(String title, int index) {
        try {
            javax.swing.SwingUtilities.invokeAndWait(() -> {
                JFrame frame = new JFrame(title);
                frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
                javax.swing.JTextArea area = new javax.swing.JTextArea(12, 48);
                area.setEditable(false);
                area.setLineWrap(true);
                JProgressBar bar = new JProgressBar();
                bar.setStringPainted(true);
                frame.add(new javax.swing.JScrollPane(area), java.awt.BorderLayout.CENTER);
                frame.add(bar, java.awt.BorderLayout.SOUTH);
                frame.pack();
                frame.setLocation(80 + index * 36, 80 + index * 36);
                frame.setVisible(true);
                packFrame = frame;
                packLog.set(area);
                packTick = new javax.swing.Timer(200, event -> paintProgress(bar, true));
                packTick.start();
            });
        } catch (Exception ignored) {
            // 窗口打不开时仍把进度写回主进程
        }
    }

    static void closePackWindow() {
        try {
            javax.swing.SwingUtilities.invokeAndWait(() -> {
                if (packTick != null) {
                    packTick.stop();
                    packTick = null;
                }
                if (packFrame != null) {
                    packFrame.dispose();
                    packFrame = null;
                }
            });
        } catch (Exception ignored) {
            // 进程马上退出
        }
    }

    static void packLine(String line) {
        javax.swing.JTextArea area = packLog.get();
        if (area == null || line == null || line.isBlank()) {
            return;
        }
        javax.swing.SwingUtilities.invokeLater(() -> {
            area.append(line + "\n");
            area.setCaretPosition(area.getDocument().getLength());
        });
    }

    private static void paintProgress(JProgressBar bar, boolean busy) {
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
    }

    private static void paintTotal(JProgressBar bar) {
        Progress.Snapshot snap = Progress.overall();
        if (!snap.active) {
            return;
        }
        bar.setVisible(true);
        bar.setIndeterminate(false);
        bar.setMaximum(1000);
        bar.setValue((int) Math.min(1000, snap.done * 1000 / snap.total));
        bar.setString(snap.text());
    }
}
