<template>
  <d-stack gap="4">
    <div
      v-for="(item, index) of attribute.value"
      :key="index"
    >
      <template v-if="item.url">
        <a :href="item.url" target="_blank" class="text--secondary text-caption">{{ item.label || item.url }}</a>
      </template>

      <template v-if="!item.url">
        <span class="text--secondary text-caption">{{ item.label }}</span>
      </template>

    </div>
  </d-stack>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/mixins';
  import DStack from '@/components/Deipify/DStack/DStack';

  export default {
    name: 'AttributesUrlRead',
    components: { DStack },
    mixins: [attributeRead]
  };
</script>
