#!/bin/bash

# 开启 UTF-8 编码（大部分 Linux 默认已是）
export LANG=en_US.UTF-8

# 配置文件路径
filePath="variables.txt"

if [ ! -f "$filePath" ]; then
    echo "错误：未找到配置文件 $filePath"
    echo "请确认你是否下载了正确的整合包"
    exit 1
fi

# 逐行解析变量文件
while IFS= read -r line || [[ -n "$line" ]]; do
    # 跳过空行和注释行
    [[ -z "$line" || "$line" =~ ^# ]] && continue

    # 按等号分割变量名和值
    IFS='=' read -r varName varValue <<< "$line"

    # 去除可能存在的空白
    varName=$(echo "$varName" | xargs)
    varValue=$(echo "$varValue" | xargs)

    # 设置变量为环境变量
    export "$varName=$varValue"
    echo "$varName=$varValue"
done < "$filePath"

echo "正在检查 Java 是否存在..."
if ! command -v "$JAVA" >/dev/null 2>&1; then
    echo "未找到 Java，请安装 Java 17 并在 variables.txt 中正确设置 JAVA 路径（如 JAVA=/usr/bin/java）"
    exit 1
fi
echo "Java 已找到"

# 获取 Java 主版本号
JAVA_VER=$("$JAVA" -version 2>&1 | grep 'version' | sed -E 's/.*version "(.*)".*/\1/')
MAJOR_VER=$(echo "$JAVA_VER" | cut -d'.' -f1)

echo "检测到 Java 版本: $JAVA_VER, 主版本号: $MAJOR_VER"

if [ "$MAJOR_VER" != "$RECOMMENDED_JAVA_VER" ]; then
    echo "错误：检测到的 Java 主版本为 $MAJOR_VER，但推荐使用 Java $RECOMMENDED_JAVA_VER 来运行本整合包"
    echo "请安装 Java $RECOMMENDED_JAVA_VER 并在 variables.txt 中正确设置 JAVA 路径"
    echo "或者，如果你知道你在做什么，可以修改本脚本并跳过此检测，但我们无法保证其可运行"
    exit 1
fi

# 检查是否存在 run.bat（说明 Forge 已安装）
echo "正在检查 run.bat 是否存在..."
if [ ! -f "run.bat" ]; then
    echo "未找到 run.bat，正在安装 Forge 服务端..."
    "$JAVA" -jar forge.jar --installServer
    if [ $? -ne 0 ]; then
        echo "Forge 安装失败，请检查上方错误信息"
        exit 1
    fi
    if [ ! -f "run.bat" ]; then
        echo "Forge 安装成功，但未找到 run.bat，请确认当前目录中是否生成"
        exit 1
    fi
fi

# 写入默认配置
echo "正在写入默认配置..."
if [ ! -f "server.properties" ]; then
    echo "$JVM_ARGS" > user_jvm_args.txt
    # 注意：server.properties 和 eula.txt 会在服务端启动后生成
fi

# 启动服务端
echo "正在启动服务器..."
chmod +x run.sh
./run.sh
