<template>
  <v-sheet max-width="800" class="mx-auto">
    <div>
      <div class="title font-weight-medium pb-4">
        Location:
      </div>
      <v-text-field
        v-model="city"
        :rules="[rules.required]"
        label="City"
        solo
      />
      <v-text-field
        v-model="country"
        :rules="[rules.required]"
        label="Country"
        solo
      />
    </div>

    <div>
      <div class="title font-weight-medium pb-4">
        Bio:
      </div>
      <v-text-field
        v-model="bio"
        :rules="[rules.required]"
        label="Bio"
        solo
      />
    </div>

    <div>
      <div class="title font-weight-medium pb-4">
        Contacts:
      </div>
      <v-text-field
        v-model="email"
        :rules="[rules.required]"
        label="Email"
        solo
      />
    </div>

    <div>
      <div class="title font-weight-medium pb-4">
        Pesonal info:
      </div>
      <v-text-field
        v-model="firstName"
        :rules="[rules.required]"
        label="First name"
        solo
      />
      <v-text-field
        v-model="lastName"
        :rules="[rules.required]"
        label="Last name"
        solo
      />
      <v-menu
        v-model="editedBirthdayMenu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="editedBirthdayDate"
            label="Birthday"
            solo
            append-icon="event"
            readonly
            v-on="on"
          />
        </template>
        <v-date-picker v-model="editedBirthdayDate" @input="editedBirthdayMenu = false" />
      </v-menu>
    </div>

    <div class="py-2 text-end">
      <v-btn
        class="my-0 ml-2"
        large
        :loading="isLoading"
        :disabled="isSavingDisabled || isLoading"
        color="primary"
        @click="save()"
      >
        Update Info
      </v-btn>
    </div>

    <div class="pb-4">
      <v-btn
        class="ma-0"
        color="primary"
        outlined
        large
        @click="cancel"
      >
        Back to profile
      </v-btn>
    </div>
  </v-sheet>
</template>

<script>
  import { mapGetters } from 'vuex';
  import moment from 'moment';

  import { UserService } from '@deip/user-service';

  const userService = UserService.getInstance();

  export default {
    name: 'UserSettingsBody',
    data() {
      return {
        editedBirthdayMenu: false,
        editedBirthdayDate: null,
        city: '',
        country: '',
        bio: '',
        email: '',
        firstName: '',
        lastName: '',
        isLoading: false,
        rules: {
          required: (value) => !!value || 'This field is required'
        }
      };
    },
    computed: {
      ...mapGetters({
        currentUser: 'auth/user',
        userInfo: 'userSettings/userInfo'
      }),
      isSavingDisabled() {
        return (
          !this.city
          || !this.country
          || !this.bio
          || !this.email
          || !this.firstName
          || !this.lastName
        );
      }
    },

    created() {
      this.city = this.userInfo.profile.location.city || ' ';
      this.country = this.userInfo.profile.location.country || ' ';
      this.bio = this.userInfo.profile.bio || ' ';
      this.email = this.userInfo.profile.email || ' ';
      this.firstName = this.userInfo.profile.firstName || ' ';
      this.lastName = this.userInfo.profile.lastName || ' ';
      this.editedBirthdayDate = this.userInfo.profile.birthdate
        ? moment(this.userInfo.profile.birthdate)
          .format('YYYY-MM-DD')
        : null;
    },

    methods: {
      cancel() {
        this.$router.push({
          name: 'UserDetails',
          params: { account_name: this.currentUser.username }
        });
      },
      save() {
        this.isLoading = true;

        const location = {
          city: this.city,
          country: this.country
        };
        const { bio } = this;
        const { email } = this;
        const { firstName } = this;
        const { lastName } = this;
        const birthdate = this.editedBirthdayDate;

        const update = {
          ...this.userInfo.profile,
          ...{
            location,
            bio,
            email,
            firstName,
            lastName,
            birthdate
          }
        };

        userService
          .updateUserProfile(this.currentUser.username, update)
          .then(
            (res) => {
              this.$store.dispatch('userSettings/loadUserProfile', {
                username: this.currentUser.username
              });
              this.$store.dispatch('auth/loadUser');
              this.$store.dispatch('layout/setSuccess', {
                message: '"Personal info has been saved successfully!"'
              });
            },
            (err) => {
              this.$store.dispatch('layout/setError', {
                message: 'An error occurred while saving, please try again later'
              });
              console.log(err);
            }
          )
          .finally(() => {
            this.isLoading = false;
            this.$router.push({
              name: 'UserDetails',
              params: { account_name: this.currentUser.username }
            });
          });
      }
    }
  };
</script>

<style lang="less">
</style>
