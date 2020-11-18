<template>
  <v-clamp :max-lines="maxLines" :autoresize="true">
    <slot />

    <template #after="{ clamped, toggle, expanded }">
      <a
        v-if="clamped || expanded"
        class="link"
        @click="toggle"
      >
        Read {{ expanded ? 'less' : 'more' }}
      </a>
    </template>
  </v-clamp>
</template>

<script>
  export default {
    name: 'DTruncateMore',
    props: {
      maxLines: {
        type: Number,
        default: 3
      }
    }
  };
</script>
