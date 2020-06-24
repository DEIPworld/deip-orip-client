<template>
  <v-form ref="form" @submit="onSubmit">
    <d-form-block title="Group name">
      <v-col cols="12">
        <v-text-field
          v-model="formData.name"
          filled
          name="title"
          label="Title"
          @change="permlinkVerifyed($event)"
          hint="Name of your group"
          :error-messages="isPermlinkVerifyed === false ? 'Group with the same name already exists' : ''"
          :rules="[rules.required]"
        />
      </v-col>
    </d-form-block>

    <d-form-block title="Group description">
      <v-col cols="12">
        <v-textarea
          v-model="formData.description"
          name="Description"
          label="Description"
          filled
          auto-grow
          :rules="[rules.required]"
        />
      </v-col>
    </d-form-block>

    <d-form-block title="Invite members">
      <v-col cols="12">
        <v-text-field
          v-model="q"
          label="Search..."
          filled
          append-icon="search"
          @input="debounceSearchUsers()"
        />
        <div
          v-for="(user, i) in formData.members"
          :key="i + '-picked'"
          class="pt-4 display-flex justify-space-between"
        >
          <div>
            <platform-avatar :user="user" :size="30" link-to-profile link-to-profile-class="px-1" />
          </div>
          <v-btn
            v-if="user.account.name != creatorUsername"
            text
            color="grey"
            class="ma-0"
            @click="cancelMember(i)"
          >Cancel</v-btn>
        </div>

        <v-divider v-show="formData.members.length > 0" class="mt-4" />

        <div
          v-for="(user, i) in selectableUsers"
          :key="i + '-selectable'"
          class="pt-4 display-flex justify-space-between"
        >
          <div>
            <platform-avatar :user="user" :size="30" link-to-profile link-to-profile-class="px-1" />
          </div>
          <v-btn text color="primary" class="ma-0" @click="inviteMember(user)">+ Invite</v-btn>
        </div>
      </v-col>
    </d-form-block>

    <!-- <d-form-block title="Quorum setup">
      <v-col cols="12">

      </v-col>
    </d-form-block>

    <d-form-block title="Research Group Tokens">
      <v-col cols="12">

      </v-col>
    </d-form-block>-->

    <div v-if="!hideButtons" class="text-right">
      <slot name="buttons">
        <v-btn
          type="button"
          text
          color="primary"
          :disabled="disabled"
          @click="$router.back()"
        >Cancel</v-btn>

        <v-btn type="submit" color="primary" class="ml-2" :loading="loading">Create group</v-btn>
      </slot>
    </div>
  </v-form>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import DFormBlock from '@/components/Deipify/DFormBlock/DFormBlock';
  import { FormMixin } from '@/utils/FomMixin';
  import { UsersService } from '@deip/users-service';
  import moment from 'moment';

  const usersService = UsersService.getInstance();

  const SELECTABLE_USERS_COUNT = 5;

  const prepareSelectableUsers = (allUsers, pickedUsers, q) => {
    let handler = _(allUsers);

    if (q !== '') {
      handler = handler.filter((user) =>
        _.startsWith(user.account.name.toLowerCase(), q.toLowerCase())
      );
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
    name: 'CreateResearchGroupForm',
    components: {
      DFormBlock
    },

    mixins: [FormMixin],

    model: {
      prop: 'formData'
    },

    props: {
      formData: {
        type: Object,
        required: true
      },

      hideButtons: {
        type: Boolean,
        default: false
      },

      partialDisabled: {
        type: Object,
        default: () => ({})
      },

      disabled: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isPermlinkVerifyed: undefined,
        creatorUsername: '',
        allUsers: [],
        selectableUsers: [],
        q: '',
        rules: {
          required: (value) => !!value || 'This field is required'
        }
      };
    },
    mounted() {
      this.creatorUsername = this.$store.getters['auth/user'].username;
      // TODO: request server for tenant users
      deipRpc.api
        .lookupAccountsAsync("0", 10000)
        .then((accounts) => {
          const blackList = ['regacc', 'hermes', 'initdelegate'];
          const usernames = [];
          usernames.push(
            ...accounts
              .filter(
                (a) =>
                  !a.is_research_group &&
                  !blackList.some((username) => username == a.name)
              )
              .map((a) => a.name)
          );
          return usersService.getEnrichedProfiles(usernames);
        })
        .then((users) => {
          users.forEach((u) => {
            u.stake = u.account.name == this.creatorUsername ? 100 : 0;
          });
          this.formData.members.push(
            users.find((u) => u.account.name == this.creatorUsername)
          ); // creator
          this.allUsers = users.filter(
            (u) => u.account.name != this.creatorUsername
          );
          this.selectableUsers = prepareSelectableUsers(
            this.allUsers,
            this.formData.members,
            this.q
          );
        });
    },
    methods: {
      debounceSearchUsers: _.debounce(function() {
        this.selectableUsers = prepareSelectableUsers(
          this.allUsers,
          this.formData.members,
          this.q
        );
      }, 600),

      inviteMember(member) {
        this.formData.members.push(member);
        recalculateDefaultStakes(this.creatorUsername, this.formData.members);
        this.selectableUsers = prepareSelectableUsers(
          this.allUsers,
          this.formData.members,
          this.q
        );
      },
      cancelMember(index) {
        this.formData.members.splice(index, 1);
        recalculateDefaultStakes(this.creatorUsername, this.formData.members);
        this.selectableUsers = prepareSelectableUsers(
          this.allUsers,
          this.formData.members,
          this.q
        );
      },
      permlinkVerifyed($event) {
        deipRpc.api
          .checkResearchGroupExistenceByPermlinkAsync($event)
          .then((exists) => {
            this.isPermlinkVerifyed = !exists;
          })
          .catch((error) => {
            this.isPermlinkVerifyed = false;
          });
      }
    }
  };
</script>

<style scoped>
</style>