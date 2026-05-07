# Changelog

All notable changes to **Nova MultiFile** will be documented in this file.  
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org).

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
