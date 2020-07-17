<template>
  <div class="d-flex">
    <d-meta-item v-for="(item, index) of list" :key="index" :meta="item" />
  </div>
</template>

<script>
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';

  export default {
    name: 'DMetaList',
    components: { DMetaItem },
    props: {
      list: {
        type: Array,
        default: () => ([])
      }
    }
  };
</script>
