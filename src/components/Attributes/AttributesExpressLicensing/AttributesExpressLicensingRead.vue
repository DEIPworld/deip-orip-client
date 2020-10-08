<template>
  <div>
    <pre>{{ JSON.stringify(attribute.value ,null, 2) }}</pre>
  </div>
</template>

<script>
  import { attributeRead } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesExpressLicensingRead',
    mixins: [attributeRead]
  };
</script>
