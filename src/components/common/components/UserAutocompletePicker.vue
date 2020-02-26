<template>
  <div>
    <v-autocomplete
      :label="label"
      hide-no-data
      :append-icon="null"
      :loading="isUsersLoading"
      :disabled="isDisabled"
      :items="foundUsers"
      item-text="fullname"
      return-object
      :search-input.sync="usersSearch"
      v-on:keyup="queryUsers()"
      v-model="selectedUser"
    />
    <div v-if="!selectedUser">
      <v-layout row>
        <platform-avatar
          v-for="(user, i) in users.slice(0, displayLimit)"
          @onSelectedUser="selectUser"
          :pickDisabled="isDisabled"
          :noFollow="true"
          :size="40"
          :key="'user-' + i"
          :user="user"
          class="user-avatar mr-2"
        ></platform-avatar>
      </v-layout>
    </div>
    <template v-else>
      <platform-avatar
        :user="selectedUser"
        :size="40"
        link-to-profile
        link-to-profile-class="pl-3"
      ></platform-avatar>
      <div v-if="$options.filters.employmentOrEducation(selectedUser)">
        <div class="py-2 body-2">{{selectedUser | employmentOrEducation}}</div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "UserAutocompletePicker",
  props: {
    users: { type: Array, required: false, default: [] },
    isDisabled: { type: Boolean, required: false, default: false },
    displayLimit: { type: Number, requride: false, default: 6 },
    label: { type: String, reqride: false, default: "" }
  },
  data() {
    return {
      isUsersLoading: false,
      foundUsers: [],
      usersSearch: "",
      selectedUser: null
    };
  },
  methods: {
    queryUsers() {
      this.isUsersLoading = true;
      this.foundUsers = this.usersSearch ? this.users
            .filter(user => {
              let name = this.$options.filters.fullname(user);
              return (
                name
                  .toLowerCase()
                  .indexOf((this.usersSearch || "").toLowerCase()) > -1 ||
                user.account.name
                  .toLowerCase()
                  .indexOf((this.usersSearch || "").toLowerCase()) > -1
              );
            })
            .map(user => {
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
  },
  watch: {
    selectedUser() {
      this.$emit("onSelectUser", this.selectedUser);
    }
  }
};
</script>

<style scoped>
</style>