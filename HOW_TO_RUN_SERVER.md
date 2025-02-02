# How To Start / Run The Server

If your `variables.txt` has `JAVA=java` set, then a suitable Java version for your Minecraft server will
be installed automatically.

Forge and NeoForge 1.17 and up will create run.xx-scripts due to the ServerStarterJar being used to install
and run the server. It is safe to ignore these and continue using the start.xx-scripts.
Deleting the run.xx-scripts will result in the server being installed again by the ServerStarterJar. More about
the ServerStarterJar at https://github.com/neoforged/ServerStarterJar

## Linux

Run `.\start.sh` or `bash start.sh` to start the server.

## Windows

Run `start.bat`.
Do **not** delete the PowerShell (ps1) files!

### Convenience

You may run `start.ps1` from a console-window manually, but using the Batch-script is recommended.
Running PowerShell-scripts requires changing the ExecutionPolicy of your Windows-system. The Batch-script
can bypass this for the start-script.

TL;DR: start.bat better than start.ps1

## MacOS

Run `.\start.sh` or `bash start.sh` to start the server.

# Issues with this server pack

If you downloaded this server pack from the internet and you run into issues with this server pack, then please
contact the creators of the server pack about your issue(s).

If you've created this server pack yourself and you run into issues, feel free to contact the developers of
ServerPackCreator for support.