<template>
  <div>
    <v-clamp v-if="viewType === 'card'" autoresize :max-lines="4" class="text-body-2">
      {{ internalValue }}
    </v-clamp>
    <div v-else class="text-body-2">
      {{ internalValue }}
    </div>
  </div>
</template>

<script>
  import AttributesCommonRead from '@/components/Attributes/_partials/Read/AttributesCommonRead';

  export default {
    name: 'AttributesTextareaRead',
    mixins: [AttributesCommonRead]
  };
</script>
