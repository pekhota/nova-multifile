"use strict";

(function () {
  var r = Vue;
  var LaravelNova = window.LaravelNova;

  function withRender(component, options) {
    var opts = component.__vccOpts || component;
    for (var i = 0; i < options.length; i++) {
      opts[options[i][0]] = options[i][1];
    }
    return opts;
  }

  // ─── IndexField ─────────────────────────────────────────────────────────────

  var IndexFieldDef = {
    props: ['resourceName', 'field'],
  };

  var IndexField = withRender(IndexFieldDef, [
    ['render', function (ctx, cache, $props) {
      return (r.openBlock(), r.createElementBlock('span', null,
        r.toDisplayString($props.field.value || '—'), 1
      ));
    }],
  ]);

  // ─── DetailField ────────────────────────────────────────────────────────────

  var DetailFieldDef = {
    props: ['index', 'resource', 'resourceName', 'resourceId', 'field'],
  };

  var DetailField = withRender(DetailFieldDef, [
    ['render', function (ctx, cache, $props) {
      var PanelItem = r.resolveComponent('PanelItem');
      return (r.openBlock(), r.createBlock(PanelItem, {
        index: $props.index,
        field: $props.field,
      }, null, 8, ['index', 'field']));
    }],
  ]);

  // ─── FormField ──────────────────────────────────────────────────────────────

  var FormFieldDef = {
    mixins: [LaravelNova.FormField, LaravelNova.HandlesValidationErrors],
    props: ['resourceName', 'resourceId', 'field'],

    data: function () {
      return {
        files: [],
        isDragging: false,
      };
    },

    methods: {
      triggerInput: function () {
        this.$refs.fileInput.click();
      },

      onDragOver: function () {
        this.isDragging = true;
      },

      onDragLeave: function () {
        this.isDragging = false;
      },

      onDrop: function (e) {
        this.isDragging = false;
        var transferred = e.dataTransfer && e.dataTransfer.files;
        this.addFiles(transferred ? Array.from(transferred) : []);
      },

      onInputChange: function (e) {
        var selected = e.target && e.target.files;
        this.addFiles(selected ? Array.from(selected) : []);
        if (e.target) { e.target.value = ''; }
      },

      addFiles: function (newFiles) {
        var max = this.field && this.field.maxFiles;
        if (max !== undefined && max !== null) {
          var remaining = max - this.files.length;
          if (remaining <= 0) { return; }
          newFiles = newFiles.slice(0, remaining);
        }
        for (var i = 0; i < newFiles.length; i++) {
          this.files.push(newFiles[i]);
        }
      },

      removeFile: function (idx) {
        this.files.splice(idx, 1);
      },

      formatSize: function (bytes) {
        if (bytes < 1024) { return bytes + ' B'; }
        if (bytes < 1048576) { return (bytes / 1024).toFixed(1) + ' KB'; }
        return (bytes / 1048576).toFixed(1) + ' MB';
      },

      fill: function (formData) {
        var attr = this.fieldAttribute;
        for (var i = 0; i < this.files.length; i++) {
          formData.append(attr + '[]', this.files[i], this.files[i].name);
        }
      },
    },
  };

  var FormField = withRender(FormFieldDef, [
    ['render', function (ctx, cache, $props, $setup, $data, $options) {
      var DefaultField = r.resolveComponent('DefaultField');

      return (r.openBlock(), r.createBlock(DefaultField, {
        field: $props.field,
        errors: ctx.errors,
        'show-help-text': ctx.showHelpText,
        'full-width-content': ctx.fullWidthContent,
      }, {
        field: r.withCtx(function () {
          return [
            r.createElementVNode('div', null, [

              // ── Dropzone ──────────────────────────────────────────────────
              r.createElementVNode('div', {
                class: r.normalizeClass([
                  'nova-multifile-dropzone',
                  $data.isDragging ? 'nova-multifile-dropzone--active' : '',
                ]),
                onDragover: r.withModifiers(
                  function (e) { return $options.onDragOver && $options.onDragOver(e); },
                  ['prevent']
                ),
                onDragleave: r.withModifiers(
                  function (e) { return $options.onDragLeave && $options.onDragLeave(e); },
                  ['prevent']
                ),
                onDrop: r.withModifiers(
                  function (e) { return $options.onDrop && $options.onDrop(e); },
                  ['prevent']
                ),
                onClick: function () { return $options.triggerInput && $options.triggerInput(); },
              }, [

                // SVG upload cloud icon
                r.createElementVNode('svg', {
                  xmlns: 'http://www.w3.org/2000/svg',
                  width: '32',
                  height: '32',
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': '1.5',
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                  class: 'nova-multifile-icon',
                }, [
                  r.createElementVNode('polyline', { points: '16 16 12 12 8 16' }),
                  r.createElementVNode('line', { x1: '12', y1: '12', x2: '12', y2: '21' }),
                  r.createElementVNode('path', { d: 'M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3' }),
                ]),

                // Label
                r.createElementVNode('p', { class: 'nova-multifile-label' }, [
                  r.createTextVNode('Drop files here or '),
                  r.createElementVNode('strong', null, 'click to browse'),
                ]),

                // Accept hint (v-if)
                $props.field && $props.field.accept
                  ? r.createElementVNode('p', { class: 'nova-multifile-hint' },
                      'Accepted: ' + r.toDisplayString($props.field.accept), 1)
                  : r.createCommentVNode('', true),

                // Max files hint (v-if)
                $props.field && $props.field.maxFiles
                  ? r.createElementVNode('p', { class: 'nova-multifile-hint' },
                      'Max ' + r.toDisplayString($props.field.maxFiles) + ' file(s)', 1)
                  : r.createCommentVNode('', true),

                // Hidden file input
                r.createElementVNode('input', {
                  ref: 'fileInput',
                  type: 'file',
                  multiple: '',
                  accept: $props.field && $props.field.accept ? $props.field.accept : '',
                  class: 'nova-multifile-input',
                  onClick: r.withModifiers(function () {}, ['stop']),
                  onChange: function (e) { return $options.onInputChange && $options.onInputChange(e); },
                }, null, 8, ['accept', 'onChange']),

              ], 34), // CLASS | HYDRATE_EVENTS

              // ── File list (v-if files.length > 0) ────────────────────────
              $data.files && $data.files.length > 0
                ? (r.openBlock(), r.createElementBlock('ul', { key: 0, class: 'nova-multifile-list' },
                    r.renderList($data.files, function (file, idx) {
                      return (r.openBlock(), r.createElementBlock('li', {
                        key: idx,
                        class: 'nova-multifile-item',
                      }, [
                        r.createElementVNode('span', { class: 'nova-multifile-filename' },
                          r.toDisplayString(file.name), 1),
                        r.createElementVNode('span', { class: 'nova-multifile-size' },
                          r.toDisplayString($options.formatSize(file.size)), 1),
                        r.createElementVNode('button', {
                          type: 'button',
                          class: 'nova-multifile-remove',
                          onClick: r.withModifiers(
                            (function (capturedIdx) {
                              return function (e) {
                                return $options.removeFile && $options.removeFile(capturedIdx);
                              };
                            }(idx)),
                            ['stop']
                          ),
                        }, '×', 8, ['onClick']),
                      ]));
                    })
                  ))
                : r.createCommentVNode('', true),

            ]),
          ];
        }),
        _: 1,
      }, 8, ['field', 'errors', 'show-help-text', 'full-width-content']));
    }],
  ]);

  // ─── Register with Nova ──────────────────────────────────────────────────────

  Nova.booting(function (app, store) {
    app.component('index-nova-multifile', IndexField);
    app.component('detail-nova-multifile', DetailField);
    app.component('form-nova-multifile', FormField);
  });
}());
