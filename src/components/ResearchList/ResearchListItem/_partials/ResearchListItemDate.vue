<template>
  <d-meta-item
    icon="event"
    :label="moment(date).format('D MMM YYYY')"
  />
</template>

<script>

  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';

  export default {
    name: 'ResearchListItemTitle',
    components: { DMetaItem },
    props: {
      date: {
        type: String,
        default: null
      }
    }
  };
</script>
