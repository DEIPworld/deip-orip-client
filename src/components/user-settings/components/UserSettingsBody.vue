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
        outlined
      />
      <v-text-field
        v-model="country"
        :rules="[rules.required]"
        label="Country"
        outlined
      />
    </div>

    <div>
      <div class="title font-weight-medium pb-4">
        Bio:
      </div>
      <v-textarea
        v-model="bio"
        :rules="[rules.required]"
        label="Tell about yourself"
        outlined
        auto-grow
        rows="1"
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
        outlined
      />
    </div>

    <div>
      <div class="title font-weight-medium pb-4">
        Personal information:
      </div>
      <v-text-field
        v-model="firstName"
        :rules="[rules.required]"
        label="First name"
        outlined
      />
      <v-text-field
        v-model="lastName"
        :rules="[rules.required]"
        label="Last name"
        outlined
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
            outlined
            append-icon="event"
            readonly
            v-on="on"
          />
        </template>
        <v-date-picker v-model="editedBirthdayDate" @input="editedBirthdayMenu = false" />
      </v-menu>
    </div>

    <div>
      <div class="title font-weight-medium pb-4">
        Additional information:
      </div>
      <v-select
        v-model="category"
        :items="categoryList"
        outlined
        label="Category"
        :rules="[rules.required]"
      />
      <v-select
        v-model="occupation"
        :items="occupationList"
        outlined
        label="Occupation"
        :rules="[rules.required]"
      />
      <v-text-field
        v-model="webPage"
        label="Web site"
        outlined
      />
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
        occupationList: ['Company', 'Independent', 'Small team/group', 'Other'],
        categoryList: [
          'Consultant',
          'Contractor',
          'Current WECO2 Partner',
          'Investor',
          'Project innovator',
          'Team member'
        ],
        editedBirthdayMenu: false,
        editedBirthdayDate: null,
        city: '',
        country: '',
        bio: '',
        email: '',
        firstName: '',
        lastName: '',
        category: '',
        occupation: '',
        webPage: '',
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
          || !this.category
          || !this.occupation
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
      this.category = this.userInfo.profile.category;
      this.occupation = this.userInfo.profile.occupation;
      this.webPage = this.userInfo.profile.webPages[0].link;
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
        const { category } = this;
        const { occupation } = this;
        const { webPage } = this;
        const birthdate = this.editedBirthdayDate;

        const update = {
          ...this.userInfo.profile,
          ...{
            location,
            bio,
            email,
            firstName,
            lastName,
            birthdate,
            category,
            occupation,
            webPages: [{ type: 'webpage', label: 'default', link: webPage }]
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
