<template>
  <div v-if="teamsList.length">
    <div class="d-flex">
      <div class="text-h5">
        {{ $t('userDetailRouting.teams') }}
        <v-badge offset-y="-8" offset-x="4" :content="teamsList.length || '0'" />
      </div>
      <v-spacer v-if="isOwner" />
      <div v-if="isOwner">
        <v-btn
          class="ma-0"
          outlined
          small
          color="primary"
          :to="{ name: 'CreateResearchGroup', params: {account_name: $currentUser.username} }"
        >
          {{ $t('userDetailRouting.addGroup') }}
          <v-icon small>
            add
          </v-icon>
        </v-btn>
      </div>
    </div>
    <v-row class="mt-2">
      <v-col v-for="(team, i) in teamsList" :key="`${i}-team`" cols="4">
        <v-card
          outlined
          class="full-height d-flex"
          :to="{
            name: 'team.details',
            params: {
              teamId: team.externalId }
          }"
        >
          <d-box-item
            :avatar="team.externalId | researchGroupLogoSrc(64, 64)"
            :size="32"
            class="w-100 pa-4"
          >
            <v-clamp
              autoresize
              :max-lines="2"
              class="text-h6"
            >
              {{ team | accountFullname }}
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
                {{ team.researchGroupRef.members.length }}
              </v-clamp>
            </template>
          </d-box-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';

  export default {
    name: 'TeamsList',
    components: {
      DBoxItem
    },
    props: {
      common: {
        type: Boolean,
        default: true
      },
      teams: {
        type: Array,
        default: () => []
      },
      username: {
        type: String,
        default: 'undefined'
      }
    },
    computed: {
      teamsList() {
        const teams = this.teams.length
          ? this.teams
          : this.$store.getters['Teams/list']({ researchGroupRef: { members: (m) => m.includes(this.username) } });
        if (this.common) {
          return teams.filter((t) => !t.isPersonal);
        }

        return teams;
      },
      isOwner() {
        return this.$currentUser.username === this.username;
      }
    },
    created() {
      if (!this.teams.length) {
        this.$store.dispatch('Teams/getUserTeams', this.username);
      }
    }
  };
</script>
