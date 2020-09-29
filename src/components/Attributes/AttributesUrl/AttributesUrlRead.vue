<template>
  <d-stack gap="4">
    <div
      v-for="(item, index) of attribute.value"
      :key="index"
    >
      <a :href="item.url" class="text--secondary text-caption">{{ item.label }}</a>
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
