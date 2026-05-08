## Intentional design decisions

### `accept()` / `maxFiles()` are client-side UI hints only
These are convenience methods that pass values to the Vue component as metadata.
Server-side validation is the consumer's responsibility via Nova's standard
`->rules()` / `->addRules()` chain on the field. This is by design — the package
does not know the consumer's storage backend or business rules.

### `forceFill()` in `fillAttributeFromRequest`
This field is action-only. `$model` passed to `fillAttributeFromRequest` is always
a `Laravel\Nova\Support\Fluent` (`ActionFields`), never an Eloquent model. Dotted-
attribute handling in `fillModelWithData()` is irrelevant here.

### `dist/js/field.js` is hand-crafted, not build output
The file is a manually maintained IIFE that uses the Vue / LaravelNova globals
already present on Nova pages. It is committed to git so consumers do not need the
private `laravel/nova-devtool` Composer package to use this field.
