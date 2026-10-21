# Private textbook fixture

`prototype.json` is deliberately excluded from this public repository. It contains material extracted from the owner's personal textbook.

Run `npm ci` and `npm run dev`. With no private fixture, the app opens a file picker for your personal prototype.json. The file is read only in browser memory, never uploaded. Alternatively, copy the fixture into this directory before building.

The development workspace retains this file at `/workspace/french1/src/data/prototype.json`. Back it up separately; it is not part of Git history. Do not upload it to a public repository or public hosting.

This repository supplies application source, not permission to redistribute the textbook. Full content import and validation are planned for later phases.
