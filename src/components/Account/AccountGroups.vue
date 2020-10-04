<template>
  <layout-section v-if="$ready">
    <d-block>
      <template #title>
        {{ $t('account.groups.teams') }}
      </template>
      <v-row>
        <v-col v-for="(group, i) in groups.filter((g) => !g.is_personal)" :key="`${i}-group`" cols="4">
          <v-card
            outlined
            class="full-height d-flex"
            :to="{
              name: 'ResearchGroupDetails',
              params: {
                research_group_permlink: encodeURIComponent(group.permlink) }
            }"
          >
            <d-box-item
              :avatar="group.external_id | researchGroupLogoSrc(64, 64)"
              :size="32"
              class="w-100 pa-4"
            >
              <v-clamp
                autoresize
                :max-lines="2"
                class="text-h6"
              >
                {{ group.name }}
              </v-clamp>
              <template #action>
                <v-icon>
                  group
                </v-icon>
              </template>
              <template #actionText>
                <v-clamp
                  autoresize
                  :max-lines="2"
                  class="text-body-2"
                >
                  {{ group.shares.length }}
                </v-clamp>
              </template>
            </d-box-item>
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
