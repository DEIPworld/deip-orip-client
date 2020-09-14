<template>
  <d-layout v-if="research">
    <d-layout-header>
      <v-sheet :max-width="800">
        <div class="text-h4">
          {{ research.title }}
        </div>
        <div class="pt-2">
          <v-icon small>
            today
          </v-icon>
          Created {{ research.created_at | dateFormat('D MMM YYYY', true) }}
        </div>
      </v-sheet>
    </d-layout-header>
    <d-layout-section-main>
      <eci-history-and-stats
        :research-id="research.external_id"
      />
    </d-layout-section-main>
  </d-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import EciHistoryAndStats from '@/components/EciMetrics/EciHistoryAndStats';
  import DLayout from '@/components/Deipify/DLayout/DLayout';
  import DLayoutHeader from '@/components/Deipify/DLayout/DLayoutHeader';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';

  export default {
    name: 'ResearchExpertise',
    components: { DLayoutSectionMain, DLayoutHeader, DLayout, EciHistoryAndStats, LayoutSection },
    props: {
      researchId: {
        type: String,
        default: null
      }
    },
    computed: {
      ...mapGetters({
        research: 'Research/data'
      })
    }
  };
</script>
