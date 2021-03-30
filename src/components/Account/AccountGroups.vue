<template>
  <layout-section v-if="$ready">
    <d-block :title="$t('account.groups.teams')">
      <!-- <template #title-append>
        <v-btn
          color="primary"
          small
          :to="{
            name: 'CreateResearchGroup',
            params: {
              account_name: $currentUser.username
            }
          }"
          outlined
        >
          {{ $t('account.groups.addNewTeam') }}
        </v-btn>
      </template> -->
      <v-row>
        <v-col v-for="(group, i) in groups.filter((g) => !g.is_personal)" :key="`${i}-group`" cols="4">
          <v-card
            outlined
            class="full-height d-flex"
            :to="{
              name: 'teamDetails',
              params: {
                teamId: group.external_id }
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
                  {{ group.researchGroupRef.members.length }}
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
      this.$store.dispatch(
        'userDetails/loadUserDetailsPage',
        { username: this.$currentUser.username }
      )
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
