// Force a reload immediately after everything loaded
//      so as to make sure OEI merged item recipes work.

global._evil_global_has_reloaded = false;

ServerEvents.loaded(event => {
    if (global._evil_global_has_reloaded) return;

    console.log("Forcing reload to work around KubeJS bugs...")
    Utils.server.runCommand("reload");  
    global._evil_global_has_reloaded = true;
});