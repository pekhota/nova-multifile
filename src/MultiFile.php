<?php

declare(strict_types=1);

namespace Pekhota\NovaMultiFile;

use Laravel\Nova\Fields\Field;
use Laravel\Nova\Http\Requests\NovaRequest;

class MultiFile extends Field
{
    /**
     * The field's component.
     *
     * @var string
     */
    public $component = 'nova-multifile';

    /**
     * Indicates if the element should be shown on the index view.
     *
     * @var bool
     */
    public $showOnIndex = false;

    /**
     * Set the accepted MIME types or file extensions.
     *
     * @param  string|array<int, string>  $types
     */
    public function accept(string|array $types): static
    {
        $accept = is_array($types) ? implode(',', $types) : $types;

        return $this->withMeta(['accept' => $accept]);
    }

    /**
     * Set the maximum number of files allowed.
     */
    public function maxFiles(int $max): static
    {
        return $this->withMeta(['maxFiles' => $max]);
    }

    /**
     * Hydrate the given attribute on the model based on the incoming request.
     * Resolves multiple uploaded files from the `attribute[]` FormData key.
     *
     * @param  \Illuminate\Database\Eloquent\Model|\Laravel\Nova\Support\Fluent  $model
     */
    protected function fillAttributeFromRequest(
        NovaRequest $request,
        string $requestAttribute,
        object $model,
        string $attribute,
    ): void {
        $files = $request->file($requestAttribute);

        if ($files !== null) {
            $model->forceFill([
                $attribute => is_array($files) ? $files : [$files],
            ]);
        }
    }
}
