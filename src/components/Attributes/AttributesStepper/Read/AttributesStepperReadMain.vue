<template>
  <div>{{$options.name}}</div>
</template>

<script>
  import { attributeReadOption } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesStepperReadMain',
    mixins: [attributeReadOption]
  };
</script>
