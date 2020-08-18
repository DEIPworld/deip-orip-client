<template>
  <layout-section v-if="$ready">
    <div class="pb-4 display-flex">
      <div>
        <platform-avatar :user="userInfo" :size="80" />
      </div>
      <div class="ml-6">
        <div class="text-h5">
          {{ userInfo | fullname }}
        </div>
        <div v-if="$options.filters.userLocation(userInfo)">
          <v-icon small>
            location_on
          </v-icon>
          {{ userInfo | userLocation }}
        </div>
        <div v-if="$options.filters.employmentOrEducation(userInfo)">
          <v-icon small>
            school
          </v-icon>
          {{ userInfo | employmentOrEducation }}
        </div>
      </div>
    </div>

    <v-divider class="mt-4 mb-8" />

    <eci-history-and-stats
      :account-name="userInfo.account.name"
      :filter-disciplines="disciplines"
    />
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';

  import LayoutSection from '@/components/layout/components/LayoutSection';
  import EciHistoryAndStats from '@/components/EciMetrics/EciHistoryAndStats';

  export default {
    name: 'UserExpertiseDetails',
    components: { EciHistoryAndStats, LayoutSection },
    props: {
      username: {
        type: String,
        default: undefined
      }
    },

    data() {
      return {
        disciplines: [],
      };
    },

    computed: {
      ...mapGetters({
        userInfo: 'userDetails/userInfo',
        expertise: 'userDetails/expertise'
      })
    },

    created() {
      this.$store.dispatch('userDetails/loadAccountExpertiseDetailsPage', {
        username: this.username
      })
        .then(() => {
          this.disciplines.push(...this.expertise.map((exp) => ({
            label: exp.discipline_name,
            id: exp.discipline_external_id
          })));

          this.$setReady();
        });
    }
  };
</script>
