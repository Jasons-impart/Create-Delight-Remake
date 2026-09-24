package com.jsi.cdr.updater;

import javax.swing.JOptionPane;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

/**
 * Java 8 也能加载的入口。系统用旧 javaw 双击 jar 时不会再 JNI 崩溃，
 * 会自动改用本机 Java 17 启动真正的更新器。
 */
public final class Boot {
    private static boolean quiet;

    public static void main(String[] args) {
        quiet = args != null && args.length > 0 && "fetch-job".equals(args[0]);
        if (javaMajor() >= 17) {
            runMain(args);
            return;
        }
        String java17 = findJava17();
        if (java17 == null) {
            fail("当前 Java 是 " + System.getProperty("java.version")
                    + "。本更新器需要 Java 17 或更高版本。\n请安装 Eclipse Temurin / Adoptium 17，并用「启动更新服务器.bat」打开。");
            return;
        }
        try {
            relaunch(java17, args);
        } catch (Exception error) {
            fail("已找到 Java 17，但启动失败：\n" + error.getMessage());
        }
    }

    private static void runMain(String[] args) {
        try {
            Class<?> type = Class.forName("com.jsi.cdr.updater.Main");
            Method main = type.getMethod("main", String[].class);
            main.invoke(null, new Object[]{args == null ? new String[0] : args});
        } catch (Exception error) {
            Throwable cause = error.getCause() == null ? error : error.getCause();
            fail(cause.getMessage() == null ? cause.getClass().getSimpleName() : cause.getMessage());
        }
    }

    private static void relaunch(String javaExe, String[] args) throws Exception {
        File jar = currentJar();
        if (jar == null || !jar.isFile()) {
            throw new IllegalStateException("找不到 cdr-updater.jar");
        }
        List<String> command = new ArrayList<String>();
        command.add(javaExe);
        command.add("-jar");
        command.add(jar.getAbsolutePath());
        if (args != null) {
            for (int i = 0; i < args.length; i++) {
                command.add(args[i]);
            }
        }
        ProcessBuilder builder = new ProcessBuilder(command);
        File dir = jar.getParentFile();
        if (dir != null) {
            builder.directory(dir);
        }
        builder.inheritIO();
        Process process = builder.start();
        int code = process.waitFor();
        if (code != 0) {
            System.exit(code);
        }
    }

    private static File currentJar() {
        try {
            return new File(Boot.class.getProtectionDomain().getCodeSource().getLocation().toURI());
        } catch (Exception ignored) {
            return null;
        }
    }

    private static int javaMajor() {
        String spec = System.getProperty("java.specification.version", "0");
        if (spec.startsWith("1.")) {
            try {
                return Integer.parseInt(spec.substring(2, 3));
            } catch (Exception ignored) {
                return 8;
            }
        }
        int dot = spec.indexOf('.');
        try {
            return Integer.parseInt(dot < 0 ? spec : spec.substring(0, dot));
        } catch (Exception ignored) {
            return 0;
        }
    }

    private static String findJava17() {
        List<String> candidates = new ArrayList<String>();
        File adoptium = new File("C:\\Program Files\\Eclipse Adoptium");
        if (adoptium.isDirectory()) {
            File[] jdks = adoptium.listFiles();
            if (jdks != null) {
                for (int i = 0; i < jdks.length; i++) {
                    File java = new File(jdks[i], "bin\\java.exe");
                    if (java.isFile()) {
                        candidates.add(java.getAbsolutePath());
                    }
                }
            }
        }
        String[] extra = {
                "C:\\Program Files\\Java\\jdk-17\\bin\\java.exe",
                "C:\\Program Files\\Microsoft\\jdk-17\\bin\\java.exe"
        };
        for (int i = 0; i < extra.length; i++) {
            if (new File(extra[i]).isFile()) {
                candidates.add(extra[i]);
            }
        }
        String home = System.getenv("JAVA_HOME");
        if (home != null && !home.isEmpty()) {
            File java = new File(home, "bin\\java.exe");
            if (java.isFile()) {
                candidates.add(java.getAbsolutePath());
            }
        }
        for (int i = 0; i < candidates.size(); i++) {
            if (isJava17(candidates.get(i))) {
                return candidates.get(i);
            }
        }
        return null;
    }

    private static boolean isJava17(String javaExe) {
        BufferedReader reader = null;
        try {
            Process process = new ProcessBuilder(new String[]{javaExe, "-version"}).redirectErrorStream(true).start();
            reader = new BufferedReader(new InputStreamReader(process.getInputStream(), "UTF-8"));
            StringBuilder out = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                out.append(line).append('\n');
            }
            process.waitFor();
            String text = out.toString();
            return text.indexOf("version \"17") >= 0
                    || text.indexOf("version \"18") >= 0
                    || text.indexOf("version \"19") >= 0
                    || text.indexOf("version \"20") >= 0
                    || text.indexOf("version \"21") >= 0
                    || text.indexOf("version \"22") >= 0
                    || text.indexOf("version \"23") >= 0
                    || text.indexOf("version \"24") >= 0
                    || text.indexOf("version \"25") >= 0;
        } catch (Exception ignored) {
            return false;
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (Exception ignored) {
                    // ignore
                }
            }
        }
    }

    private static void fail(String message) {
        System.err.println(message);
        if (!quiet) {
            try {
                JOptionPane.showMessageDialog(null, message, "Create Delight Remake 更新器", JOptionPane.ERROR_MESSAGE);
            } catch (Exception ignored) {
                // headless
            }
        }
        System.exit(1);
    }
}
