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
import java.awt.Insets;
import java.nio.file.Path;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

final class ClientApp {
    static Sync.Result updateBlocking(Path instanceDir, String serverUrl) throws Exception {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception ignored) {
            // keep default look
        }
        CountDownLatch done = new CountDownLatch(1);
        AtomicReference<Sync.Result> result = new AtomicReference<>();
        AtomicReference<Exception> error = new AtomicReference<>();
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Create Delight Remake 更新器");
            frame.setDefaultCloseOperation(WindowConstants.DO_NOTHING_ON_CLOSE);
            frame.setSize(720, 460);
            frame.setLocationRelativeTo(null);
            JTextArea log = new JTextArea();
            log.setEditable(false);
            log.setLineWrap(true);
            log.setWrapStyleWord(true);
            JProgressBar progress = new JProgressBar();
            progress.setIndeterminate(true);
            JLabel status = new JLabel("正在同步文件，完成后会继续进入游戏。");
            frame.add(status, BorderLayout.NORTH);
            frame.add(new JScrollPane(log), BorderLayout.CENTER);
            frame.add(progress, BorderLayout.SOUTH);
            frame.setVisible(true);
            new Thread(() -> {
                try {
                    Sync.Result sync = Sync.apply(instanceDir, "client",
                            new Sync.Client(serverUrl, "client", instanceDir, LaunchHook.updateToken(instanceDir)), line ->
                            SwingUtilities.invokeLater(() -> {
                                log.append(line + "\n");
                                log.setCaretPosition(log.getDocument().getLength());
                            }));
                    result.set(sync);
                    SwingUtilities.invokeLater(() -> {
                        log.append("\n" + sync.changelogText + "\n");
                        status.setText(sync.changed ? "更新完成。" : "已是最新。");
                        progress.setIndeterminate(false);
                    });
                    Thread.sleep(800);
                } catch (Exception exception) {
                    error.set(exception);
                    SwingUtilities.invokeLater(() -> JOptionPane.showMessageDialog(frame, exception.getMessage(), "更新失败", JOptionPane.ERROR_MESSAGE));
                } finally {
                    SwingUtilities.invokeLater(frame::dispose);
                    done.countDown();
                }
            }, "cdr-client-auto-update").start();
        });
        done.await();
        if (error.get() != null) {
            throw error.get();
        }
        return result.get();
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
            JProgressBar progress = new JProgressBar();
            progress.setIndeterminate(false);
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
            frame.add(hint, BorderLayout.SOUTH);

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
                progress.setIndeterminate(true);
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
                            progress.setIndeterminate(false);
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
}
