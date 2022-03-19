marvin-cli

A command-line tool for interfacing with the Amazing Marvin desktop app and public API.

# Word of Warning

This is a work-in-progress. Not all documented features are working and/or
working as expected. PRs welcome!

# Background

While you can use Marvin's public API to create tasks, scripting is a bit
easier with a command-line tool so that you can:

```bash
marvin add task "Example +today"
```

But even more importantly, until now scripting wasn't possible for desktop
users who disable cloud sync. As of 1.60.0 you can run a local API server which
serves a subset of the public API, plus some bonus commands that only work on
desktop.

So marvin-cli can either communicate with the public API or a desktop app
instance.

# Commands

```
COMMANDS:
    api    - View API docs
    config - Get/set config values for marvin-cli
    add    - Add a Task, Project, or other
    today  - List Tasks and Projects that are scheduled today
    update - Update a Task, Project, or other (not yet implemented)
    delete - Delete a Task, Project, or other (not yet implemented)
    help   - Help about any command

DESKTOP COMMANDS:
    run      - Start the desktop app (not yet implemented)
    quickAdd - Open desktop quick add
    list     - List Tasks/Projects, optionally filtered
    backup   - Trigger backups (not yet implemented)
    restore  - Restore backups (not yet implemented)
    quit     - Shut down the app (not yet implemented)
```

# Installation

* Install deno
* Clone repository
* Run `./build` (or `BUILD.bat` on windows)
* Copy `marvin-cli` (or `marvin-cli.exe on windows) to your path
