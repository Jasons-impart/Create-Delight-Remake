package com.jsi.cdr.updater;

import net.minecraftforge.fml.common.Mod;

@Mod("cdr_early_updater")
public final class CdrUpdaterMod {
    public CdrUpdaterMod() {
        LaunchHook.clientGate();
    }
}
