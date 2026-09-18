package com.jsi.cdr.updater;

import cpw.mods.modlauncher.api.IEnvironment;
import cpw.mods.modlauncher.api.ITransformationService;
import cpw.mods.modlauncher.api.ITransformer;
import cpw.mods.modlauncher.api.IncompatibleEnvironmentException;

import java.util.List;
import java.util.Set;

public final class CdrLaunchService implements ITransformationService {
    @Override
    public String name() {
        return "cdr-updater";
    }

    @Override
    public void initialize(IEnvironment environment) {
        LaunchHook.markEarly();
        LaunchHook.clientGate();
    }

    @Override
    public void onLoad(IEnvironment env, Set<String> otherServices) throws IncompatibleEnvironmentException {
        // 同步已在 initialize 里完成，以便 Forge 扫 mods 之前文件已经在磁盘上
    }

    @Override
    public List<ITransformer> transformers() {
        return List.of();
    }
}
