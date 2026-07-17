(() => {
  const PackIntegrityConfirmScreen = Java.loadClass(
    "net.minecraft.client.gui.screens.ConfirmScreen"
  );
  const PackIntegrityChatFormatting = Java.loadClass("net.minecraft.ChatFormatting");
  const PackIntegrityComponent = Java.loadClass("net.minecraft.network.chat.Component");
  const PackIntegrityKubeJSPaths = Java.loadClass("dev.latvian.mods.kubejs.KubeJSPaths");
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

  const readPackIntegrityJson = (path, fallback) => {
    const json = JsonIO.readJson(path);
    if (json == null || json.isJsonNull()) {
      return fallback;
    }

    return JsonIO.toObject(json);
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
      missingModIds: result.missingModIds,
      extraModIds: result.extraModIds,
    });
  };

  const writeJavaRuntimeState = (result) => {
    const currentState = readPackIntegrityState();
    writePackIntegrityJson(PACK_INTEGRITY_STATE_PATH, {
      acknowledgedFingerprint: currentState.acknowledgedFingerprint,
      acknowledgedAt: currentState.acknowledgedAt,
      side: currentState.side,
      missingModIds: currentState.missingModIds,
      extraModIds: currentState.extraModIds,
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

  const collectRuntimeModIds = () => {
    const ids = [];
    Platform.getList().forEach((modId) => {
      ids.push(String(modId).trim().toLowerCase());
    });
    return normalizePackIntegrityList(ids);
  };

  const difference = (left, right) => left.filter((entry) => right.indexOf(entry) === -1);

  const createFingerprint = (side, missingModIds, extraModIds) =>
    JSON.stringify({
      side: side,
      missingModIds: missingModIds,
      extraModIds: extraModIds,
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
      allowedExtraModIds: [],
      ignoredRuntimeModIds: ["minecraft", "neoforge", "forge", "java"],
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
        missingModIds: [],
        extraModIds: [],
        allowedExtraModIds: [],
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
        missingModIds: [],
        extraModIds: [],
        allowedExtraModIds: [],
        fingerprint: "",
      };
    }

    const expected = readPackIntegrityJson(PACK_INTEGRITY_EXPECTED_PATH, {});
    const expectedModIds = expected.expectedModIds || {};
    const commonExpected = normalizePackIntegrityList(expectedModIds.common);
    const clientExpected = normalizePackIntegrityList(expectedModIds.client);
    const activeExpected = normalizePackIntegrityList(commonExpected.concat(clientExpected));
    const runtimeModIds = collectRuntimeModIds();
    const ignoredRuntimeModIds = normalizePackIntegrityList(config.ignoredRuntimeModIds);
    const allowedExtraConfig = normalizePackIntegrityList(config.allowedExtraModIds);
    const filteredRuntimeModIds = difference(runtimeModIds, ignoredRuntimeModIds);
    const missingModIds = difference(activeExpected, runtimeModIds);
    const allExtraModIds = difference(filteredRuntimeModIds, activeExpected);
    const allowedExtraModIds = allExtraModIds.filter(
      (modId) => allowedExtraConfig.indexOf(modId) !== -1
    );
    const extraModIds = difference(allExtraModIds, allowedExtraModIds);
    const fingerprint = createFingerprint(side, missingModIds, extraModIds);

    return {
      schemaVersion: 1,
      status: missingModIds.length > 0 || extraModIds.length > 0 ? "modified" : "ok",
      enabled: true,
      side: side,
      checkedAt: checkedAt,
      hasDifferences: missingModIds.length > 0 || extraModIds.length > 0,
      expectedModIds: activeExpected,
      runtimeModIds: runtimeModIds,
      ignoredRuntimeModIds: ignoredRuntimeModIds,
      missingModIds: missingModIds,
      extraModIds: extraModIds,
      allowedExtraModIds: allowedExtraModIds,
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
        `[Create Delight Pack Integrity] Missing mods: ${result.missingModIds.join(", ") || "(none)"}`
      );
      console.warn(
        `[Create Delight Pack Integrity] Extra mods: ${result.extraModIds.join(", ") || "(none)"}`
      );
      console.warn(
        `[Create Delight Pack Integrity] Allowed extra mods: ${result.allowedExtraModIds.join(", ") || "(none)"}`
      );
    } else if (result.status === "ok") {
      console.info("[Create Delight Pack Integrity] Mod list matches the published manifest.");
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

  const formatPackIntegrityWarningList = (label, modIds) => {
    if (modIds == null || modIds.length === 0) {
      return `${label}(0): 无`;
    }

    const visibleModIds = modIds.slice(0, 12);
    const overflowText = modIds.length > visibleModIds.length ? ` 等 ${modIds.length} 个` : "";
    return `${label}(${modIds.length}): ${visibleModIds.join(", ")}${overflowText}`;
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
          `\n${formatPackIntegrityWarningList("缺失模组", result.missingModIds)}\n${formatPackIntegrityWarningList("额外模组", result.extraModIds)}`
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

  const isTitleScreen = (screen) =>
    screen != null && String(screen).startsWith("net.minecraft.client.gui.screens.TitleScreen@");

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

  RenderJSEvents.onScreenPostRender((event) => {
    if (
      javaRuntimeState.shouldWarn &&
      !javaRuntimeState.warningOpen &&
      !javaRuntimeState.titleScreenHandled &&
      isTitleScreen(event.screen)
    ) {
      const client = event.client;
      const previousScreen = event.screen;
      javaRuntimeState.titleScreenHandled = true;
      javaRuntimeState.warningOpen = true;

      const warningScreen = new PackIntegrityConfirmScreen(
        (confirmed) => {
          if (confirmed) {
            writeJavaRuntimeState(javaRuntimeState.result);
          }
          javaRuntimeState.shouldWarn = false;
          javaRuntimeState.warningOpen = false;
          client.setScreen(previousScreen);
        },
        PackIntegrityComponent.literal("Java 版本不推荐"),
        javaRuntimeState.warningComponent,
        PackIntegrityComponent.literal("我已知悉"),
        PackIntegrityComponent.literal("关闭")
      );

      client.setScreen(warningScreen);
      return;
    }

    if (
      !packIntegrityState.shouldWarn ||
      packIntegrityState.warningOpen ||
      packIntegrityState.titleScreenHandled ||
      !isTitleScreen(event.screen)
    ) {
      return;
    }

    const client = event.client;
    const previousScreen = event.screen;
    packIntegrityState.titleScreenHandled = true;
    packIntegrityState.warningOpen = true;

    const warningScreen = new PackIntegrityConfirmScreen(
      (confirmed) => {
        if (confirmed) {
          writePackIntegrityState(packIntegrityState.result);
        }
        packIntegrityState.shouldWarn = false;
        packIntegrityState.warningOpen = false;
        client.setScreen(previousScreen);
      },
      PackIntegrityComponent.literal("整合包模组列表已改变"),
      packIntegrityState.warningComponent,
      PackIntegrityComponent.literal("我已知悉"),
      PackIntegrityComponent.literal("关闭")
    );

    client.setScreen(warningScreen);
  });
})();
