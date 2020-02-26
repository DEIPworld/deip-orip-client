<template>
  <div class="display-flex flex-column fill-height">
    <div class="display-flex flex-column flex-grow-1 mb-4">
      <div class="step-title">
        Invite members
      </div>
      <div class="flex-grow-1 overflow-y-auto flex-basis-0">
        <div class="mx-auto group-members-max-width">
          <v-text-field
            v-model="q"
            label="Search..."
            single-line
            append-icon="search"
            @input="debounceSearchUsers()"
          />
          <div
            v-for="(user, i) in group.members"
            :key="i + '-picked'"
            class="pt-4 display-flex justify-space-between"
          >
            <div>
              <platform-avatar
                :user="user"
                :size="30"
                link-to-profile
                link-to-profile-class="px-1"
              />
            </div>
            <v-btn
              v-if="user.account.name != creatorUsername"
              text
              color="grey"
              class="ma-0"
              @click="cancelMember(i)"
            >
              Cancel
            </v-btn>
          </div>

          <v-divider v-show="group.members.length > 0" class="mt-4" />

          <div
            v-for="(user, i) in selectableUsers"
            :key="i + '-selectable'"
            class="pt-4 display-flex justify-space-between"
          >
            <div>
              <platform-avatar
                :user="user"
                :size="30"
                link-to-profile
                link-to-profile-class="px-1"
              />
            </div>
            <v-btn
              text
              color="primary"
              class="ma-0"
              @click="inviteMember(user)"
            >
              + Invite
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-grow-0">
      <div class="display-flex justify-center align-center">
        <v-btn text small @click.native="prevStep()">
          <v-icon dark class="pr-1">
            keyboard_arrow_left
          </v-icon>Back
        </v-btn>
        <!-- <v-btn color="primary" @click.native="nextStep()" :disabled="group.members.length === 0">Next</v-btn> -->
        <v-btn
          color="primary"
          :loading="isLoading"
          :disabled="group.members.length === 0 || isLoading"
          @click.native="finish()"
        >
          Create Team
        </v-btn>
      </div>
    </div>
  </div>

</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import _ from 'lodash';
  import { mapGetters } from 'vuex';

  import { UsersService } from '@deip/users-service';

  const usersService = UsersService.getInstance();

  const SELECTABLE_USERS_COUNT = 5;

  const prepareSelectableUsers = (allUsers, pickedUsers, q) => {
    let handler = _(allUsers);

    if (q !== '') {
      handler = handler.filter((user) => _.startsWith(user.account.name.toLowerCase(), q.toLowerCase()));
    }

    return handler
      .take(SELECTABLE_USERS_COUNT + pickedUsers.length)
      .differenceBy(pickedUsers, (item) => item.account.name)
      .take(SELECTABLE_USERS_COUNT)
      .value();
  };

  function recalculateDefaultStakes(creatorUsername, members) {
    const creator = members.find((m) => m.account.name === creatorUsername);
    let totalSum = 0;

    members.forEach((m) => {
      m.stake = Math.floor(100 / members.length);
      totalSum += m.stake;
    });

    if (totalSum < 100) {
      creator.stake += 100 - totalSum;
    }
  }

  export default {
    name: 'CreateResearchGroupMembers',

    props: {
      group: { type: Object, required: true },
      isLoading: { type: Boolean, required: true }
    },
    data() {
      return {
        creatorUsername: "",
        allUsers: [],
        selectableUsers: [],
        q: '',
        selectedUsers: this.group.members
      };
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
      debounceSearchUsers: _.debounce(function () {
        this.selectableUsers = prepareSelectableUsers(
          this.allUsers,
          this.selectedUsers,
          this.q
        );
      }, 600),

      inviteMember(member) {
        this.selectedUsers.push(member);
        recalculateDefaultStakes(this.creatorUsername, this.selectedUsers);
        this.selectableUsers = prepareSelectableUsers(
          this.allUsers,
          this.selectedUsers,
          this.q
        );
      },
      cancelMember(index) {
        this.selectedUsers.splice(index, 1);
        recalculateDefaultStakes(this.creatorUsername, this.selectedUsers);
        this.selectableUsers = prepareSelectableUsers(
          this.allUsers,
          this.selectedUsers,
          this.q
        );
      },
      finish() {
        this.$emit('finish');
      }
    },
    watch: {
      selectedUsers() {
        this.$emit('setGroupMembers', this.selectedUsers);
      }
    },
    mounted() {
      this.creatorUsername = this.user.username;
      // TODO: request server for tenant users
      deipRpc.api.getAllAccountsAsync()
        .then((accounts) => {
          const blackList = [this.creatorUsername, 'regacc', 'hermes', 'initdelegate'];
          const usernames = [];
          usernames.push(this.creatorUsername);
          usernames.push(
            ...accounts
              .filter((a) => !a.is_research_group && !blackList.some(username => username == a.name))
              .map((a) => a.name)
          );
          return usersService.getEnrichedProfiles(usernames);
        })
        .then((users) => {
          users.forEach((u) => {
            u.stake = u.account.name == this.creatorUsername ? 100 : 0;
          });
          this.selectedUsers.push(users[0]); // creator
          this.allUsers = users.slice(1);
          this.selectableUsers = prepareSelectableUsers(
            this.allUsers,
            this.selectedUsers,
            this.q
          );
        });
    }
  };
</script>

<style lang="less" scoped>
.group-members-max-width {
  max-width: 510px;
}
</style>
