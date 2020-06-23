<template>
  <admin-view v-if="$ready" title="Members">
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
          <v-badge
            v-if="waitingMembers.length"
            :content="waitingMembers.length"
            color="green"
            inline
          />
        </v-tab>
      </v-tabs>
    </template>

    <v-tabs-items v-model="tab">
      <v-tab-item :transition="false" :reverse-transition="false">
        <v-data-table
          v-custom="'hover-row'"

          :hide-default-footer="registeredMembers.length < 50"
          :footer-props="{itemsPerPageOptions: [5, 10, 20, 50, -1]}"
          :items-per-page="50"

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

          :hide-default-footer="waitingMembers.length < 50"
          :footer-props="{itemsPerPageOptions: [5, 10, 20, 50, -1]}"
          :items-per-page="50"

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
              <v-btn icon small @click.stop="openActionDialog('reject', item._id)">
                <v-icon>close</v-icon>
              </v-btn>
            </crud-actions>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>

    <d-dialog
      v-model="actionDialog.isOpen"
      :title="actionDialog.title"
      :confirm-button-title="actionDialog.confirmLabel"
      @click:confirm="actionDialog.action"
    >
      {{ actionDialog.description }}
    </d-dialog>

    <d-dialog
      v-model="memberInfoDialog.isOpen"
      :hide-buttons="memberInfoDialog.hideButtons"
      :title="memberInfoDialog.title"
      confirm-button-title="Approve"
      cancel-button-title="Reject"
      @click:confirm="approveMemberInfoDialog(memberInfoDialog.data)"
      @click:cancel="rejectMemberInfoDialog(memberInfoDialog.data)"
    >
      <template v-if="memberInfoDialog.data">
        <d-info-block title="Personal information">
          <div>Name: {{ memberInfoDialog.data.firstName }}</div>
          <div>Last name: {{ memberInfoDialog.data.lastName }}</div>
          <div>Date of birth: {{ memberInfoDialog.data.birthdate | dateFormat('MMMM DD YYYY', true) }}</div>
          <div>ID: {{ memberInfoDialog.data.foreignIds | joinByKey('id') }}</div>
        </d-info-block>

        <d-info-block title="Account information">
          <div>Email: <a :href="`mailto:${memberInfoDialog.data.email}`">{{ memberInfoDialog.data.email }}</a></div>
          <div>Category: {{ memberInfoDialog.data.category }}</div>
        </d-info-block>

        <d-info-block title="Contact information">
          <div>Address: {{ memberInfoDialog.data.location ? memberInfoDialog.data.location.address : '' }}</div>
          <div>City: {{ memberInfoDialog.data.location ? memberInfoDialog.data.location.city : '' }}</div>
          <div>Country: {{ memberInfoDialog.data.location ? memberInfoDialog.data.location.country : '' }}</div>
          <div>Phone number: {{ memberInfoDialog.data.phoneNumbers | joinByKey('number') }}</div>
        </d-info-block>

        <d-info-block title="Occupation information" is-last>
          <div>Occupation: {{ memberInfoDialog.data.occupation }}</div>
          <div>
            Web site:
            <a
              v-for="(item, i) in memberInfoDialog.data.webPages"
              :key="`${i}-webPage`"
              :href="`${item.link}`"
              target="_blank"
            >
              {{ item.link }}
            </a>
          </div>
        </d-info-block>
      </template>
    </d-dialog>
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import CrudActions from '@/components/layout/CrudActions';
  import { TenantService } from '@deip/tenant-service';
  import { mapGetters } from 'vuex';
  import DDialog from '@/components/Deipify/DDialog/DDialog';
  import DInfoBlock from '@/components/Deipify/DInfoBlock/DInfoBlock';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminMembers',
    components: {
      DInfoBlock,
      DDialog,
      CrudActions,
      AdminView
    },
    data() {
      return {
        tab: null,
        modals: {},

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

        actionDialog: {
          isOpen: false,
          title: null,
          description: null,
          confirmLabel: null,
          username: null,
          action: () => false
        },

        memberInfoDialog: {
          isOpen: false,
          hideButtons: true,
          title: null,
          data: null
        }
      };
    },

    computed: {
      ...mapGetters({
        registeredMembers: 'adminPanel/registeredMembers',
        waitingMembers: 'adminPanel/waitingMembers'
      })
    },

    created() {
      this.$store.dispatch('adminPanel/loadAllMembers')
      .then(() => {
        this.$setReady()
      })
    },

    methods: {

      openMemberInfoDialog(item) {
        const person = item.profile ? item.profile : item;
        this.memberInfoDialog.title = this.$options.filters.fullname({ profile: person });
        this.memberInfoDialog.data = person;
        this.memberInfoDialog.isOpen = true;
        this.memberInfoDialog.hideButtons = !(item.status && item.status === 'pending');
      },
      closeMemberInfoDialog() {
        this.memberInfoDialog.isOpen = false;
      },

      rejectMemberInfoDialog(user) {
        this.openActionDialog('reject', user._id);
        this.closeMemberInfoDialog();
      },
      approveMemberInfoDialog(user) {
        this.openActionDialog('approve', user._id);
        this.closeMemberInfoDialog();
      },

      openActionDialog(type, username) {
        const types = {
          approve: {
            title: 'Approve request?',
            description: 'Request will be approved and person will become a member.',
            confirmLabel: 'approve',
            action: () => { this.approveRequest(username); }
          },
          reject: {
            title: 'Reject request?',
            description: 'Request will be rejected and person will not published.',
            confirmLabel: 'reject',
            action: () => { this.rejectRequest(username); }
          }
        };

        this.actionDialog = {
          ...types[type],
          isOpen: true
        };
      },
      closeActionDialog() {
        this.actionDialog.isOpen = false;
      },

      approveRequest(name) {
        this.isDisabled = true;
        return tenantService.approveSignUpRequest(name)
          .then(() => {
            this.$notifier.showSuccess('Account successfully created');
            this.$store.dispatch('adminPanel/loadAllMembers', {});
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError();
          })
          .finally(() => {
            this.isDisabled = false;
            this.closeActionDialog();
          });
      },
      rejectRequest(name) {
        this.isDisabled = true;
        return tenantService.rejectSignUpRequest(name)
          .then(() => {
            this.$notifier.showSuccess()
            this.$store.dispatch('adminPanel/loadAllMembers', {});
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError()
          })
          .finally(() => {
            this.isDisabled = false;
            this.closeActionDialog();
          });
      }
    }
  };
</script>

<style scoped>
</style>
