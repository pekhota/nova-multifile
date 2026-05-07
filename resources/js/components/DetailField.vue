<template>
  <PanelItem :index="index" :field="field">
    <template #value>
      <span>{{ field.value }}</span>
    </template>
  </PanelItem>
</template>

<script>
export default {
  props: ['index', 'resource', 'resourceName', 'resourceId', 'field'],
}
</script>
