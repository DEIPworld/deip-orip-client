<template>
  <v-layout column full-height>
    <v-flex display-flex flex-column flex-grow-1 mb-3>
      <div class="step-title">Select Program Officers</div>

      <div class="flex-grow-1 overflow-y-auto flex-basis-0">

        <div class="mx-auto program-officers-max-width">
          <v-card class="px-5 py-4">
            <v-text-field
              label="Start typing for suggestion"
              append-icon="search"
            ></v-text-field>

            <!--    <v-radio-group>
                    <div class="legacy-row">
                        <div class="width-8">
                            <v-radio
                                label="By name"
                                value="by-name"
                            ></v-radio>
                        </div>

                        <div class="width-8">
                            <v-radio
                                label="By keywords"
                                value="by-keywords"
                            ></v-radio>
                        </div>
                    </div>
                </v-radio-group> -->

            <div>
              <v-layout row align-center mt-2 v-for="(member, i) in members"
                   :key="`${i}-member`">
                <platform-avatar
                  :user="member"
                  :size="40"
                  link-to-profile
                  link-to-profile-class="px-1"
                ></platform-avatar>
                <div>
                  <input id="checkbox"
                         type="checkbox"
                         :disabled="isGrantor(member)"
                         :checked="isSelected(member)"
                         v-on:input="setOpportunityOfficer($event, member)"/>
                </div>
              </v-layout>
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
  import _ from 'lodash';

  import { UsersService } from '@deip/users-service';

  const usersService = UsersService.getInstance();

  export default {
    name: 'FundingOpportunityProgramOfficers',

    props: {
      foa: {type: Object, required: true},
      members: {type: Array}
    },

    data() {
      return {}
    },
    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    methods: {
      nextStep() {
        this.$emit('incStep');
      },
      prevStep() {
        this.$emit('decStep');
      },

      isSelected(member) {
        return this.foa.officers.some(a => a == member.account.name);
      },
      setOpportunityOfficer($event, member) {
        event.preventDefault();
        event.stopPropagation();
        const checked = event.target.checked;
        this.foa.officers = checked
          ? [...this.foa.officers, member.account.name]
          : this.foa.officers.filter(a => a !== member.account.name);
      },
      isNextDisabled() {
        return false;
      },
      isGrantor(member){
        return member.account.name == this.user.account.name
      }
    }
  };
</script>

<style lang="less" scoped>
  .program-officers-max-width {
    max-width: 800px;
  }
</style>
