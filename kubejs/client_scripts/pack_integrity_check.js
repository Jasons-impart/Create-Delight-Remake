(() => {
  const PackIntegrityConfirmScreen = Java.loadClass(
    "net.minecraft.client.gui.screens.ConfirmScreen"
  );
  const PackIntegrityChatFormatting = Java.loadClass("net.minecraft.ChatFormatting");
  const PackIntegrityComponent = Java.loadClass("net.minecraft.network.chat.Component");
  const PackIntegrityKubeJSPaths = Java.loadClass("dev.latvian.mods.kubejs.KubeJSPaths");
  const PackIntegrityJavaArrays = Java.loadClass("java.util.Arrays");
  const JavaRuntimeSystemReport = Java.loadClass("net.minecraft.SystemReport");

  function packIntegrityResolve(path, value) {
    return path["resolve(java.lang.String)"](String(value));
  }

  const PACK_INTEGRITY_CONFIG_PATH = packIntegrityResolve(
    PackIntegrityKubeJSPaths.CONFIG,
    "createdelight_pack_integrity.json"
  );
  const PACK_INTEGRITY_EXPECTED_PATH = packIntegrityResolve(
    PackIntegrityKubeJSPaths.CONFIG,
    "createdelight_pack_integrity_expected.json"
  );
  const PACK_INTEGRITY_GAME_DIR = PackIntegrityKubeJSPaths.DIRECTORY.getParent();
  const PACK_INTEGRITY_REPORT_PATH = packIntegrityResolve(
    packIntegrityResolve(PACK_INTEGRITY_GAME_DIR, "logs"),
    "createdelight_pack_integrity.json"
  );
  const PACK_INTEGRITY_MODS_DIR = packIntegrityResolve(PACK_INTEGRITY_GAME_DIR, "mods");
  const PACK_INTEGRITY_STATE_PATH = packIntegrityResolve(
    PackIntegrityKubeJSPaths.LOCAL,
    "createdelight_pack_integrity_state.json"
  );
  const RECOMMENDED_JAVA_MAJOR_VERSION = 17;
  const PACK_INTEGRITY_WARNING_TEXT = "检测到整合包模组列表与发布版本不一致。\n请知悉：";
  const PACK_INTEGRITY_WARNING_HIGHLIGHT_TEXT =
    "我们不保证这种情况下整合包仍能稳定游玩，也没有能力处理这种情况下的问题求助和 bug 反馈。";
  const JAVA_RUNTIME_WARNING_TEXT = "检测到当前 Java 大版本与推荐版本不一致。\n请知悉：";
  const JAVA_RUNTIME_WARNING_HIGHLIGHT_TEXT =
    "本整合包推荐使用 Java 17。使用其它大版本可能导致启动失败、崩溃或难以复现的问题。";
  const WARNING_SCREEN_CHECK_INTERVAL_MS = 1000;
  const TITLE_SCREEN_CLASS_NAME = "net.minecraft.client.gui.screens.TitleScreen";

  const packIntegrityState = {
    result: null,
    shouldWarn: false,
    warningOpen: false,
    titleScreenHandled: false,
    warningComponent: PackIntegrityComponent.literal(PACK_INTEGRITY_WARNING_TEXT),
  };

  const javaRuntimeState = {
    result: null,
    shouldWarn: false,
    warningOpen: false,
    titleScreenHandled: false,
    warningComponent: PackIntegrityComponent.literal(JAVA_RUNTIME_WARNING_TEXT),
  };
  let nextWarningScreenCheckAt = 0;

  const readPackIntegrityJson = (path, fallback) => {
    const json = JsonIO.readJson(path);
    if (json == null || json.isJsonNull()) {
      return fallback;
    }

    // JsonIO.toObject returns a Java Map. Rhino's NativeJavaMap crashes while
    // unwrapping entries whose value is JSON null, so keep all later property
    // access on ordinary JavaScript objects instead.
    return JSON.parse(String(json));
  };

  const writePackIntegrityJson = (path, value) => {
    const parent = path.getParent();
    if (parent != null) {
      PackIntegrityKubeJSPaths.dir(parent);
    }

    JsonIO.write(path, JsonIO.of(value).getAsJsonObject());
  };

  const readPackIntegrityState = () => {
    try {
      return readPackIntegrityJson(PACK_INTEGRITY_STATE_PATH, {});
    } catch (error) {
      console.warn(`[Create Delight Pack Integrity] Failed to read warning state: ${error}`);
      return {};
    }
  };

  const writePackIntegrityState = (result) => {
    const currentState = readPackIntegrityState();
    writePackIntegrityJson(PACK_INTEGRITY_STATE_PATH, {
      acknowledgedJavaRuntimeFingerprint: currentState.acknowledgedJavaRuntimeFingerprint,
      acknowledgedJavaRuntimeAt: currentState.acknowledgedJavaRuntimeAt,
      javaRuntime: currentState.javaRuntime,
      acknowledgedFingerprint: result.fingerprint,
      acknowledgedAt: new Date().toISOString(),
      side: result.side,
      missingFiles: result.missingFiles,
      extraFiles: result.extraFiles,
    });
  };

  const writeJavaRuntimeState = (result) => {
    const currentState = readPackIntegrityState();
    writePackIntegrityJson(PACK_INTEGRITY_STATE_PATH, {
      acknowledgedFingerprint: currentState.acknowledgedFingerprint,
      acknowledgedAt: currentState.acknowledgedAt,
      side: currentState.side,
      missingFiles: currentState.missingFiles,
      extraFiles: currentState.extraFiles,
      acknowledgedJavaRuntimeFingerprint: result.fingerprint,
      acknowledgedJavaRuntimeAt: new Date().toISOString(),
      javaRuntime: {
        status: result.status,
        recommendedJavaMajorVersion: result.recommendedJavaMajorVersion,
        detectedJavaMajorVersion: result.detectedJavaMajorVersion,
        javaVersion: result.javaVersion,
        javaVmVersion: result.javaVmVersion,
        source: result.source,
      },
    });
  };

  const normalizePackIntegrityList = (value) => {
    if (value == null) {
      return [];
    }

    const values = [];
    if (Array.isArray(value)) {
      value.forEach((entry) => values.push(entry));
    } else if (typeof value.forEach === "function") {
      value.forEach((entry) => values.push(entry));
    } else if (typeof value.iterator === "function") {
      const iterator = value.iterator();
      while (iterator.hasNext()) {
        values.push(iterator.next());
      }
    } else {
      return [];
    }

    return values
      .map((entry) => String(entry).trim().toLowerCase())
      .filter((entry, index, list) => entry.length > 0 && list.indexOf(entry) === index)
      .sort();
  };

  const collectRuntimeModFiles = () => {
    const fileNames = [];
    const modEntries = PACK_INTEGRITY_MODS_DIR.toFile().listFiles();

    if (modEntries == null) {
      throw new Error(`Cannot read mods directory: ${PACK_INTEGRITY_MODS_DIR}`);
    }

    PackIntegrityJavaArrays.asList(modEntries).forEach((modEntry) => {
      const fileName = String(modEntry.getName()).trim();
      if (modEntry.isFile() && fileName.toLowerCase().endsWith(".jar")) {
        fileNames.push(fileName);
      }
    });

    return normalizePackIntegrityList(fileNames);
  };

  const difference = (left, right) => left.filter((entry) => right.indexOf(entry) === -1);

  const matchesPackIntegrityPattern = (fileName, patterns) =>
    patterns.some((pattern) => {
      if (pattern.indexOf("*") === -1 && pattern.indexOf("?") === -1) {
        return fileName === pattern;
      }

      const escapedPattern = pattern
        .replace(/[.+^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, ".*")
        .replace(/\?/g, ".");
      return new RegExp(`^${escapedPattern}$`).test(fileName);
    });

  const createFingerprint = (side, missingFiles, extraFiles) =>
    JSON.stringify({
      side: side,
      missingFiles: missingFiles,
      extraFiles: extraFiles,
    });

  const createJavaRuntimeFingerprint = (result) =>
    JSON.stringify({
      recommendedJavaMajorVersion: result.recommendedJavaMajorVersion,
      detectedJavaMajorVersion: result.detectedJavaMajorVersion,
      javaVersion: result.javaVersion,
    });

  const parseJavaMajorVersion = (specificationVersion, javaVersion) => {
    const versionText = String(specificationVersion || javaVersion || "").trim();
    if (!versionText) {
      return null;
    }

    const legacyMatch = versionText.match(/^1\.(\d+)/);
    if (legacyMatch != null) {
      return Number(legacyMatch[1]);
    }

    const majorMatch = versionText.match(/^(\d+)/);
    return majorMatch == null ? null : Number(majorMatch[1]);
  };

  const parseJavaRuntimeFromSystemReport = (reportText) => {
    if (!reportText) {
      return {
        javaVersion: "",
        javaVmVersion: "",
        source: "system_report_missing",
      };
    }

    const javaVersionMatch = reportText.match(/(?:^|\n)\s*Java Version:\s*([^\n,]+)/);
    const javaVmVersionMatch = reportText.match(/(?:^|\n)\s*Java VM Version:\s*([^\n]+)/);

    return {
      javaVersion: javaVersionMatch == null ? "" : javaVersionMatch[1].trim(),
      javaVmVersion: javaVmVersionMatch == null ? "" : javaVmVersionMatch[1].trim(),
      javaSpecificationVersion: "",
      source: javaVersionMatch == null ? "system_report_unmatched" : "system_report",
    };
  };

  const getJavaRuntimeSystemReportText = () => {
    const report = new JavaRuntimeSystemReport();
    if (typeof report.toLineSeparatedString === "function") {
      return String(report.toLineSeparatedString());
    }
    if (typeof report.m_143515_ === "function") {
      return String(report.m_143515_());
    }
    return "";
  };

  const loadPackIntegrityResult = () => {
    const config = readPackIntegrityJson(PACK_INTEGRITY_CONFIG_PATH, {
      enabled: true,
      allowedMissingFiles: [],
      allowedExtraFiles: [],
    });
    const side = "client";
    const checkedAt = new Date().toISOString();

    if (config.enabled === false) {
      return {
        schemaVersion: 1,
        status: "disabled",
        enabled: false,
        side: side,
        checkedAt: checkedAt,
        hasDifferences: false,
        missingFiles: [],
        extraFiles: [],
        allowedMissingFiles: [],
        allowedExtraFiles: [],
        fingerprint: "",
      };
    }

    if (JsonIO.readJson(PACK_INTEGRITY_EXPECTED_PATH) == null) {
      return {
        schemaVersion: 1,
        status: "missing_manifest",
        enabled: true,
        side: side,
        checkedAt: checkedAt,
        hasDifferences: false,
        missingFiles: [],
        extraFiles: [],
        allowedMissingFiles: [],
        allowedExtraFiles: [],
        fingerprint: "",
      };
    }

    const expected = readPackIntegrityJson(PACK_INTEGRITY_EXPECTED_PATH, {});
    const expectedFiles = expected.expectedFiles || {};
    const commonExpectedFiles = normalizePackIntegrityList(expectedFiles.common);
    const clientExpectedFiles = normalizePackIntegrityList(expectedFiles.client);
    const activeExpectedFiles = normalizePackIntegrityList(
      commonExpectedFiles.concat(clientExpectedFiles)
    );
    const runtimeFiles = collectRuntimeModFiles();
    const allowedMissingFilesConfig = normalizePackIntegrityList(config.allowedMissingFiles);
    const allowedExtraFilesConfig = normalizePackIntegrityList(config.allowedExtraFiles);
    const allMissingFiles = difference(activeExpectedFiles, runtimeFiles);
    const allowedMissingFiles = allMissingFiles.filter((fileName) =>
      matchesPackIntegrityPattern(fileName, allowedMissingFilesConfig)
    );
    const missingFiles = difference(allMissingFiles, allowedMissingFiles);
    const allExtraFiles = difference(runtimeFiles, activeExpectedFiles);
    const allowedExtraFiles = allExtraFiles.filter((fileName) =>
      matchesPackIntegrityPattern(fileName, allowedExtraFilesConfig)
    );
    const extraFiles = difference(allExtraFiles, allowedExtraFiles);
    const fingerprint = createFingerprint(side, missingFiles, extraFiles);

    return {
      schemaVersion: 1,
      status: missingFiles.length > 0 || extraFiles.length > 0 ? "modified" : "ok",
      enabled: true,
      side: side,
      checkedAt: checkedAt,
      comparisonType: "file",
      hasDifferences: missingFiles.length > 0 || extraFiles.length > 0,
      expectedFiles: activeExpectedFiles,
      runtimeFiles: runtimeFiles,
      missingFiles: missingFiles,
      extraFiles: extraFiles,
      allowedMissingFiles: allowedMissingFiles,
      allowedExtraFiles: allowedExtraFiles,
      fingerprint: fingerprint,
    };
  };

  const loadJavaRuntimeResult = () => {
    const reportRuntime = parseJavaRuntimeFromSystemReport(getJavaRuntimeSystemReportText());
    const javaSpecificationVersion = String(reportRuntime.javaSpecificationVersion || "").trim();
    const javaVersion = String(reportRuntime.javaVersion || "").trim();
    const detectedJavaMajorVersion = parseJavaMajorVersion(javaSpecificationVersion, javaVersion);
    const hasWrongMajorVersion =
      detectedJavaMajorVersion != null &&
      detectedJavaMajorVersion !== RECOMMENDED_JAVA_MAJOR_VERSION;
    const result = {
      schemaVersion: 1,
      status:
        detectedJavaMajorVersion == null
          ? "unknown"
          : hasWrongMajorVersion
            ? "recommended_mismatch"
            : "ok",
      checkedAt: new Date().toISOString(),
      source: reportRuntime.source,
      recommendedJavaMajorVersion: RECOMMENDED_JAVA_MAJOR_VERSION,
      detectedJavaMajorVersion: detectedJavaMajorVersion,
      hasWrongMajorVersion: hasWrongMajorVersion,
      javaVersion: javaVersion,
      javaSpecificationVersion: javaSpecificationVersion,
      javaVmVersion: reportRuntime.javaVmVersion,
    };

    result.fingerprint = createJavaRuntimeFingerprint(result);
    return result;
  };

  const writeAndLogPackIntegrityResult = (result) => {
    writePackIntegrityJson(PACK_INTEGRITY_REPORT_PATH, result);

    if (result.status === "missing_manifest") {
      console.warn(
        "[Create Delight Pack Integrity] Missing expected manifest: kubejs/config/createdelight_pack_integrity_expected.json"
      );
    } else if (result.hasDifferences) {
      console.warn("[Create Delight Pack Integrity] Mod list differs from the published manifest.");
      console.warn(
        `[Create Delight Pack Integrity] Missing files: ${result.missingFiles.join(", ") || "(none)"}`
      );
      console.warn(
        `[Create Delight Pack Integrity] Extra files: ${result.extraFiles.join(", ") || "(none)"}`
      );
      console.warn(
        `[Create Delight Pack Integrity] Allowed missing files: ${result.allowedMissingFiles.join(", ") || "(none)"}`
      );
      console.warn(
        `[Create Delight Pack Integrity] Allowed extra files: ${result.allowedExtraFiles.join(", ") || "(none)"}`
      );
    } else if (result.status === "ok") {
      if (result.allowedMissingFiles.length > 0 || result.allowedExtraFiles.length > 0) {
        console.info(
          "[Create Delight Pack Integrity] Mod list matches after applying configured exceptions."
        );
        console.info(
          `[Create Delight Pack Integrity] Allowed missing files: ${result.allowedMissingFiles.join(", ") || "(none)"}`
        );
        console.info(
          `[Create Delight Pack Integrity] Allowed extra files: ${result.allowedExtraFiles.join(", ") || "(none)"}`
        );
      } else {
        console.info("[Create Delight Pack Integrity] Mod list matches the published manifest.");
      }
    }
  };

  const logJavaRuntimeResult = (result) => {
    if (result.hasWrongMajorVersion) {
      console.warn(
        `[Create Delight Java Runtime] Detected Java ${result.detectedJavaMajorVersion}, but Java ${result.recommendedJavaMajorVersion} is recommended.`
      );
      console.warn(
        `[Create Delight Java Runtime] java.version=${result.javaVersion || "(unknown)"}, java.specification.version=${result.javaSpecificationVersion || "(unknown)"}`
      );
    } else if (result.detectedJavaMajorVersion == null) {
      console.warn("[Create Delight Java Runtime] Failed to detect Java major version.");
    } else {
      console.info(
        `[Create Delight Java Runtime] Java ${result.detectedJavaMajorVersion} matches the recommended major version.`
      );
    }
    console.info(`[Create Delight Java Runtime] Detection source: ${result.source}`);
  };

  const formatPackIntegrityWarningList = (label, entries) => {
    if (entries == null || entries.length === 0) {
      return `${label}(0): 无`;
    }

    const visibleEntries = entries.slice(0, 12);
    const overflowText = entries.length > visibleEntries.length ? ` 等 ${entries.length} 个` : "";
    return `${label}(${entries.length}): ${visibleEntries.join(", ")}${overflowText}`;
  };

  const createPackIntegrityWarningComponent = (result) =>
    PackIntegrityComponent.empty()
      .append(PackIntegrityComponent.literal(PACK_INTEGRITY_WARNING_TEXT))
      .append(
        PackIntegrityComponent.literal(PACK_INTEGRITY_WARNING_HIGHLIGHT_TEXT).withStyle(
          PackIntegrityChatFormatting.YELLOW,
          PackIntegrityChatFormatting.UNDERLINE
        )
      )
      .append(
        PackIntegrityComponent.literal(
          `\n${formatPackIntegrityWarningList("缺失文件", result.missingFiles)}\n${formatPackIntegrityWarningList("额外文件", result.extraFiles)}`
        )
      );

  const createJavaRuntimeWarningComponent = (result) =>
    PackIntegrityComponent.empty()
      .append(PackIntegrityComponent.literal(JAVA_RUNTIME_WARNING_TEXT))
      .append(
        PackIntegrityComponent.literal(JAVA_RUNTIME_WARNING_HIGHLIGHT_TEXT).withStyle(
          PackIntegrityChatFormatting.YELLOW,
          PackIntegrityChatFormatting.UNDERLINE
        )
      )
      .append(
        PackIntegrityComponent.literal(
          `\n当前 Java: ${result.detectedJavaMajorVersion} (${result.javaVersion || "未知版本"})\n推荐 Java: ${result.recommendedJavaMajorVersion}\n请在启动器中为本实例选择 Java ${result.recommendedJavaMajorVersion} 后重启游戏。`
        )
      );

  const updatePackIntegrityWarningState = (result) => {
    if (result == null || !result.hasDifferences || !result.fingerprint) {
      packIntegrityState.shouldWarn = false;
      return;
    }

    const acknowledgedState = readPackIntegrityState();
    packIntegrityState.warningComponent = createPackIntegrityWarningComponent(result);
    packIntegrityState.shouldWarn =
      acknowledgedState.acknowledgedFingerprint !== result.fingerprint;
  };

  const updateJavaRuntimeWarningState = (result) => {
    if (result == null || !result.hasWrongMajorVersion || !result.fingerprint) {
      javaRuntimeState.shouldWarn = false;
      return;
    }

    const acknowledgedState = readPackIntegrityState();
    javaRuntimeState.warningComponent = createJavaRuntimeWarningComponent(result);
    javaRuntimeState.shouldWarn =
      acknowledgedState.acknowledgedJavaRuntimeFingerprint !== result.fingerprint;
  };

  const getScreenClassName = (screen) => {
    if (screen == null) {
      return "";
    }

    try {
      return String(screen.getClass().getName());
    } catch (error) {
      return String(screen).split("@")[0];
    }
  };

  const isTitleScreen = (screen) => getScreenClassName(screen) === TITLE_SCREEN_CLASS_NAME;

  const hasPendingWarning = () =>
    (javaRuntimeState.shouldWarn && !javaRuntimeState.titleScreenHandled) ||
    (packIntegrityState.shouldWarn && !packIntegrityState.titleScreenHandled);

  const hasOpenWarning = () => javaRuntimeState.warningOpen || packIntegrityState.warningOpen;

  const setCurrentClientScreen = (screen) => Client.setScreen(screen);

  const openWarningScreen = (screenBeforeWarning, state, title, acknowledgeAction) => {
    const warningScreen = new PackIntegrityConfirmScreen(
      (confirmed) => {
        try {
          if (confirmed) {
            acknowledgeAction(state.result);
          }
        } finally {
          state.shouldWarn = false;
          state.warningOpen = false;
          setCurrentClientScreen(screenBeforeWarning);
        }
      },
      PackIntegrityComponent.literal(title),
      state.warningComponent,
      PackIntegrityComponent.literal("我已知悉"),
      PackIntegrityComponent.literal("关闭")
    );

    setCurrentClientScreen(warningScreen);
    state.titleScreenHandled = true;
    state.warningOpen = true;
    console.warn(`[Create Delight Pack Integrity] Opening warning screen: ${title}`);
  };

  const maybeOpenPendingWarning = (currentScreen) => {
    if (!hasPendingWarning() || hasOpenWarning()) {
      return;
    }

    const now = new Date().getTime();
    if (now < nextWarningScreenCheckAt) {
      return;
    }
    nextWarningScreenCheckAt = now + WARNING_SCREEN_CHECK_INTERVAL_MS;

    if (
      javaRuntimeState.shouldWarn &&
      !javaRuntimeState.warningOpen &&
      !javaRuntimeState.titleScreenHandled &&
      isTitleScreen(currentScreen)
    ) {
      openWarningScreen(currentScreen, javaRuntimeState, "Java 版本不推荐", writeJavaRuntimeState);
      return;
    }

    if (
      !packIntegrityState.shouldWarn ||
      packIntegrityState.warningOpen ||
      packIntegrityState.titleScreenHandled ||
      !isTitleScreen(currentScreen)
    ) {
      return;
    }

    openWarningScreen(
      currentScreen,
      packIntegrityState,
      "整合包模组列表已改变",
      writePackIntegrityState
    );
  };

  try {
    packIntegrityState.result = loadPackIntegrityResult();
  } catch (error) {
    console.warn(`[Create Delight Pack Integrity] Integrity check failed: ${error}`);
  }

  try {
    javaRuntimeState.result = loadJavaRuntimeResult();
  } catch (error) {
    console.warn(`[Create Delight Java Runtime] Runtime check failed: ${error}`);
  }

  if (packIntegrityState.result != null) {
    packIntegrityState.result.javaRuntime = javaRuntimeState.result;
    writeAndLogPackIntegrityResult(packIntegrityState.result);
    updatePackIntegrityWarningState(packIntegrityState.result);
  }

  if (javaRuntimeState.result != null) {
    logJavaRuntimeResult(javaRuntimeState.result);
    updateJavaRuntimeWarningState(javaRuntimeState.result);
  }

  console.info(
    `[Create Delight Pack Integrity] Pending warnings: pack=${packIntegrityState.shouldWarn}, java=${javaRuntimeState.shouldWarn}`
  );

  if (
    typeof RenderJSEvents !== "undefined" &&
    typeof RenderJSEvents.onScreenPostRender === "function"
  ) {
    RenderJSEvents.onScreenPostRender((event) => {
      maybeOpenPendingWarning(event.screen);
    });
  } else {
    console.warn("[Create Delight Pack Integrity] RenderJSEvents.onScreenPostRender is not available.");
  }
})();
