<template>
  <d-video-embed
    :src="attribute.value"
  />
</template>

<script>
  import { attributeRead } from '@/components/Attributes/_mixins';
  import DVideoEmbed from '@/components/Deipify/DVideoEmbed/DVideoEmbed';

  export default {
    name: 'AttributesVideoUrlRead',
    components: {
      DVideoEmbed
    },
    mixins: [attributeRead]
  };
</script>
