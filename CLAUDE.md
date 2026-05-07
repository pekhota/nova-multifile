# Nova MultiFile — AI Context

## What this package is

A standalone Laravel Nova 5 custom **field** that lets Nova **actions** accept multiple file uploads.
It is published as `pekhota/nova-multifile` on GitHub and consumed via Composer VCS repository.

## Package structure

```
nova-multifile/
├── src/
│   ├── MultiFile.php            # Field class — the only PHP entry point consumers touch
│   └── FieldServiceProvider.php # Registers compiled assets with Nova::mix()
├── resources/
│   ├── js/
│   │   ├── field.js             # Vue entry point — imports the three SFCs
│   │   └── components/
│   │       ├── FormField.vue    # The only view that matters — drag-and-drop UI + fill()
│   │       ├── IndexField.vue   # Blank placeholder (field is hidden on index by default)
│   │       └── DetailField.vue  # Read-only file count display
│   └── css/
│       └── field.css            # Dropzone and file-list styles
├── dist/                        # Pre-built assets committed to git (no build step needed)
│   ├── js/field.js              # Hand-crafted IIFE — see "dist strategy" below
│   ├── css/field.css
│   └── mix-manifest.json        # Required by Nova::mix(); maps /js/field.js → /js/field.js
├── tests/
│   ├── Pest.php
│   ├── TestCase.php             # Extends Orchestra\Testbench\TestCase
│   └── MultiFileTest.php        # Standalone Pest tests — no Nova UI needed
└── .github/workflows/
    ├── tests.yml                # PHP 8.2 / 8.3 / 8.4 matrix; needs NOVA_USERNAME + NOVA_PASSWORD secrets
    └── lint.yml                 # composer validate --strict
```

## How Nova loads the field

1. `FieldServiceProvider::boot()` calls `Nova::mix('nova-multifile', __DIR__.'/../dist/mix-manifest.json')`.
2. Nova reads `mix-manifest.json` and serves `dist/js/field.js` + `dist/css/field.css`.
3. `field.js` runs `Nova.booting(app => { app.component('form-nova-multifile', ...) })`.
4. When Nova renders an action modal it looks up the Vue component by name (`form-nova-multifile`).

## dist strategy — no build step

`laravel/nova-devtool` (the webpack toolchain) is a private Composer package from `nova.laravel.com`.
To avoid requiring consumers to run a build, **compiled assets are committed to git**.

`dist/js/field.js` is a **hand-crafted IIFE** that uses `Vue` and `LaravelNova` globals already
present on the Nova page. It does not use a module bundler. Modify it directly when making
frontend changes, or run the full build once `composer install` has pulled `nova-devtool`:

```bash
composer install          # inside nova-multifile/
npm install
npm run prod              # writes to dist/
```

## Key design decisions

### FormData key: `attribute[]`

The Vue `fill(formData)` method appends each file as `formData.append('attribute[]', file)`.
PHP's `$_FILES` then exposes this as an array under `$request->file('attribute')`.

### fillAttributeFromRequest

Overrides `Field::fillAttributeFromRequest()` to call `$request->file($requestAttribute)` instead
of `$request->input()`. Normalises a single `UploadedFile` or an array into `UploadedFile[]` and
writes it to the `ActionFields` Fluent model via `$model->forceFill()`.

### $withoutActionEvents = true — REQUIRED on every consumer action

Nova serializes `ActionFields` into the `action_events` table after `handle()` runs.
`UploadedFile` objects cannot be serialized (`Serialization of 'UploadedFile' is not allowed`).
Any action that uses this field **must** declare:

```php
public $withoutActionEvents = true;
```

This cannot be enforced from within the field itself.

## PHP API

```php
MultiFile::make('Attachments')
    ->accept(['.pdf', '.docx', 'image/*'])  // string or array; joined with comma
    ->maxFiles(5)                           // passed to Vue as meta.maxFiles
    ->help('...')                           // standard Nova help text
```

`$fields->get('attachments')` in `handle()` returns `UploadedFile[]` or `null`.

## Tests

Standalone Pest tests via `orchestra/testbench` — no running Nova application needed.

```bash
vendor/bin/pest --compact          # or: composer test
```

Tests cover: component name, `showOnIndex`, `accept()` string/array, `maxFiles()`,
multi-file fill, single-file normalisation, no-upload no-op, fluent chaining.

## Versioning & release workflow

1. Make changes in `nova-multifile/`.
2. Update `CHANGELOG.md`.
3. Commit and push to `main`.
4. Tag: `git tag vX.Y.Z && git push origin main vX.Y.Z`.
5. In the consuming project: `composer update pekhota/nova-multifile`.

Repository: `git@github.com:pekhota/nova-multifile.git`
Packagist: not yet published — consumed via Composer VCS repository.

## CI secrets required

GitHub Actions tests authenticate with the Nova private Composer registry:
- `NOVA_USERNAME` — Nova account email
- `NOVA_PASSWORD` — Nova license key
