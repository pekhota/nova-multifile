<template>
  <DefaultField
    :field="field"
    :errors="errors"
    :show-help-text="showHelpText"
    :full-width-content="fullWidthContent"
  >
    <template #field>
      <div>
        <div
          :class="['nova-multifile-dropzone', isDragging ? 'nova-multifile-dropzone--active' : '']"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
          @click="triggerInput"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="nova-multifile-icon"
          >
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
          </svg>

          <p class="nova-multifile-label">
            Drop files here or <strong>click to browse</strong>
          </p>

          <p v-if="field.accept" class="nova-multifile-hint">
            Accepted: {{ field.accept }}
          </p>

          <p v-if="field.maxFiles" class="nova-multifile-hint">
            Max {{ field.maxFiles }} file(s)
          </p>

          <input
            ref="fileInput"
            type="file"
            multiple
            :accept="field.accept || ''"
            class="nova-multifile-input"
            @change="onInputChange"
          />
        </div>

        <ul v-if="files.length > 0" class="nova-multifile-list">
          <li
            v-for="(file, idx) in files"
            :key="idx"
            class="nova-multifile-item"
          >
            <span class="nova-multifile-filename">{{ file.name }}</span>
            <span class="nova-multifile-size">{{ formatSize(file.size) }}</span>
            <button
              type="button"
              class="nova-multifile-remove"
              @click.stop="removeFile(idx)"
            >
              &times;
            </button>
          </li>
        </ul>
      </div>
    </template>
  </DefaultField>
</template>

<script>
import { FormField, HandlesValidationErrors } from 'laravel-nova'

export default {
  mixins: [FormField, HandlesValidationErrors],
  props: ['resourceName', 'resourceId', 'field'],

  data() {
    return {
      files: [],
      isDragging: false,
    }
  },

  methods: {
    triggerInput() {
      this.$refs.fileInput.click()
    },

    onDragOver() {
      this.isDragging = true
    },

    onDragLeave() {
      this.isDragging = false
    },

    onDrop(e) {
      this.isDragging = false
      this.addFiles(Array.from(e.dataTransfer?.files ?? []))
    },

    onInputChange(e) {
      this.addFiles(Array.from(e.target?.files ?? []))
      if (e.target) e.target.value = ''
    },

    addFiles(newFiles) {
      if (this.field.maxFiles !== undefined) {
        const remaining = this.field.maxFiles - this.files.length
        if (remaining <= 0) return
        newFiles = newFiles.slice(0, remaining)
      }
      this.files.push(...newFiles)
    },

    removeFile(idx) {
      this.files.splice(idx, 1)
    },

    formatSize(bytes) {
      if (bytes < 1024) return `${bytes} B`
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    },

    fill(formData) {
      this.files.forEach((file) => {
        formData.append(`${this.fieldAttribute}[]`, file, file.name)
      })
    },
  },
}
</script>

<style scoped>
.nova-multifile-dropzone {
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
  margin-top: 0.5rem;
  user-select: none;
}

.nova-multifile-dropzone:hover,
.nova-multifile-dropzone--active {
  border-color: #6366f1;
  background-color: #f5f3ff;
}

.nova-multifile-icon {
  color: #9ca3af;
  margin: 0 auto 0.5rem;
  display: block;
}

.nova-multifile-input {
  display: none;
}

.nova-multifile-label {
  margin: 0.5rem 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.nova-multifile-hint {
  margin: 0.25rem 0 0;
  color: #9ca3af;
  font-size: 0.75rem;
}

.nova-multifile-list {
  list-style: none;
  margin: 0.75rem 0 0;
  padding: 0;
}

.nova-multifile-item {
  display: flex;
  align-items: center;
  padding: 0.375rem 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  margin-bottom: 0.25rem;
  background: #f9fafb;
  font-size: 0.875rem;
}

.nova-multifile-filename {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nova-multifile-size {
  color: #9ca3af;
  margin-left: 0.5rem;
  white-space: nowrap;
  font-size: 0.75rem;
}

.nova-multifile-remove {
  margin-left: 0.5rem;
  color: #9ca3af;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 1.125rem;
  line-height: 1;
  padding: 0 0.25rem;
  display: flex;
  align-items: center;
}

.nova-multifile-remove:hover {
  color: #ef4444;
}
</style>
