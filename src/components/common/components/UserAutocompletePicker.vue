<template>
  <div>
    <v-autocomplete
      v-model="selectedUser"
      :label="label"
      hide-no-data
      :append-icon="null"
      outlined
      :loading="isUsersLoading"
      :disabled="isDisabled"
      :items="foundUsers"
      item-text="fullname"
      return-object
      :search-input.sync="usersSearch"
      @keyup="queryUsers()"
    />
    <div v-if="!selectedUser" class="display-flex flex-wrap">
      <platform-avatar
        v-for="(user, i) in users.slice(0, displayLimit)"
        :key="'user-' + i"
        :pick-disabled="isDisabled"
        :no-follow="true"
        :size="40"
        :user="user"
        class="user-avatar mr-2"
        @onSelectedUser="selectUser"
      />
    </div>
    <template v-else>
      <platform-avatar
        :user="selectedUser"
        :size="40"
        link-to-profile
        link-to-profile-class="pl-4"
      />
      <div v-if="$options.filters.employmentOrEducation(selectedUser)">
        <div class="py-2 text-body-2">
          {{ selectedUser | employmentOrEducation }}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'UserAutocompletePicker',
    props: {
      users: { type: Array, required: false, default: [] },
      isDisabled: { type: Boolean, required: false, default: false },
      displayLimit: { type: Number, requride: false, default: 6 },
      label: { type: String, reqride: false, default: '' }
    },
    data() {
      return {
        isUsersLoading: false,
        foundUsers: [],
        usersSearch: '',
        selectedUser: null
      };
    },
    watch: {
      selectedUser() {
        this.$emit('onSelectUser', this.selectedUser);
      }
    },
    methods: {
      queryUsers() {
        this.isUsersLoading = true;
        this.foundUsers = this.usersSearch ? this.users
          .filter((user) => {
            const name = this.$options.filters.fullname(user);
            return (
              name
                .toLowerCase()
                .indexOf((this.usersSearch || '').toLowerCase()) > -1
              || user.account.name
                .toLowerCase()
                .indexOf((this.usersSearch || '').toLowerCase()) > -1
            );
          })
          .map((user) => {
            const fullname = this.$options.filters.fullname(user);
            return { fullname, ...user };
          })
          : [];

        if (!this.usersSearch) {
          this.selectedUser = null;
        }

        this.isUsersLoading = false;
      },
      selectUser(user) {
        const fullname = this.$options.filters.fullname(user);
        user.fullname = fullname;
        this.foundUsers = [user];
        this.selectedUser = user;
        this.usersSearch = fullname;
      }
    }
  };
</script>

<style scoped>
</style>
