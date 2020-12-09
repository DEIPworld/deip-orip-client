<template>
  <d-layout>
    <d-layout-section>
      <d-layout-section-main>
        <v-sheet :max-width="800">
          <div class="text-h4">
            {{ content.title }}
          </div>
          <div class="pt-2">
            <v-icon small>
              today
            </v-icon>
            Created {{ content.createdAt | dateFormat('D MMM YYYY', true) }}
          </div>
        </v-sheet>
      </d-layout-section-main>
    </d-layout-section>
    <v-divider />
    <d-layout-section>
      <d-layout-section-main>
        <eci-history-and-stats
          :content-id="content.externalId"
        />
      </d-layout-section-main>
    </d-layout-section>
  </d-layout>
</template>

<script>
  import DLayout from '@/components/Deipify/DLayout/DLayout';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import { mapGetters } from 'vuex';
  import EciHistoryAndStats from '@/components/EciMetrics/EciHistoryAndStats';

  export default {
    name: 'ContentExpertise',
    components: { EciHistoryAndStats, DLayoutSectionMain, DLayoutSection, DLayout },
    computed: {
      ...mapGetters({
        content: 'Content/contentDetails'
      }),
    }
  };
</script>
