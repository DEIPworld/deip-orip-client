<template>
  <v-row no-gutters justify="center">
    <v-col cols="6">
      <div class="text-h5 text-center mb-3">
        Select Program Officers
      </div>

      <v-card class="py-4 elevation-0">
        <v-text-field
          label="Start typing for suggestion"
          outlined
          append-icon="search"
        />

        <div v-for="(member, i) in members" :key="`${i}-member`" class="display-flex align-center mt-2">
          <platform-avatar
            :user="member"
            :size="40"
            :link-to-profile="false"
          >
            <span class="pl-2">{{ member | fullname }}</span>
          </platform-avatar>
          <div class="pl-6">
            <input
              id="checkbox"
              type="checkbox"
              :disabled="isGrantProgramOfficer(member)"
              :checked="isSelected(member)"
              @input="setOpportunityOfficer($event, member)"
            >
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
  import { mapGetters } from 'vuex';
  import _ from 'lodash';

  import { UsersService } from '@deip/users-service';

  const usersService = UsersService.getInstance();

  export default {
    name: 'FundingOpportunityProgramOfficers',

    props: {
      foa: { type: Object, required: true },
      members: { type: Array }
    },

    data() {
      return {};
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
        return this.foa.officers.some((a) => a == member.account.name);
      },
      setOpportunityOfficer($event, member) {
        event.preventDefault();
        event.stopPropagation();
        const { checked } = event.target;
        this.foa.officers = checked
          ? [...this.foa.officers, member.account.name]
          : this.foa.officers.filter((a) => a !== member.account.name);
      },
      isNextDisabled() {
        return false;
      },
      isGrantProgramOfficer(member) {
        return member.account.name == this.user.account.name;
      }
    }
  };
</script>

<style lang="less" scoped>
  .program-officers-max-width {
    max-width: 800px;
  }
</style>
