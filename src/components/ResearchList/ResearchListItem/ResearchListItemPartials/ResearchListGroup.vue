<template>
  <d-avatared
    :src="group.external_id | researchGroupLogoSrc(32 * 2, 32 * 2)"
    :size="32"
    :tooltip="group.name"
  >
    <v-clamp
      autoresize
      :max-lines="2"
      class="text-caption"
    >
      {{ group.name }}
    </v-clamp>
  </d-avatared>
</template>

<script>
  import DAvatared from '@/components/Deipify/DAvatared/DAvatared';

  export default {
    name: 'ResearchListGroup',
    components: { DAvatared },
    props: {
      group: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>
