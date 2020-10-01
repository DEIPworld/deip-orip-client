<template>
  <d-wysiwyg
    v-model="internalValue"
    :label="attribute.title"
  />
</template>

<script>
  import { attributeSet } from '@/components/Attributes/mixins';
  import DWysiwyg from '@/components/Deipify/DWysiwyg/DWysiwyg';

  export default {
    name: 'AttributesTextareaSet',
    components: { DWysiwyg },
    mixins: [attributeSet]
  };
</script>
