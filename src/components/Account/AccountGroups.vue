<template>
  <layout-section v-if="$ready">
    <d-block>
      <template #title>
        Teams
      </template>
      <v-row>
        <v-col v-for="(group, i) in groups.filter((g) => !g.is_personal)" :key="`${i}-group`" cols="4">
          <v-card
            outlined
            :to="{
              name: 'ResearchGroupDetails',
              params: {
                research_group_permlink: encodeURIComponent(group.permlink) }
            }"
          >
            <div class="pa-4">
              <d-box-item
                :avatar="group.external_id | researchGroupLogoSrc(32, 32)"
                :size="32"
                :title="group.name"
              >
                <template #action>
                  <v-icon>
                    group
                  </v-icon>
                </template>
                <template #actionText>
                  <div class="text-body-2">
                    {{ group.shares.length }}
                  </div>
                </template>

              </d-box-item>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </d-block>
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';


  export default {
    name: 'AccountGroups',
    components: { LayoutSection, DBlock, DBoxItem },
    computed: {
      ...mapGetters({
        groups: 'userDetails/groups'
      })
    },
    created() {
      const username = decodeURIComponent(this.$store.getters['auth/user'].account.name);
      this.$store.dispatch('userDetails/loadUserDetailsPage', { username })
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
