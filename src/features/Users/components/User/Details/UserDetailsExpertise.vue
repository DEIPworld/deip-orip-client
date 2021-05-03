<template>
  <layout-section>
    <div class="pb-4 display-flex">
      <div>
        <platform-avatar :user="user" :size="80" />
      </div>
      <div class="ml-6">
        <div class="text-h5">
          {{ user | fullname }}
        </div>
        <div v-if="$options.filters.userLocation(user)">
          <v-icon small>
            location_on
          </v-icon>
          {{ user | userLocation }}
        </div>
        <div v-if="$options.filters.employmentOrEducation(user)">
          <v-icon small>
            school
          </v-icon>
          {{ user | employmentOrEducation }}
        </div>
      </div>
    </div>

    <v-divider class="mt-4 mb-8" />

    <eci-history-and-stats
      v-if="$hasModule(DEIP_MODULE.APP_ECI)"
      :account-name="user.account.name"
      :filter-disciplines="user.disciplines"
    />
  </layout-section>
</template>

<script>
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import EciHistoryAndStats from '@/components/EciMetrics/EciHistoryAndStats';

  export default {
    name: 'UserDetailsExpertise',
    components: { EciHistoryAndStats, LayoutSection },

    computed: {
      user() {
        const user = this.$route.params.account_name ? this.$store.getters['Users/one'](this.$route.params.account_name) : this.$currentUser;

        return {
          ...user,
          disciplines: user.expertise.map((e) => ({
            name: e.disciplineName, externalId: e.disciplineExternalId
          }))
        };
      }
    },
  };
</script>
