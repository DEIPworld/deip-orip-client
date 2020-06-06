<template>
  <v-row no-gutters justify="center">
    <v-col cols="6">

      <div class="headline text-center mb-3">
        Select research group
      </div>

      <v-card outlined class="py-2">
        <v-list nav>
          <v-list-item
            v-for="(group, i) in groups"
            :key="'pick-group '+ i"
            :input-value="research.group && group.id == research.group.id"
            @click="setGroup(group)"
          >
            <div v-if="group.is_personal" class="group-nameplate pr-2">
              {{ user | fullname }} 's personal group
            </div>
            <div v-else class="group-nameplate pr-2">
              {{ group.name }}
            </div>
            <div>{{ getGroupCoworkers(group).join(' · ') }}</div>
          </v-list-item>
          <v-list-item class="mt-6">
            <v-btn
              outlined
              color="primary"
              :to="{ name: 'CreateResearchGroup',
                     params: { 'account_name': user.username },
                     query: { 'back-token': getReturningToken }
              }"
            >
              + Add new group
            </v-btn>
          </v-list-item>
        </v-list>
      </v-card>

      <div class="text-center py-4">
        <v-btn text @click.native="prevStep()">
          <v-icon dark class="pr-1">
            keyboard_arrow_left
          </v-icon>
          Back
        </v-btn>
        <v-btn color="primary" :disabled="nextDisabled" @click.native="nextStep()">
          Next
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'CreateResearchPickGroup',
    props: {
      research: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        userGroups: 'auth/userGroups',
        userCoworkers: 'auth/userCoworkers'
      }),

      groups() {
        return this.userGroups.slice()
          .sort((g) => (g.is_personal ? -1 : 1));
      },

      nextDisabled() {
        return !this.research.group;
      },

      getReturningToken() {
        const token = {
          name: 'CreateResearch',
          query: { disciplineIds: this.research.disciplines.map((item) => item.id) }
        };

        return JSON.stringify(token);
      }
    },
    methods: {
      nextStep() {
        this.$emit('incStep');
      },
      prevStep() {
        this.$emit('decStep');
      },
      setGroup(group) {
        this.$emit('setGroup', group);
      },
      getGroupCoworkers(group) {
        return this.userCoworkers
          .filter((c) => c.rgt.research_group_id == group.id)
          .map((c) => this.$options.filters.fullname(c));
      }
    }
  };
</script>

<style lang="less" scoped>
  .group-line {
    border: 1px solid #e0e0e0;
    border-radius: 2px;
    cursor: pointer;

    &:hover {
      border-color: var(--v-primary-base);
    }
  }

  .group-nameplate {
    font-weight: bold;
    font-size: 16px;
    flex: 0 0 250px;
  }

  .selected-group {
    background-color: #eaeaea;
  }

  .personal-group {
    margin-bottom: 20px;
  }

  .research-pick-group {
    max-width: 800px;
    max-height: 600px;
  }
</style>
