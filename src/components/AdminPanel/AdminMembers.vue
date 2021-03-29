<template>
  <admin-view v-if="$ready" :title="$t('adminRouting.members.title')">
    <template 
      v-if="$hasModule(DEIP_MODULE.ADMIN_PANEL_MEMBERS_REGISTRATION)" 
      #toolbarAction
    >
      <v-btn outlined color="primary" :to="{name: 'admin.members.add'}">
        <v-icon left>
          person_add
        </v-icon>{{ $t('adminRouting.members.add') }}
      </v-btn>
    </template>

    <template #toolbarExtension>
      <v-tabs v-model="tab">
        <v-tab>{{ $t('adminRouting.members.registeredTab') }}</v-tab>
        <!-- <v-tab v-if="$hasModule(DEIP_MODULE.ADMIN_PANEL_MEMBERS_REGISTRATION)" >
          {{ $t('adminRouting.members.waitingTab') }}
          <v-badge
            v-if="waitingMembers.length"
            :content="waitingMembers.length"
            color="green"
            inline
          />
        </v-tab> -->
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

    <vex-dialog
      v-model="actionDialog.isOpen"
      :title="actionDialog.title"
      :button-true-text="actionDialog.confirmLabel"
      @click:confirm="actionDialog.action"
    >
      {{ actionDialog.description }}
    </vex-dialog>

    <vex-dialog
      v-model="memberInfoDialog.isOpen"
      :hide-buttons="memberInfoDialog.hideButtons"
      :title="memberInfoDialog.title"
      :button-true-text="$t('adminRouting.members.memberInfoDialog.submitBtn')"
      :button-false-text="$t('adminRouting.members.memberInfoDialog.reject')"
      @click:confirm="approveMemberInfoDialog(memberInfoDialog.data)"
      @click:cancel="rejectMemberInfoDialog(memberInfoDialog.data)"
    >
      <template v-if="memberInfoDialog.data">
        <d-info-block title="Personal information">
          <div>
            {{ $t('adminRouting.members.memberInfoDialog.name') }}
            {{ memberInfoDialog.data.firstName }}
          </div>
          <div>
            {{ $t('adminRouting.members.memberInfoDialog.lastName') }}
            {{ memberInfoDialog.data.lastName }}
          </div>
          <div>
            {{ $t('adminRouting.members.memberInfoDialog.birth') }}
            {{ memberInfoDialog.data.birthdate | dateFormat('MMMM DD YYYY', true) }}
          </div>
          <div>
            {{ $t('adminRouting.members.memberInfoDialog.id') }}
            {{ memberInfoDialog.data.foreignIds | joinByKey('id') }}
          </div>
        </d-info-block>

        <d-info-block title="Account information">
          <div>
            {{ $t('adminRouting.members.memberInfoDialog.email') }}
            <a :href="`mailto:${memberInfoDialog.data.email}`">{{ memberInfoDialog.data.email }}</a>
          </div>
          <div>
            {{ $t('adminRouting.members.memberInfoDialog.category') }}
            {{ memberInfoDialog.data.category }}
          </div>
        </d-info-block>

        <d-info-block title="Contact information">
          <div>
            {{ $t('adminRouting.members.memberInfoDialog.address') }}
            {{ memberInfoDialog.data.location ? memberInfoDialog.data.location.address : '' }}
          </div>
          <div>
            {{ $t('adminRouting.members.memberInfoDialog.city') }}
            {{ memberInfoDialog.data.location ? memberInfoDialog.data.location.city : '' }}
          </div>
          <div>
            {{ $t('adminRouting.members.memberInfoDialog.country') }}
            {{ memberInfoDialog.data.location ? memberInfoDialog.data.location.country : '' }}
          </div>
          <div>
            {{ $t('adminRouting.members.memberInfoDialog.phone') }}
            {{ memberInfoDialog.data.phoneNumbers | joinByKey('number') }}
          </div>
        </d-info-block>

        <d-info-block title="Occupation information" is-last>
          <div>
            {{ $t('adminRouting.members.memberInfoDialog.occupation') }}
            {{ memberInfoDialog.data.occupation }}
          </div>
          <div>
            {{ $t('adminRouting.members.memberInfoDialog.site') }}
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
    </vex-dialog>
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import CrudActions from '@/components/layout/CrudActions';
  import { TenantService } from '@deip/tenant-service';
  import { mapGetters } from 'vuex';
  import DInfoBlock from '@/components/Deipify/DInfoBlock/DInfoBlock';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminMembers',
    components: {
      DInfoBlock,
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
            text: this.$t('adminRouting.members.registeredTable.name'),
            value: 'name',
            sortable: false
          },
          {
            text: this.$t('adminRouting.members.registeredTable.since'),
            value: 'created_at',
            sortable: false
          },
          // {
          //   text: this.$t('adminRouting.members.registeredTable.category'),
          //   value: 'profile.category',
          //   sortable: false
          // },
          {
            text: this.$t('adminRouting.members.registeredTable.country'),
            value: 'profile.location.country',
            sortable: false
          }
        ],
        waitingMembersTableHeaders: [
          {
            text: this.$t('adminRouting.members.waitingTable.name'),
            value: 'name',
            sortable: false
          },
          {
            text: this.$t('adminRouting.members.waitingTable.date'),
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
          this.$setReady();
        });
    },

    methods: {

      openMemberInfoDialog(item) {
        // const person = item.profile ? item.profile : item;
        // this.memberInfoDialog.title = this.$options.filters.fullname({ profile: person });
        // this.memberInfoDialog.data = person;
        // this.memberInfoDialog.isOpen = true;
        // this.memberInfoDialog.hideButtons = !(item.status && item.status === 'pending');
        if (item.username === this.$currentUser.username) {
          this.$router.push({ name: 'account.summary' });
        } else {
          this.$router.push({ name: 'UserDetails', params: { account_name: item.username } });
        }
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
            title: this.$t('adminRouting.members.approveDialog.title'),
            description: this.$t('adminRouting.members.approveDialog.description'),
            confirmLabel: this.$t('adminRouting.members.approveDialog.submitBtn'),
            action: () => { this.approveRequest(username); }
          },
          reject: {
            title: this.$t('adminRouting.members.rejectDialog.title'),
            description: this.$t('adminRouting.members.rejectDialog.description'),
            confirmLabel: this.$t('adminRouting.members.rejectDialog.submitBtn'),
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
            this.$notifier.showSuccess(this.$t('adminRouting.members.approveRequest'));
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
            this.$notifier.showSuccess();
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
      }
    }
  };
</script>

<style scoped>
</style>
