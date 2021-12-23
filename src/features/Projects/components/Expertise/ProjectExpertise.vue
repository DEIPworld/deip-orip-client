<template>
  <d-layout v-if="project">
    <d-layout-section>
      <d-layout-section-main>
        <v-sheet :max-width="800">
          <div class="text-h4">
            {{ project.title }}
          </div>
          <div class="pt-2">
            <v-icon small>
              today
            </v-icon>
            Created {{ project.createdAt | dateFormat('D MMM YYYY', true) }}
          </div>
        </v-sheet>
      </d-layout-section-main>
    </d-layout-section>
    <v-divider />
    <d-layout-section>
      <d-layout-section-main>
        <eci-history-and-stats
          :project-id="project._id"
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
      projectId: {
        type: String,
        default: null
      }
    },
    computed: {
      ...mapGetters({
        project: 'Project/projectDetails'
      })
    }
  };
</script>
