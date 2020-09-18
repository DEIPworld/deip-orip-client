<template>
  <div>
    <v-clamp v-if="viewType === 'card'" autoresize :max-lines="4" class="text-body-2">
      {{ internalValue }}
    </v-clamp>
    <d-block v-else :title="internalAttribute.title">
      <div class="text-body-2">
        {{ internalValue }}
      </div>
    </d-block>
  </div>
</template>

<script>
  import AttributesCommonRead from '@/components/Attributes/_partials/Read/AttributesCommonRead';
  import DBlock from '@/components/Deipify/DBlock/DBlock';

  export default {
    name: 'AttributesTextareaRead',
    components: { DBlock },
    mixins: [AttributesCommonRead]
  };
</script>
