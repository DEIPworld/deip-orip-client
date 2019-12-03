<template>
    <v-layout fill-height column>
      <v-flex mb4 flex-grow-1 flex-column>
        <div class="step-title">Select research group</div>
        
        <div class="flex-grow-1">
          <div class="overflow-y-auto mx-auto pt-3 research-pick-group">
            <div
              v-for="(group, i) in groups"
              :class="{'selected-group': research.group && group.id == research.group.id, 'personal-group': group.is_personal }"
              @click="setGroup(group)"
              class="group-line  pa-3 mt-1"
              :key="'pick-group '+ i"
            >
              <div
                v-if="group.is_personal"
                class="group-nameplate pr-2"
              >{{ user | fullname}} 's personal group</div>
              <div v-if="!group.is_personal" class="group-nameplate pr-2">{{group.name}}</div>
              <div class>{{ getGroupCoworkers(group).join(' · ') }}</div>
            </div>

            <div class="pt-4 pl-3">
              <router-link
                class="app-title"
                :to="{ name: 'CreateResearchGroup',
                                  params: { 'account_name': user.username },
                                  query: { 'back-token': getReturningToken }
                              }"
              >
                <span class="deip-label">+ Add new group</span>
              </router-link>
            </div>
          </div>
        </div>
      </v-flex>

      <v-flex flex-grow-0>
        <v-layout row wrap justify-center align-center>
          <v-btn flat small @click.native="prevStep()">
            <v-icon dark class="pr-1">keyboard_arrow_left</v-icon>Back
          </v-btn>

          <v-btn color="primary" :disabled="nextDisabled" @click.native="nextStep()">Next</v-btn>
        </v-layout>
      </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CreateResearchPickGroup",
  props: {
    research: { type: Object, required: true }
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
      userGroups: "auth/userGroups",
      userCoworkers: "auth/userCoworkers"
    }),

    groups() {
      return this.userGroups.slice().sort(g => (g.is_personal ? -1 : 1));
    },

    nextDisabled() {
      return !this.research.group;
    },

    getReturningToken() {
      const token = {
        name: "CreateResearch",
        query: { disciplineIds: this.research.disciplines.map(item => item.id) }
      };

      return JSON.stringify(token);
    }
  },
  methods: {
    nextStep() {
      this.$emit("incStep");
    },
    prevStep() {
      this.$emit("decStep");
    },
    setGroup(group) {
      this.$emit("setGroup", group);
    },
    getGroupCoworkers(group) {
      return this.userCoworkers
        .filter(c => c.rgt.research_group_id == group.id)
        .map(c => this.$options.filters.fullname(c));
    }
  },
};
</script>

<style lang="less" scoped>
.group-line {
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  cursor: pointer;
  &:hover {
    border-color: #2f80ed;
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
.research-pick-group{
max-width: 800px;
max-height: 600px;
}
</style>
