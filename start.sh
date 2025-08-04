#!/bin/bash

# --- Minecraft Modpack Server Starter for macOS/Linux ---
# This version uses a more robust method to parse the config file.

set -e

CONFIG_FILE="variables.nix.txt"
FORGE_INSTALLER_JAR="forge.jar"
FORGE_RUN_SCRIPT="run.sh"

print_info() { echo -e "\033[0;36m[INFO]\033[0m $1"; }
print_success() { echo -e "\033[0;32m[SUCCESS]\033[0m $1"; }
print_error() { echo -e "\033[0;31m[ERROR]\033[0m $1"; }
print_warning() { echo -e "\033[0;33m[WARNING]\033[0m $1"; }

if [ ! -f "$CONFIG_FILE" ]; then
print_error "Config file '$CONFIG_FILE' not found!"
print_error "Please create it and define variables like JAVA, RECOMMENDED_JAVA_VER, and JVM_ARGS."
exit 1
fi

print_info "Loading configuration from $CONFIG_FILE..."
# Use a while loop with process substitution to be robust against file formats
while IFS='=' read -r key value || [[ -n "$key" ]]; do
# Ignore comments and empty lines
if [[ "$key" =~ ^\s*# ]] || [[ -z "$key" ]]; then
    continue
fi
# Trim whitespace from key and value using sed (more robust than xargs)
key=$(echo "$key" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
value=$(echo "$value" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

if [[ -n "$key" ]]; then
  print_info "  - Setting $key=$value"
  export "$key=$value"
fi
done < <(tr -d '\r' < "$CONFIG_FILE") # This tr command removes Windows carriage returns (\r)

if [ -z "$JAVA" ] || [ -z "$RECOMMENDED_JAVA_VER" ] || [ -z "$JVM_ARGS" ]; then
print_error "One or more required variables (JAVA, RECOMMENDED_JAVA_VER, JVM_ARGS) are not set in $CONFIG_FILE."
exit 1
fi

print_info "Checking Java existence..."
if ! command -v "$JAVA" &> /dev/null; then
print_error "Java command '$JAVA' not found!"
print_error "Please install Java $RECOMMENDED_JAVA_VER and ensure '$JAVA' is in your system's PATH,"
print_error "or set the full path to the java executable in '$CONFIG_FILE'."
exit 1
fi
print_success "Java found at: $(command -v "$JAVA")"

print_info "Detecting Java version..."
JAVA_FULL_VERSION_STRING=$("$JAVA" -version 2>&1)
JAVA_VER=$(echo "$JAVA_FULL_VERSION_STRING" | grep 'version' | sed -n 's/.*version "\(.*\)".*/\1/p')
MAJOR_VER=$(echo "$JAVA_VER" | cut -d'.' -f1)

print_info "Detected Java version: $JAVA_VER (Major: $MAJOR_VER)"

if [ "$MAJOR_VER" != "$RECOMMENDED_JAVA_VER" ]; then
print_error "Detected Java version $MAJOR_VER, but Java $RECOMMENDED_JAVA_VER is recommended."
print_warning "If you know what you are doing, you can edit this script to remove this check."
exit 1
fi
print_success "Java version check passed."

print_info "Checking if server is installed (looking for '$FORGE_RUN_SCRIPT')..."
if [ ! -f "$FORGE_RUN_SCRIPT" ]; then
print_warning "'$FORGE_RUN_SCRIPT' not found. Starting Forge server installation..."
"$JAVA" -jar "$FORGE_INSTALLER_JAR" --installServer

if [ ! -f "$FORGE_RUN_SCRIPT" ]; then
    print_error "Forge installation failed. Could not find '$FORGE_RUN_SCRIPT' after running the installer."
    print_error "Check the logs above for errors (e.g., network issues)."
    exit 1
fi
print_success "Forge server installed successfully."
fi

print_info "Writing default configs..."
if [ ! -f "user_jvm_args.txt" ]; then
echo "$JVM_ARGS" > user_jvm_args.txt
print_info "Created user_jvm_args.txt"
fi

if [ ! -f "eula.txt" ] || ! grep -q "eula=true" "eula.txt"; then
print_warning "EULA not accepted. Automatically setting eula=true."
print_warning "By running this server, you are indicating your agreement to the Minecraft EULA (https://account.mojang.com/documents/minecraft_eula)."
echo "eula=true" > eula.txt
fi

print_info "Making '$FORGE_RUN_SCRIPT' executable..."
chmod +x "$FORGE_RUN_SCRIPT"

print_success "All checks passed. Launching the server now..."
echo "----------------------------------------------------"

exec ./"$FORGE_RUN_SCRIPT" "$@"
