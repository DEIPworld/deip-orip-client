<template>
  <div class="display-flex flex-column full-height">
    <div class="display-flex flex-column flex-grow-1 mb-4">
      <div class="step-title">
        Select Review Committee
      </div>
      <div class="flex-grow-1 overflow-y-auto flex-basis-0">
        <div class="mx-auto review-comitee-max-width">
          <v-card class="px-12 py-6 elevation-0">
            <v-autocomplete
              v-model="foa.reveiwCommittee"
              :items="allGroupList"
              :filter="committeesFilter"
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
        </div>
      </div>
    </div>
    <div class="flex-grow-0">
      <div class="display-flex justify-center align-center">
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
    </div>
  </div>
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
      this.getReviewCommittes([23]);
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
      getReviewCommittes(idsArray) {
        Promise.all(idsArray.map((id) => deipRpc.api.getResearchGroupByIdAsync(id)))
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
