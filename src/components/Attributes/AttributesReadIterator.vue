<template>
  <d-stack :gap="gap">
    <attributes-read
      v-for="(attribute, index) in attributes"
      :key="`${index}-attr`"
      :value="attribute.value"
      :attribute-id="attribute.researchAttributeId"
    />
  </d-stack>
</template>

<script>
  import AttributesRead from '@/components/Attributes/AttributesRead';
  import DStack from '@/components/Deipify/DStack/DStack';

  export default {
    name: 'AttributesReadIterator',
    components: { DStack, AttributesRead },
    props: {
      attributes: {
        type: Array,
        default: () => ([])
      },
      gap: {
        type: [Number, String],
        default: 24
      }
    }
  };
</script>
