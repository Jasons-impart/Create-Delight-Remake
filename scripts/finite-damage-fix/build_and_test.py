#!/usr/bin/env python3
"""Build/test version-pinned Hotai patches in a new output directory; runtime is read-only."""
import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--runtime', type=Path, required=True, help='Minecraft directory with mods/ and libraries/')
parser.add_argument('--output', type=Path, required=True, help='New directory outside the runtime')
parser.add_argument('--java-home', type=Path, default=os.environ.get('JAVA_HOME'))
parser.add_argument('--config', type=Path, help='attributeslib.cfg; defaults to repository config')
args = parser.parse_args()
SERVER = args.runtime.resolve()
HERE = Path(__file__).resolve().parent
WORK = args.output.resolve()
CONFIG = (args.config or HERE.parents[1] / 'config/attributeslib.cfg').resolve()
if WORK == SERVER or SERVER in WORK.parents:
    parser.error('--output must be outside the runtime')
if WORK.exists():
    parser.error('--output must be a new directory')
JAVA = args.java_home / 'bin/java' if args.java_home else shutil.which('java')
JAVAC = args.java_home / 'bin/javac' if args.java_home else shutil.which('javac')
if not JAVA or not JAVAC:
    parser.error('JDK 17+ required; use --java-home or JAVA_HOME')

def library(group, artifact, version):
    path = SERVER / 'libraries' / group / artifact / version / (artifact + '-' + version + '.jar')
    if not path.is_file():
        parser.error('Required library missing: ' + str(path))
    return path

ASM = [library('org/ow2/asm', m, '9.8') for m in ['asm', 'asm-tree', 'asm-analysis']]
HOTAI = SERVER / 'mods/hotai-1.0.jar'
ATTR = SERVER / 'mods/ApothicAttributes-1.20.1-1.3.7.jar'
DEPENDENCIES = [*ASM, ATTR, HOTAI, library('cpw/mods', 'modlauncher', '10.0.9'), library('org/slf4j', 'slf4j-api', '2.0.1')]
EXPECTED = {
 'alexsmobs-1.22.9.jar': '16bc5bcc19db9029c24f951346ec71098e6f5b0afef96e61894a2e9407aad37c',
 'ApothicAttributes-1.20.1-1.3.7.jar': '68487b11c0d4e2f67a85f2b04bf65e99ac15294f2923f4391f83e9542293187a',
}
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
for name, expected in EXPECTED.items():
    if sha(SERVER / 'mods' / name) != expected:
        parser.error('Original JAR SHA-256 mismatch: ' + name)
CLASSES = WORK / 'classes'
STUBS = WORK / 'stubs'
PATCH = WORK / 'patch'
RULES = 'dev/shadowsoffire/attributeslib/api/ALCombatRules'
TOAD = 'com/github/alexthe666/alexsmobs/entity/EntityWarpedToad'
CLASSES.mkdir(parents=True)

def run(command):
    result = subprocess.run([str(x) for x in command], text=True, capture_output=True)
    if result.returncode:
        raise RuntimeError(result.stdout + result.stderr)
    print(result.stdout, end='')
    return result.stdout

def stub(name, source):
    path = STUBS / (name.replace('.', '/') + '.java')
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(source, encoding='utf-8')
    return path

sources = []
sources.append(stub('net.minecraft.world.entity.Entity', 'package net.minecraft.world.entity; public class Entity {}'))
sources.append(stub('net.minecraft.world.entity.ai.attributes.Attribute', 'package net.minecraft.world.entity.ai.attributes; public class Attribute {}'))
sources.append(stub('net.minecraft.world.entity.LivingEntity', '''package net.minecraft.world.entity;
public class LivingEntity extends Entity {
 public double m_21133_(net.minecraft.world.entity.ai.attributes.Attribute a) { return 0; }
}'''))
sources.append(stub('net.minecraft.world.damagesource.DamageSource', '''package net.minecraft.world.damagesource;
public class DamageSource {
 public net.minecraft.world.entity.Entity m_7639_() { return null; }
}'''))
sources.append(stub('net.minecraftforge.registries.RegistryObject', '''package net.minecraftforge.registries;
public class RegistryObject<T> { public T get() { return null; } }'''))
sources.append(stub('dev.shadowsoffire.attributeslib.api.ALObjects', '''package dev.shadowsoffire.attributeslib.api;
public class ALObjects { public static class Attributes {
 public static net.minecraftforge.registries.RegistryObject PROT_SHRED, PROT_PIERCE, ARMOR_SHRED, ARMOR_PIERCE;
} }'''))
config = CONFIG.read_text(encoding='utf-8')
formulas = {}
for key in ['Protection Formula', 'A-Value Formula', 'Armor Formula']:
    formulas[key] = re.search(r'S:"' + re.escape(key) + r'"=(.*)', config).group(1).strip()
# Only the config provider/game APIs are stubbed. Expression evaluation and the entire
# ALCombatRules class under test come from the actual installed mod.
sources.append(stub('dev.shadowsoffire.attributeslib.ALConfig', '''package dev.shadowsoffire.attributeslib;
import java.util.Optional;
import repack.evalex.Expression;
public class ALConfig {
 public static Optional<Expression> getProtExpr() { return Optional.of(new Expression(%s)); }
 public static Optional<Expression> getAValueExpr() { return Optional.of(new Expression(%s)); }
 public static Optional<Expression> getArmorExpr() { return Optional.of(new Expression(%s)); }
}''' % tuple(json.dumps(formulas[key]) for key in ['Protection Formula', 'A-Value Formula', 'Armor Formula'])))

classpath = os.pathsep.join(str(x) for x in DEPENDENCIES)
run([JAVAC, '--release', '17', '-cp', classpath, '-d', CLASSES,
     HERE / 'BuildDamageFix.java', HERE / 'DamageFixRegression.java', HERE / 'HotaiRoundTrip.java', *sources])
runtime = os.pathsep.join(str(x) for x in [CLASSES, *DEPENDENCIES])
log = run([JAVA, '-Xverify:all', '-cp', runtime, 'BuildDamageFix', SERVER / 'mods', PATCH])
log += run([JAVA, '-Xverify:all', '-cp', runtime, 'DamageFixRegression', SERVER / 'mods', PATCH])
log += run([JAVA, '-Xverify:all', '-cp', runtime, 'HotaiRoundTrip', SERVER / 'mods', PATCH, WORK / 'converted', WORK / 'replayed'])
log += run([JAVA, '-Xverify:all', '-cp', runtime, 'DamageFixRegression', SERVER / 'mods', WORK / 'replayed'])
(WORK / 'test-results.txt').write_text(log, encoding='utf-8')
manifest = {'original_jar_sha256': EXPECTED, 'formulas': formulas, 'files': {}}
for folder, extension in [(PATCH, '*.class'), (WORK / 'converted', '*.badiff')]:
    for path in sorted(folder.rglob(extension)):
        manifest['files'][path.relative_to(WORK).as_posix()] = sha(path)
(WORK / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('All checks passed. Generated files stay in ' + str(WORK) + '; runtime was not modified.')
