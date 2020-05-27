<template>
  <admin-view title="Members" v-if="dataLoaded">
    <template #toolbarAction>
      <v-btn outlined color="primary" :to="{name: 'admin.members.add'}">
        <v-icon left>
          person_add
        </v-icon>Add member
      </v-btn>
    </template>

    <template #toolbarExtension>
      <v-tabs v-model="tab">
        <v-tab>Registered</v-tab>
        <v-tab>
          Waiting for approval
          <v-badge v-if="waitingMembers.length" :content="waitingMembers.length" color="green" inline />
        </v-tab>
      </v-tabs>
    </template>

    <v-tabs-items v-model="tab">
      <v-tab-item :transition="false" :reverse-transition="false">
        <v-data-table
          v-custom="'hover-row'"
          :headers="registeredMembersTableHeaders"
          :items="registeredMembers"
          @click:row="openMemberInfoDialog"
        >
          <template v-slot:item.name="{ item }">
            {{ item | fullname }}
          </template>
          <template v-slot:item.created_at="{ item }">
            {{ item.profile.created_at | dateFormat('MMMM DD YYYY', true) }}
          </template>
        </v-data-table>
      </v-tab-item>

      <v-tab-item :transition="false" :reverse-transition="false">
        <v-data-table
          v-custom="'hover-row'"
          :headers="waitingMembersTableHeaders"
          :items="waitingMembers"
          @click:row="openMemberInfoDialog"
        >
          <template v-slot:item.name="{ item }">
            {{ item.firstName }} {{ item.lastName }}
          </template>
          <template v-slot:item.created_at="{ item }">
            {{ item.created_at | dateFormat('MMMM DD YYYY', true) }}
          </template>
          <template v-slot:item.actions="{ item }">
            <crud-actions row>
              <v-btn icon small @click.stop="openActionDialog('approve', item._id)">
                <v-icon>done</v-icon>
              </v-btn>
              <v-btn icon small @click.stop="openActionDialog('decline', item._id)">
                <v-icon>close</v-icon>
              </v-btn>
            </crud-actions>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>

    <action-dialog
      :open="actionDialog.isOpen"
      :title="actionDialog.data.title"
      @close="closeActionDialog"
    >
      {{ actionDialog.data.description }}
      <template #actions>
        <v-btn color="primary" :disabled="isDisabled" text @click="closeActionDialog">
          cancel
        </v-btn>
        <v-btn
          v-if="actionDialog.data.action"
          color="primary"
          :disabled="isDisabled"
          text
          @click="actionDialog.data.action.method(actionDialog.data.name)"
        >
          {{ actionDialog.data.action.title }}
        </v-btn>
      </template>
    </action-dialog>

    <v-dialog v-model="memberInfoDialog" max-width="420px" scrollable>
      <v-card>
        <v-card-title>
          <span class="headline">{{ memberInfo | fullname }}</span>
          <v-spacer />
          <v-btn
            small
            icon
            class="mr-n2"
            @click="closeMemberInfoDialog"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="px-6 py-3 text--primary">
          <div class="mb-6">
            <div class="subtitle-1 font-weight-medium mb-2">
              Personal information
            </div>
            <div>Name: {{ memberInfo.profile.firstName }}</div>
            <div>Last name: {{ memberInfo.profile.lastName }}</div>
            <div>Date of birth: {{ memberInfo.profile.birthdate | dateFormat('MMMM DD YYYY', true) }}</div>
            <div>ID: {{ memberInfo.profile.foreignIds }}</div>
          </div>

          <div class="mb-6">
            <div class="subtitle-1 font-weight-medium mb-2">
              Account information
            </div>
            <div>Email: <a :href="`mailto:${memberInfo.profile.email}`">{{ memberInfo.profile.email }}</a></div>
            <div>Category: {{ memberInfo.profile.category }}</div>
          </div>

          <div class="mb-6">
            <div class="subtitle-1 font-weight-medium mb-2">
              Contact information
            </div>
            <div>Address: {{ memberInfo.profile.location ? memberInfo.profile.location.address : '' }}</div>
            <div>City: {{ memberInfo.profile.location ? memberInfo.profile.location.city : '' }}</div>
            <div>Country: {{ memberInfo.profile.location ? memberInfo.profile.location.country : '' }}</div>
            <div>Phone number: {{ memberInfo.profile.phoneNumbers }}</div>
          </div>

          <div class="mb-6">
            <div class="subtitle-1 font-weight-medium mb-2">
              Occupation information
            </div>
            <div>Occupation: {{ memberInfo.profile.occupation }}</div>
            <div>
              Web site:
              <a
                v-for="(item, i) in memberInfo.profile.webPages"
                :key="`${i}-webPage`"
                :href="`${item.link}`"
                target="_blank"
              >
                {{ item.link }}
              </a>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions v-if="memberInfo.profile.status === 'pending'">
          <v-spacer />
          <v-btn color="blue darken-1" text @click="rejectMemberInfoDialog">
            Reject
          </v-btn>
          <v-btn color="blue darken-1" text @click="approveMemberInfoDialog">
            Approve
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import CrudActions from '@/components/layout/CrudActions';
  import ActionDialog from '@/components/layout/ActionDialog';
  import { TenantService } from '@deip/tenant-service';
  import { mapGetters } from 'vuex';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminMembers',
    components: { CrudActions, AdminView, ActionDialog },
    data() {
      return {
        tab: null,
        memberInfoDialog: false,
        isDisabled: false,
        deleteDialog: false,
        approveDialog: false,
        registeredMembersTableHeaders: [
          {
            text: 'Name',
            value: 'name',
            sortable: false
          },
          {
            text: 'Member since',
            value: 'created_at',
            sortable: false
          },
          {
            text: 'Category',
            value: 'profile.category',
            sortable: false
          },
          {
            text: 'Country',
            value: 'profile.location.country',
            sortable: false
          }
        ],
        waitingMembersTableHeaders: [
          {
            text: 'Name',
            value: 'name',
            sortable: false
          },
          {
            text: 'Request date',
            value: 'created_at',
            sortable: false
          },
          {
            text: '',
            value: 'actions',
            align: 'right',
            sortable: false
          }
        ],
        memberInfo: {
          account: {
            name: ''
          },
          profile: {
            firstName: '',
            lastName: '',
            created_at: '',
            foreignIds: '',
            email: '',
            category: '',
            location: {
              address: '',
              city: '',
              country: ''
            },
            phoneNumbers: '',
            occupation: '',
            status: '',
            webPages: ''
          }
        },
        actionDialog: {
          isOpen: false,
          data: {},
          types: {
            approve: {
              title: 'Approve request?',
              description:
                'Request will be approved and person will become a member.',
              action: {
                title: 'approve',
                method: this.approveRequest
              }
            },
            decline: {
              title: 'Reject request?',
              description:
                'Request will be declined and person will not published.',
              action: {
                title: 'reject',
                method: this.declineRequest
              }
            }
          }
        }
      };
    },

    computed: {
      ...mapGetters({
        registeredMembers: 'adminPanel/registeredMembers',
        waitingMembers: 'adminPanel/waitingMembers'
      })
    },

    methods: {
      openMemberInfoDialog(item) {
        if (item.account) {
          this.memberInfo.account.name = item.account.name;
          this.memberInfo.profile = { ...item.profile };
        } else {
          this.memberInfo.account.name = item._id;
          this.memberInfo.profile = { ...item };
        }
        this.memberInfo.profile.phoneNumbers = this.memberInfo.profile.phoneNumbers.map(({ number }) => number).join(', ');
        this.memberInfo.profile.foreignIds = this.memberInfo.profile.foreignIds.map(({ id }) => id).join(', ');
        this.memberInfoDialog = true;
      },
      closeMemberInfoDialog() {
        this.memberInfoDialog = false;
      },
      rejectMemberInfoDialog() {
        this.closeMemberInfoDialog();
        this.openActionDialog('decline', this.memberInfo.account.name);
      },
      approveMemberInfoDialog() {
        this.closeMemberInfoDialog();
        this.openActionDialog('approve', this.memberInfo.account.name);
      },
      openActionDialog(type, item) {
        this.actionDialog.isOpen = true;
        this.actionDialog.data = this.actionDialog.types[type];
        this.actionDialog.data.name = item;
      },
      closeActionDialog() {
        this.actionDialog.isOpen = false;
        setTimeout(() => {
          this.actionDialog.data = {};
        }, 300);
      },
      approveRequest(name) {
        this.isDisabled = true;
        return tenantService.approveSignUpRequest(name)
          .then(() => {
            this.$store.dispatch('layout/setSuccess', { message: 'Account successfully created' });
            this.$store.dispatch('adminPanel/loadAllMembers', {});
          })
          .catch((err) => {
            console.error(err);
            this.$store.dispatch('layout/setError', {
              message: 'An error occurred while sending the request, please try again later.'
            });
          })
          .finally(() => {
            this.isDisabled = false;
            this.closeActionDialog();
          });
      },
      declineRequest(name) {
        this.isDisabled = true;
        return tenantService.rejectSignUpRequest(name)
          .then(() => {
            this.$store.dispatch('layout/setSuccess', { message: 'Successfully' });
            this.$store.dispatch('adminPanel/loadAllMembers', {});
          })
          .catch((err) => {
            console.error(err);
            this.$store.dispatch('layout/setError', {
              message: 'An error occurred while sending the request, please try again later.'
            });
          })
          .finally(() => {
            this.isDisabled = false;
            this.closeActionDialog();
          });
      }
    },

    $dataPreload() {
      return Promise.all([
        this.$store.dispatch('adminPanel/loadAllMembers')
      ]);
    }
  };
</script>

<style scoped>
</style>
