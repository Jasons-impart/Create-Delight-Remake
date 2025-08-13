// Force a reload immediately after the first player logs in 
//  so as to make sure item merge scripts work.

global._evil_global_has_reloaded = false;

ServerEvents.loaded(event => {
    if (global._evil_global_has_reloaded) return;

    console.log("Forcing reload to work around KubeJS bugs...")
    Utils.server.runCommand("reload");  
    global._evil_global_has_reloaded = true;
});