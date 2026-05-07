# Nova MultiFile

A Laravel Nova field that lets Nova **actions** accept multiple file uploads with drag-and-drop support.

## Features

- Drag-and-drop or click-to-browse dropzone
- Displays selected files with name, size, and individual remove buttons
- `accept()` — restrict to specific MIME types or extensions (passed to `<input accept>`)
- `maxFiles()` — cap the number of selectable files
- PHP `handle()` receives a typed `UploadedFile[]` array directly via `$fields->attribute`

## Requirements

- PHP ^8.2
- Laravel ^10 | ^11 | ^12 | ^13
- Laravel Nova ^5

## Installation

```bash
composer require pekhota/nova-multifile
```

> **Note:** Nova is distributed through a private Composer repository. Make sure your project
> already has `https://nova.laravel.com` configured in `composer.json` and valid credentials.

## Usage

### Defining the field in an action

> **Important:** Nova serializes action field values into its action event log. Because
> `UploadedFile` objects cannot be serialized, you **must** add `public $withoutActionEvents = true;`
> to any action that uses this field.

```php
use Pekhota\NovaMultiFile\MultiFile;

class ImportDocuments extends Action
{
    public $withoutActionEvents = true;

    public function fields(NovaRequest $request): array
    {
        return [
            MultiFile::make('Documents')
                ->accept(['.pdf', '.docx', '.xlsx'])
                ->maxFiles(10)
                ->help('Upload up to 10 documents.'),
        ];
    }

    public function handle(ActionFields $fields, Collection $models): mixed
    {
        /** @var \Illuminate\Http\UploadedFile[] $files */
        $files = $fields->get('documents'); // always an array, or null if nothing uploaded

        if (empty($files)) {
            return Action::danger('No files were uploaded.');
        }

        foreach ($files as $file) {
            $path = $file->store('documents', 'local');
            // … further processing
        }

        return Action::message(sprintf('Imported %d file(s).', count($files)));
    }
}
```

### API

| Method | Description |
|--------|-------------|
| `accept(string\|array $types)` | Comma-separated or array of extensions / MIME types (`'.pdf'`, `'image/*'`) |
| `maxFiles(int $max)` | Maximum number of files the user can select |

### How the PHP side receives files

The Vue component appends each file to `FormData` as `attribute[]`. The field's
`fillAttributeFromRequest` override reads `$request->file('attribute')` and writes
a normalised `UploadedFile[]` to `$fields->attribute`.

```php
// In your action's handle():
$files = $fields->get('documents'); // UploadedFile[] or null
```

## Building from source

```bash
cd nova-multifile
composer install       # installs nova-devtool into vendor/
npm install
npm run prod           # writes compiled assets to dist/
```

Or use the convenience script from the parent project:

```bash
npm run build-nova-multifile-prod
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

MIT — see [LICENSE](LICENSE).
