<?php

declare(strict_types=1);

namespace Pekhota\NovaMultiFile;

use Illuminate\Support\ServiceProvider;
use Laravel\Nova\Events\ServingNova;
use Laravel\Nova\Nova;

class FieldServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Nova::serving(function (ServingNova $event) {
            Nova::mix('nova-multifile', __DIR__ . '/../dist/mix-manifest.json');
        });
    }

    public function register(): void
    {
        //
    }
}
