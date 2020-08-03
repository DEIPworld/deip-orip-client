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

    <eci-metrics
      :disciplines="disciplines"
      :account-name="userInfo.account.name"
      filter-position="top"
      enable-stats
    >
      <!-- <template #historyTitleAddon>
        <router-link
          class="a mx-0 mr-12 pr-4"
          color="primary"
          outlined
          :to="{ name: 'ReviewSetup' }"
        >
          Alternative review model
        </router-link>
      </template> -->
    </eci-metrics>
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';

  import EciMetrics from '@/components/EciMetrics/EciMetrics';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'UserExpertiseDetails',
    components: { LayoutSection, EciMetrics },
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
