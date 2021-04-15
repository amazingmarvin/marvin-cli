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
serves a subset of the public API.

So marvin-cli can either communicate with the public API or a desktop app
instance.

# Installation

* Install deno
* Clone repository
* `./build`
* Copy `marvin-cli` to your path

Binaries will be provided in the future.
