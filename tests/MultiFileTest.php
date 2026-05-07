<?php

declare(strict_types=1);

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Support\Fluent;
use Pekhota\NovaMultiFile\MultiFile;

it('registers the correct vue component name', function () {
    expect(MultiFile::make('Files')->component)->toBe('nova-multifile');
});

it('is hidden on the index view by default', function () {
    expect(MultiFile::make('Files')->showOnIndex)->toBeFalse();
});

it('sets accept meta from a string', function () {
    $field = MultiFile::make('Files')->accept('.pdf,.docx');

    expect($field->meta['accept'])->toBe('.pdf,.docx');
});

it('sets accept meta from an array', function () {
    $field = MultiFile::make('Files')->accept(['.pdf', '.docx', '.xlsx']);

    expect($field->meta['accept'])->toBe('.pdf,.docx,.xlsx');
});

it('sets maxFiles meta', function () {
    $field = MultiFile::make('Files')->maxFiles(5);

    expect($field->meta['maxFiles'])->toBe(5);
});

it('fills the model with multiple uploaded files', function () {
    $file1 = UploadedFile::fake()->create('document1.pdf', 100);
    $file2 = UploadedFile::fake()->create('document2.pdf', 200);

    $novaRequest = NovaRequest::createFrom(
        Request::create('/', 'POST', [], [], ['files' => [$file1, $file2]])
    );

    $model = new Fluent;
    MultiFile::make('Files', 'files')->fill($novaRequest, $model);

    expect($model->files)
        ->toBeArray()
        ->toHaveCount(2)
        ->each->toBeInstanceOf(UploadedFile::class);
});

it('normalises a single uploaded file into an array', function () {
    $file = UploadedFile::fake()->create('document.pdf', 100);

    $novaRequest = NovaRequest::createFrom(
        Request::create('/', 'POST', [], [], ['files' => $file])
    );

    $model = new Fluent;
    MultiFile::make('Files', 'files')->fill($novaRequest, $model);

    expect($model->files)
        ->toBeArray()
        ->toHaveCount(1)
        ->and($model->files[0])->toBeInstanceOf(UploadedFile::class);
});

it('does not touch the model when no files are uploaded', function () {
    $novaRequest = NovaRequest::createFrom(Request::create('/', 'POST'));

    $model = new Fluent;
    MultiFile::make('Files', 'files')->fill($novaRequest, $model);

    expect($model->files)->toBeNull();
});

it('accepts chained fluent configuration', function () {
    $field = MultiFile::make('Attachments')
        ->accept(['image/*', '.pdf'])
        ->maxFiles(3);

    expect($field->meta['accept'])->toBe('image/*,.pdf')
        ->and($field->meta['maxFiles'])->toBe(3);
});
