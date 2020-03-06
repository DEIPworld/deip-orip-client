<template>
  <div>
    <div class="legacy-row discipline-picker c-mt-8">
      <div class="legacy-col-3">
        <discipline-tree-picker @select="setDisciplines"></discipline-tree-picker>
      </div>

      <div class="legacy-col-3 text-align-center">
        <div class="step-title">Disciplines</div>
        <div v-for="discipline in selectedDisciplines" class="subheading c-mt-2">
          <div>
            <span>{{discipline.label}}</span>
            <div>
              <input type="number" v-model.number="discipline.amount" class="discipline-amount">
            </div>
          </div>
        </div>
        <div class="c-mt-4">
          <v-btn color="primary" @click="addExpertises()" :disabled="!selectedDisciplines.length || !selectedUser">
            Set expertise
          </v-btn>
        </div>
      </div>

      <div class="legacy-col-3 text-align-center">
        <div class="step-title">User</div>
        <div v-if="selectedUser" class="subheading c-mt-2 bold">{{selectedUser | fullname}}</div>

        <div v-if="selectedUser && selectedUser.expertise" class="selected-user-expertise-container c-mr-4">
          <v-progress-circular class="section-spinner"
                               v-if="isLoadingUserExpertise"
                               indeterminate color="primary"
          ></v-progress-circular>

          <div v-if="isLoadingUserExpertise === false">
            <div class="c-pt-4 c-pb-6">
              <div class="legacy-row legacy-justify-between" v-for="(item, i) in selectedUser.expertise" :key="i">
                <div>{{ item.discipline_name }}</div>
                <div>{{ item.amount }}</div>
              </div>
              <div v-if="!selectedUser.expertise.length" class="italic">No Expertise Tokens</div>
            </div>
          </div>
        </div>
      </div>

      <div class="legacy-col-3 text-align-center">
        <div class="users-container spinner-container">
          <v-progress-circular class="section-spinner"
                               v-if="isLoadingUsers"
                               indeterminate color="primary"
          ></v-progress-circular>

          <div v-if="isLoadingUsers === false">
            <div v-for="(user, index) in users" :key="index"
                 class="legacy-row-nowrap user-item legacy-justify-between align-center c-pt-2 c-pb-2"
                 v-bind:class="{'selected-user': user === selectedUser }"
                 @click="selectUser(user)">
              <div>
                <platform-avatar
                  :user="user.profile"
                  :size="40"
                  link-to-profile
                  link-to-profile-class="px-1"
                ></platform-avatar>
                <!-- <a href="#" class="a c-pl-3">{{user | fullname}}</a> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import deipRpc from '@deip/deip-oa-rpc-client';
  import { mapGetters } from 'vuex';
  import { UsersService } from '@deip/users-service';

  const usersService = UsersService.getInstance();

  export default {
    name: 'SetExpertisePage',
    data() {
      return {
        users: [],
        selectedUser: undefined,
        selectedDisciplines: [],
        isLoadingUsers: undefined,
        isLoadingUserExpertise: undefined
      }
    },
    computed: {
      ...mapGetters({
        currentUser: 'auth/user'
      })
    },
    methods: {
      loadUsers() {
        this.isLoadingUsers = true;
        deipRpc.api.getAllAccountsAsync()
          .then((accounts) => {
            return usersService.getEnrichedProfiles(accounts.map(a => a.name))
          }, (err) => {
            console.log(err)
          })
          .then((users) => {
            this.users = users;
          }, (err) => {
            console.log(err)
          })
          .finally(() => {
            this.isLoadingUsers = false;
          })
      },
      selectUser(user) {
        this.isLoadingUserExpertise = true;
        deipRpc.api.getExpertTokensByAccountNameAsync(user.account.name)
          .then(data => {
            const u = this.users.find(u => u.account.name === user.account.name)
            if (u) {
              u.expertise = data;
            }
            this.selectedUser = u;
          }).finally(() => {
          this.isLoadingUserExpertise = false;
        })
      },
      setDisciplines(arr) {
        const updated = [];
        arr.forEach(d => {
          const discipline = this.selectedDisciplines.find(ds => ds.id === d.id)
          if (discipline) {
            updated.push({id: d.id, label: d.label, amount: discipline.amount})
          } else {
            updated.push({id: d.id, label: d.label, amount: 0})
          }
        })
        this.selectedDisciplines = updated;
      },

      addExpertises() {
        if (!this.selectedDisciplines.length || !this.selectedUser) return;

        const disciplines = this.selectedDisciplines.map(d => {
          return {discipline_id: d.id, amount: d.amount}
        });
        deipRpc.broadcast.setExpertiseTokensAsync(
          this.currentUser.privKey,
          this.currentUser.username,
          this.selectedUser.account.name,
          disciplines
        ).then((data) => {
          this.selectUser(this.selectedUser)
          alert('success !')
        }, (err) => {
          alert(err)
        })
      }
    },
    created() {
      this.loadUsers();
    },
    components: {}
  };

</script>


<style lang="less" scoped>
  .users-container {
    min-height: 500px;
    max-height: 800px;
    overflow: scroll;
  }

  .selected-user-expertise-container {
    min-height: 50px;
  }

  .user-item {
    cursor: pointer;
  }

  .selected-user {
    background-color: #eae7e7;
  }

  .user-item:hover {
    background-color: #f5f5f5;
  }

  .discipline-amount {
    border: 1px solid black;
  }

</style>
