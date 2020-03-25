<template>
  <v-layout column full-height>
    <v-flex display-flex flex-column flex-grow-1 mb-3>
      <div class="step-title">Select Review Committee</div>
      <div class="flex-grow-1 overflow-y-auto flex-basis-0">
        <div class="mx-auto review-comitee-max-width">
          <v-card class="px-5 py-4">
            <v-layout row align-center>
              <v-flex xs12>
                <v-autocomplete
                  :items="allGroupList"
                  :filter="committeesFilter"
                  v-model="foa.reveiwCommittee"
                  item-text="name"
                  label="Reveiw committee"
                  return-object
                ></v-autocomplete>
              </v-flex>
            </v-layout>

            <div v-if="foa.reveiwCommittee">
              <v-layout row align-center mt-2
                   v-for="(member, i) in foa.reveiwCommittee.enrichedMembers" :key="`${i}-member`">
                <platform-avatar
                  :user="member"
                  :size="40"
                  link-to-profile
                  link-to-profile-class="px-1"
                ></platform-avatar>
              </v-layout >
            </div>
          </v-card>
        </div>
      </div>
    </v-flex>
    <v-flex flex-grow-0>
      <v-layout row justify-center align-center>
        <v-btn flat small @click.native="prevStep()">
          <v-icon dark class="pr-1">keyboard_arrow_left</v-icon>
          Back
        </v-btn>
        <v-btn color="primary" @click.native="nextStep()" :disabled="isNextDisabled()">Next</v-btn>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';
  import { UsersService } from '@deip/users-service';

  const usersService = UsersService.getInstance();

  export default {
    name: 'FundingOpportunityReviewCommittee',

    props: {
      foa: {type: Object, required: true}
    },
    data() {
      return {
        allGroupList: []
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        userGroups: 'auth/userGroups'
      })
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
        const hasValue = val => val != null ? val : 'review';
        const text = hasValue(item.name);
        const query = hasValue(queryText);

        return text.toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) > -1;
      },
      isNextDisabled() {
        return this.foa.reveiwCommittee == null;
      },
      getReviewCommittes(idsArray){
        Promise.all(idsArray.map(id => deipRpc.api.getResearchGroupByIdAsync(id)))
        .then(researchGroups => {
          this.allGroupList = researchGroups
          Promise.all(researchGroups.map(({id}) => deipRpc.api.getResearchGroupTokensByResearchGroupAsync(id)))
            .then(researchGroupTokens => {
              Promise.all(researchGroupTokens.map(item => usersService.getEnrichedProfiles(item.map(({owner}) =>  owner))))
              .then(membersLists => this.allGroupList.forEach((g, i) => {
                  g.enrichedMembers = membersLists[i]
              }))
            })
        })
      }
    },
    created() {
      this.getReviewCommittes([23])
    }
  };
</script>

<style lang="less" scoped>
  .review-comitee-max-width {
    max-width: 800px;
  }
</style>
