function initializeCoreMod() {
    var Opcodes = Java.type("org.objectweb.asm.Opcodes");
    var MethodInsnNode = Java.type("org.objectweb.asm.tree.MethodInsnNode");
    return {
        "cdr_launch_gate": {
            "target": {
                "type": "METHOD",
                "class": "net.minecraft.client.main.Main",
                "methodName": "main",
                "methodDesc": "([Ljava/lang/String;)V"
            },
            "transformer": function (methodNode) {
                methodNode.instructions.insert(new MethodInsnNode(
                    Opcodes.INVOKESTATIC,
                    "com/jsi/cdr/updater/LaunchHook",
                    "clientGate",
                    "()V",
                    false
                ));
                return methodNode;
            }
        }
    };
}
