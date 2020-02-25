<template>
  <v-card height="100%">
    <v-layout row wrap justify-center style="flex: 0 0 auto;" class="px-4 py-5 full-width">
      <v-flex xs10>
        <v-layout column>
          <div>
            <div class="title font-weight-medium pb-3">Location:</div>
            <v-text-field v-model="city" :rules="[rules.required]" label="City" solo />
            <v-text-field v-model="country" :rules="[rules.required]" label="Country" solo />
          </div>

          <div>
            <div class="title font-weight-medium pb-3">Bio:</div>
            <v-text-field v-model="bio" :rules="[rules.required]" label="Bio" solo />
          </div>

          <div>
            <div class="title font-weight-medium pb-3">Contacts:</div>
            <v-text-field v-model="email" :rules="[rules.required]" label="Email" solo />
          </div>

          <div>
            <div class="title font-weight-medium pb-3">Pesonal info:</div>
            <v-text-field v-model="firstName" :rules="[rules.required]" label="First name" solo />
            <v-text-field v-model="lastName" :rules="[rules.required]" label="Last name" solo />
            <v-menu
              lazy
              :close-on-content-click="false"
              v-model="editedBirthdayMenu"
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                label="Birthday"
                solo
                v-model="editedBirthdayDate"
                append-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="editedBirthdayDate" @input="editedBirthdayMenu = false"></v-date-picker>
            </v-menu>
          </div>

          <div class="py-2">
            <v-layout justify-end>
              <v-btn
                class="my-0 ml-2"
                large
                :loading="isLoading"
                :disabled="isSavingDisabled || isLoading"
                color="primary"
                @click="save()"
              >Update Info</v-btn>
            </v-layout>
          </div>

          <div class="pb-3">
            <v-btn class="ma-0" color="primary" outline large @click="cancel">Back to profile</v-btn>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import usersService from "@/services/http/users";
import moment from "moment";

export default {
  name: "UserSettingsBody",
  data() {
    return {
      editedBirthdayMenu: false,
      editedBirthdayDate: null,
      city: "",
      country: "",
      bio: "",
      email: "",
      firstName: "",
      lastName: "",
      isLoading: false,
      rules: {
        required: value => !!value || "This field is required",
      }
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "auth/user",
      userInfo: "userSettings/userInfo"
    }),
    isSavingDisabled() {
      return (
        !this.city ||
        !this.country ||
        !this.bio ||
        !this.email ||
        !this.firstName ||
        !this.lastName
      );
    }
  },

  methods: {
    cancel() {
      this.$router.push({
        name: "UserDetails",
        params: { account_name: this.currentUser.username }
      });
    },
    save() {
      this.isLoading = true;

      const location = { city: this.city, country: this.country };
      const bio = this.bio;
      const email = this.email;
      const firstName = this.firstName;
      const lastName = this.lastName;
      const birthday = this.editedBirthdayDate;

      const update = {
        ...this.userInfo.profile,
        ...{
          location,
          bio,
          email,
          firstName,
          lastName,
          birthday
        }
      };

      usersService
        .updateUserProfile(this.currentUser.username, update)
        .then(
          res => {
            this.$store.dispatch("userSettings/loadUserProfile", {
              username: this.currentUser.username
            });
            this.$store.dispatch('auth/loadUser');
            this.$store.dispatch("layout/setSuccess", {
              message: `"Personal info has been saved successfully!"`
            });
          },
          err => {
            this.$store.dispatch("layout/setError", {
              message: `An error occurred while saving, please try again later`
            });
            console.log(err);
          }
        )
        .finally(() => {
          this.isLoading = false;
          this.$router.push({
            name: "UserDetails",
            params: { account_name: this.currentUser.username }
          });
        });
    },
  },

  created() {
    this.city = this.userInfo.profile.location.city || " ";
    this.country = this.userInfo.profile.location.country || " ";
    this.bio = this.userInfo.profile.bio || " ";
    this.email = this.userInfo.profile.email || " ";
    this.firstName = this.userInfo.profile.firstName || " ";
    this.lastName = this.userInfo.profile.lastName || " ";
    this.editedBirthdayDate = this.userInfo.profile.birthday
      ? moment(this.userInfo.profile.birthday).format("YYYY-MM-DD")
      : null;
  }
};
</script>

<style lang="less">
</style>