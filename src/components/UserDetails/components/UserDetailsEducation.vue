<template>
  <div v-if="isProfileAvailable && (isEducationSpecified || isOwner)" class="py-2">
    <div class="d-flex mb-1">
      <div class="text-h6 text-left align-self-center">
        Education
      </div>
      <v-spacer v-if="isOwner" />
      <div v-if="isOwner">
        <v-btn
          class=""
          outlined
          small
          depressed
          color="primary lighten-1"
          :to="{
            name: 'account.education'
          }"
        >
          Add
          <v-icon small>
            add
          </v-icon>
        </v-btn>
      </div>
    </div>
    <v-simple-table>
      <template #default>
        <tbody>
          <tr v-for="(item, index) in userInfo.profile.education" :key="`${index}-education`">
            <td class="pl-0">
              <div class="text-body-2 py-3">
                {{ moment(item.period.from).format('YYYY') }}{{ item.period.to ? ` — ${moment(item.period.to).format('YYYY')}` : ' — present' }} {{ item.educationalInstitution }}
              </div>
              <div class="">
                {{ item.degree }}
              </div>
            </td>
            <td v-if="isOwner" class="text-right vertical-top pt-3 pr-0">
              <crud-actions row>
                <v-btn
                  icon
                  small
                  :to="{
                    name: 'account.education',
                    query: {
                      index: `${index}`
                    }
                  }"
                >
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn icon small @click="showDeleteEducationDialog(item, index)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </crud-actions>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div v-if="isOwner">
      <d-dialog
        v-model="deleteEducationMeta.isShown"
        :confirm-button-title="'Confirm'"
        @click:confirm="deleteEducation(deleteEducationMeta)"
      >
        <div class="pt-1">
          Are you sure you want to delete this entry ?
        </div>
      </d-dialog>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import CrudActions from '@/components/layout/CrudActions';
  import DDialog from '@/components/Deipify/DDialog/DDialog';

  import { UserService } from '@deip/user-service';

  const userService = UserService.getInstance();

  export default {
    name: 'UserDetailsEducation',

    components: {
      CrudActions,
      DDialog
    },
    data() {
      return {
        deleteEducationMeta: {
          isShown: false,
          item: null,
          index: null
        }
      };
    },
    computed: {
      ...mapGetters({
        currentUser: 'auth/user',
        userInfo: 'userDetails/userInfo'
      }),

      isOwner() {
        return this.currentUser && this.currentUser.account.name === this.userInfo.account.name;
      },
      isEducationSpecified() {
        return this.userInfo && this.userInfo.profile && this.userInfo.profile.education.length;
      },

      isProfileAvailable() {
        return this.userInfo.profile != null;
      }

    },
    methods: {
      showDeleteEducationDialog(item, index) {
        this.deleteEducationMeta.item = item;
        this.deleteEducationMeta.index = index;
        this.deleteEducationMeta.isShown = true;
      },
      deleteEducation({ item, index }) {
        const educationList = this.userInfo.profile.education.reduce(
          (accum, current, i) => {
            if (i == index) {
              return accum;
            }
            return accum.concat(current);
          }, []
        );

        const update = { ...this.userInfo.profile, education: educationList };

        userService.updateUserProfile(this.currentUser.username, update)
          .then((res) => {
            this.$store.dispatch('userDetails/loadUserProfile', { username: this.currentUser.username });
            this.$notifier.showSuccess(`"${item.educationalInstitution}" Institute has been deleted successfully!"`);
          }, (err) => {
            this.$notifier.showError(`An error occurred while deleting "${item.educationalInstitution}" details, please try again later`);
            console.error(err);
          })
          .finally(() => {
            this.deleteEducationMeta.isShown = false;
          });
      }
    }
  };
</script>
