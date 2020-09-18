<template>
  <d-layout-header
    v-if="Object.keys(research).length"
    :background="research.external_id | researchBackgroundSrc"
  >
    <div class="d-flex justify-space-between">
      <d-stack :max-width="800" color="transparent">


        <attributes-read-iterator
          :attributes="research.researchRef.attributes"
          area="researchDetailsHeader"
          :gap="16"
        />

        <d-meta-item icon="today">
          Created {{ research.created_at | dateFormat('D MMM YYYY', true) }}
        </d-meta-item>

        <v-btn
          v-if="research.members.includes($currentUserName)"
          class="mt-4"
          small
          outlined
          color="white"
          :to="{
            name: 'research.edit',
            params: {
              researchExternalId: research.external_id,
            }
          }"
        >
          Edit
        </v-btn>
      </d-stack>

      <iframe
        v-if="research.researchRef.videoSrc"
        class="presentation-video"
        :src="getEmbedVideoUrl(researchRef.videoSrc)"
        allowfullscreen
      />
    </div>
  </d-layout-header>
</template>

<script>
  import DLayoutHeader from '@/components/Deipify/DLayout/DLayoutHeader';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';
  import DTruncateMore from '@/components/Deipify/DTruncateMore/DTruncateMore';
  import AttributesReadIterator from '@/components/Attributes/AttributesReadIterator';

  export default {
    name: 'ResearchDetailsHeaderTemp',

    components: {
      AttributesReadIterator,
      DStack,
      DTruncateMore,
      DLayoutHeader,
      DMetaItem
    },

    props: {
      research: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>
