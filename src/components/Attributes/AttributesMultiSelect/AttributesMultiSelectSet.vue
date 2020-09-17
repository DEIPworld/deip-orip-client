<template>
  <d-input-multiselect
    v-model="internalValue"
    :label="internalAttribute.title"
    :items="internalAttribute.valueOptions"
  />
</template>

<script>
  import { commonSet } from '@/components/Attributes/mixins';
  import DInputMultiselect from '@/components/Deipify/DInput/DInputMultiselect';

  export default {
    name: 'AttributesMultiSelectSet',
    components: { DInputMultiselect },
    mixins: [commonSet]
  };
</script>
