<template>
  <v-form ref="form" @submit="onSubmit">
    <d-form-block :title="$t('createResearchGroup.nameBlock.title')">
      <v-col cols="12">
        <v-text-field
          v-model="formData.name"
          outlined
          name="title"
          :label="$t('createResearchGroup.nameBlock.titleField.label')"
          :rules="[rules.required, rules.titleLength]"
          :hint="$t('createResearchGroup.nameBlock.titleField.hint')"
          :error-messages="isPermlinkVerifyed === false ?
            $t('createResearchGroup.nameBlock.titleField.err') :
            ''
          "
        />
      </v-col>
    </d-form-block>

    <d-form-block :title="$t('createResearchGroup.aboutBlock.title')">
      <v-col cols="12">
        <v-textarea
          v-model="formData.description"
          name="Description"
          :label="$t('createResearchGroup.aboutBlock.descField')"
          outlined
          auto-grow
          :rules="[rules.required, rules.descriptionLength]"
        />
      </v-col>
    </d-form-block>

    <d-form-block :title="$t('createResearchGroup.inviteBlock.title')">
      <v-col cols="12">
        <v-text-field
          v-model="q"
          :label="$t('createResearchGroup.inviteBlock.searchField')"
          outlined
          append-icon="search"
          @input="debounceSearchUsers()"
        />
        <div
          v-for="(user, i) in formData.members"
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
            {{ $t('createResearchGroup.inviteBlock.cancel') }}
          </v-btn>
        </div>

        <v-divider v-show="formData.members.length > 0" class="mt-4" />

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
            {{ $t('createResearchGroup.inviteBlock.invite') }}
          </v-btn>
        </div>
      </v-col>
    </d-form-block>

    <!-- <d-form-block title="Quorum setup">
      <v-col cols="12">

      </v-col>
    </d-form-block>

    <d-form-block title="Project Group Tokens">
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
        >
          {{ $t('createResearchGroup.cancel') }}
        </v-btn>

        <v-btn
          type="submit"
          color="primary"
          class="ml-2"
          :loading="loading"
        >
          {{ $t('createResearchGroup.submitBtn') }}
        </v-btn>
      </slot>
    </div>
  </v-form>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DFormBlock from '@/components/Deipify/DFormBlock/DFormBlock';
  import { maxTitleLength, maxDescriptionLength } from '@/variables';
  import { FormMixin } from '@/utils/FormMixin';
  import { UsersService } from '@deip/users-service';
  import moment from 'moment';

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
      },
      isPermlinkVerifyed: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        creatorUsername: '',
        allUsers: [],
        selectableUsers: [],
        q: '',
        rules: {
          required: (value) => !!value || this.$t('defaultNaming.fieldRules.required'),
          titleLength: (value) => value.length <= maxTitleLength || this.$t('defaultNaming.fieldRules.titleMax', { maxTitleLength }),
          descriptionLength: (value) => value.length <= maxDescriptionLength || this.$t('defaultNaming.fieldRules.descriptionMax', { maxDescriptionLength })
        }
      };
    },
    mounted() {
      this.creatorUsername = this.$store.getters['auth/user'].username;
      usersService.getUsersListing()
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
      debounceSearchUsers: _.debounce(function () {
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
      }
    }
  };
</script>

<style scoped>
</style>
