<template>
  <layout-section v-if="$ready">
    <d-block>
      <template #title>
        Teams
      </template>
      <v-row>
        <v-col v-for="(group, i) in groups" :key="`${i}-group`" cols="4">
          <v-card
            outlined
            class="full-height d-flex"
            :to="{
              name: 'ResearchGroupDetails',
              params: {
                research_group_permlink: encodeURIComponent(group.permlink) }
            }"
          >
            <div class="py-4 px-6 ma-auto text-body-2 flex-grow-1 d-flex justify-space-between">
              <d-avatared
                :src="group.external_id | researchGroupLogoSrc(32, 32)"
                :size="32"
              >
                <div class="text-body-2">
                  {{ group.name }}
                </div>
              </d-avatared>
              <div class="flex-shrink-0 align-self-center">
                <v-icon>
                  group
                </v-icon>
                {{ group.shares.length }}
              </div>
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
  import DAvatared from '@/components/Deipify/DAvatared/DAvatared';


  export default {
    name: 'AccountGroups',
    components: { LayoutSection, DBlock, DAvatared },
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
