<template>
  <div>
    {{ moment(attribute.value).format('D MMM YYYY') }}
  </div>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/_mixins';

  export default {
    name: 'AttributesDateRead',
    mixins: [attributeRead]
  };
</script>
