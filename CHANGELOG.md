# Changelog

All notable changes to **Nova MultiFile** will be documented in this file.  
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project adheres to [Semantic Versioning](https://semver.org).

---

## [1.0.0] – 2025-05-06

### Added

- Initial release.
- `MultiFile` field with drag-and-drop dropzone and file list UI.
- `accept()` method to restrict file types via the `<input accept>` attribute.
- `maxFiles()` method to cap the number of selectable files.
- `fillAttributeFromRequest()` override that normalises single or multiple uploads into a typed `UploadedFile[]` array available as `$fields->attribute` in action `handle()` methods.
- Pre-built `dist/` assets — no separate build step required when installing.
