# Changelog

All notable changes to **Nova MultiFile** will be documented in this file.  
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org).

---

## [1.0.3] – 2026-05-13

### Changed

- Moved `laravel/nova` from `require-dev` to `require` so novapackages.com correctly detects Nova 5 compatibility.
- Removed `illuminate/support` from `require` — it is already a transitive dependency of Nova.
- Added `composer.lock` to `.gitignore` and removed it from version control — lock files should not be committed in library packages.

---

## [1.0.2] – 2026-05-08

### Fixed

- Prevent click event on the hidden file input from bubbling back to the dropzone and re-triggering `triggerInput()` — adds `@click.stop` to the `<input>` in `FormField.vue` and the equivalent `withModifiers` stop modifier in `dist/js/field.js`.

### Documentation

- Add `AGENTS.md` documenting intentional design decisions (client-side-only `accept()`/`maxFiles()`, `forceFill()` usage, hand-crafted dist) to suppress false-positive AI code review alerts.

---

## [1.0.1] – 2026-05-07

### Documentation

- Document that actions using `MultiFile` must set `public $withoutActionEvents = true;` to avoid a serialization error — Nova attempts to serialize `UploadedFile` objects into the action event log, which PHP does not allow.

---

## [1.0.0] – 2026-05-07

### Added

- Initial release.
- `MultiFile` field with drag-and-drop dropzone and file list UI.
- `accept()` method to restrict file types via the `<input accept>` attribute.
- `maxFiles()` method to cap the number of selectable files.
- `fillAttributeFromRequest()` override that normalises single or multiple uploads into a typed `UploadedFile[]` array available as `$fields->attribute` in action `handle()` methods.
- Pre-built `dist/` assets — no separate build step required when installing.
