<template>
  <v-row no-gutters justify="center">
    <v-col cols="6">
      <div class="headline text-center mb-3">
        Select Review Committee
      </div>

      <v-card class="py-4 elevation-0">
        <v-autocomplete
          v-model="foa.reveiwCommittee"
          :items="allGroupList"
          :filter="committeesFilter"
          filled
          item-text="name"
          label="Reveiw committee"
          return-object
        />

        <div v-if="foa.reveiwCommittee">
          <div
            v-for="(member, i) in foa.reveiwCommittee.enrichedMembers"
            :key="`${i}-member`"
            class="mt-2"
          >
            <platform-avatar
              :user="member"
              :size="40"
              :link-to-profile="false"
            >
              <span class="pl-2">{{ member | fullname }}</span>
            </platform-avatar>
          </div>
        </div>
      </v-card>

      <div class="text-center py-4">
        <v-btn text small @click.native="prevStep()">
          <v-icon dark class="pr-1">
            keyboard_arrow_left
          </v-icon>
          Back
        </v-btn>
        <v-btn color="primary" :disabled="isNextDisabled()" @click.native="nextStep()">
          Next
        </v-btn>
      </div>
      
    </v-col>
  </v-row>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';
  import { UsersService } from '@deip/users-service';

  const usersService = UsersService.getInstance();

  export default {
    name: 'FundingOpportunityReviewCommittee',

    props: {
      foa: { type: Object, required: true }
    },
    data() {
      return {
        allGroupList: []
      };
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        userGroups: 'auth/userGroups'
      })
    },
    created() {
      this.getReviewCommittes(["c8657fa6cbaee3917ac4e2ed6ada9d0a55a15ac5"]);
    },
    methods: {
      nextStep() {
        this.$emit('incStep');
      },
      prevStep() {
        this.$emit('decStep');
      },
      committeesFilter(item, queryText, itemText) {
        if (item && item.is_personal) {
          return false;
        }
        const hasValue = (val) => (val != null ? val : 'review');
        const text = hasValue(item.name);
        const query = hasValue(queryText);

        return text.toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1;
      },
      isNextDisabled() {
        return this.foa.reveiwCommittee == null;
      },
      getReviewCommittes(ids) {
        deipRpc.api.getResearchGroupsAsync(ids)
          .then((researchGroups) => {
            this.allGroupList = researchGroups;
            Promise.all(researchGroups.map(({ id }) => deipRpc.api.getResearchGroupTokensByResearchGroupAsync(id)))
              .then((researchGroupTokens) => {
                Promise.all(researchGroupTokens.map((item) => usersService.getEnrichedProfiles(item.map(({ owner }) => owner))))
                  .then((membersLists) => this.allGroupList.forEach((g, i) => {
                    g.enrichedMembers = membersLists[i];
                  }));
              });
          });
      }
    }
  };
</script>

<style lang="less" scoped>
  .review-comitee-max-width {
    max-width: 800px;
  }
</style>
