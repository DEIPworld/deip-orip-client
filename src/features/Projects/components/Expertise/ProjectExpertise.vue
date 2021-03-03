<template>
  <d-layout v-if="research">
    <d-layout-section>
      <d-layout-section-main>
        <v-sheet :max-width="800">
          <div class="text-h4">
            {{ research.title }}
          </div>
          <div class="pt-2">
            <v-icon small>
              today
            </v-icon>
            Created {{ research.researchRef.created_at | dateFormat('D MMM YYYY', true) }}
          </div>
        </v-sheet>
      </d-layout-section-main>
    </d-layout-section>
    <v-divider />
    <d-layout-section>
      <d-layout-section-main>
        <eci-history-and-stats
          :research-id="research.externalId"
        />
      </d-layout-section-main>
    </d-layout-section>
  </d-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import EciHistoryAndStats from '@/components/EciMetrics/EciHistoryAndStats';
  import DLayout from '@/components/Deipify/DLayout/DLayout';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';

  export default {
    name: 'ProjectExpertise',
    components: {
      DLayoutSection, DLayoutSectionMain, DLayout, EciHistoryAndStats
    },
    props: {
      researchId: {
        type: String,
        default: null
      }
    },
    computed: {
      ...mapGetters({
        research: 'Project/projectDetails'
      })
    }
  };
</script>
