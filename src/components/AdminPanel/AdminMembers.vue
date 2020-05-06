<template>
  <admin-view title="Members">
    <template #toolbarAction>
      <v-btn outlined color="primary" :to="{name: 'admin.members.add'}">
        <v-icon left>
          person_add
        </v-icon>
        Add member
      </v-btn>
    </template>

    <template #toolbarExtension>
      <v-tabs v-model="tab">
        <v-tab>Registered</v-tab>
        <v-tab>
          Waiting for approval
          <v-badge :content="waitingMembers.length" color="green" inline />
        </v-tab>
      </v-tabs>
    </template>

    <v-tabs-items v-model="tab">
      <v-tab-item :transition="false" :reverse-transition="false">
        <v-data-table
          :headers="registerMembersTableHeaders"
          :items="registerMembers"
          @click:row="openMemberInfoDialog"
        >
          <template v-slot:item.name="{ item }">
            {{ item.firstName }} {{ item.lastName }}
          </template>
        </v-data-table>
      </v-tab-item>

      <v-tab-item :transition="false" :reverse-transition="false">
        <v-data-table
          :headers="waitingMembersTableHeaders"
          :items="waitingMembers"
          @click:row="openMemberInfoDialog"
        >
          <template v-slot:item.name="{ item }">
            {{ item.firstName }} {{ item.lastName }}
          </template>

          <template v-slot:item.actions="{ item }">
            <crud-actions row>
              <v-btn icon small @click.stop="openDialog('approve', item)">
                <v-icon>mdi-check</v-icon>
              </v-btn>
              <v-btn icon small @click.stop="openDialog('reject', item)">
                <v-icon>close</v-icon>
              </v-btn>
            </crud-actions>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>

    <v-dialog v-model="dialogInfo.isOpen" max-width="420px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogInfo.data.title }}</span>
          <v-spacer />
          <v-btn
            small
            icon
            class="mr-n2"
            @click="closeDialog"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-5">
          <div>{{ dialogInfo.data.description }}</div>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="dialogReject">
            Reject
          </v-btn>
          <v-btn color="primary" text @click="dialogApprove">
            Approve
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="memberInfoDialog" max-width="420px" scrollable>
      <v-card>
        <v-card-title>
          <span class="headline">{{ `${memberInfo.firstName} ${memberInfo.lastName}` }}</span>
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
            <div>Name: {{ memberInfo.firstName }}</div>
            <div>Last name: {{ memberInfo.lastName }}</div>
            <div>Date of birth: {{ memberInfo.editedBirthdayDate }}</div>
            <div>ID: {{ memberInfo.id }}</div>
          </div>

          <div class="mb-6">
            <div class="subtitle-1 font-weight-medium mb-2">
              Account information
            </div>
            <div>Email: {{ memberInfo.email }}</div>
            <div>Category: {{ memberInfo.category }}</div>
          </div>

          <div class="mb-6">
            <div class="subtitle-1 font-weight-medium mb-2">
              Contact information
            </div>
            <div>Address: {{ memberInfo.address }}</div>
            <div>City: {{ memberInfo.city }}</div>
            <div>Country: {{ memberInfo.country }}</div>
            <div>Phone number: {{ memberInfo.phoneNumber }}</div>
          </div>

          <div class="mb-6">
            <div class="subtitle-1 font-weight-medium mb-2">
              Occupation information
            </div>
            <div>Occupation: {{ memberInfo.occupation }}</div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <router-view name="dialog" />
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import CrudActions from '@/components/layout/CrudActions';

  export default {
    name: 'AdminMembers',
    components: { CrudActions, AdminView },
    data() {
      return {
        tab: null,
        memberInfoDialog: false,
        deleteDialog: false,
        approveDialog: false,
        registerMembersTableHeaders: [
          {
            text: 'Name',
            value: 'name',
            sortable: false
          },
          {
            text: 'Member since',
            value: 'memberSince',
            sortable: false
          },
          {
            text: 'Category',
            value: 'category',
            sortable: false
          },
          {
            text: 'Country',
            value: 'country',
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
            value: 'editedBirthdayDate',
            sortable: false
          },
          {
            text: '',
            value: 'actions',
            align: 'right',
            sortable: false
          }
        ],
        registerMembers: [
          {
            memberSince: 159,
            email: 'qwe@qwe.qwe',
            firstName: 'first',
            lastName: 'last',
            editedBirthdayDate: '18.02.1824',
            username: 'firstlast',
            id: '1232',
            category: 'qwe',
            occupation: 'asd',
            website: 'zxc',
            address: 'fdh',
            city: 'tjh',
            country: 'vbm',
            phoneNumber: 'rty'
          },
          {
            memberSince: 159,
            email: 'qwe@qwe.qwe',
            firstName: 'first',
            lastName: 'last',
            editedBirthdayDate: '18.02.1824',
            username: 'firstlast',
            id: '123',
            category: 'qwe',
            occupation: 'asd',
            website: 'zxc',
            address: 'fdh',
            city: 'tjh',
            country: 'vbm',
            phoneNumber: 'rty'
          },
          {
            memberSince: 159,
            email: 'qwe@qwe.qwe',
            firstName: 'first',
            lastName: 'last',
            editedBirthdayDate: '18.02.1824',
            username: 'firstlast',
            id: '1235',
            category: 'qwe',
            occupation: 'asd',
            website: 'zxc',
            address: 'fdh',
            city: 'tjh',
            country: 'vbm',
            phoneNumber: 'rty'
          }
        ],
        waitingMembers: [
          {
            memberSince: 159,
            email: 'qwe@qwe.qwe',
            firstName: 'first',
            lastName: 'last',
            editedBirthdayDate: '18.02.1824',
            username: 'firstlast',
            id: '1232',
            category: 'qwe',
            occupation: 'asd',
            website: 'zxc',
            address: 'fdh',
            city: 'tjh',
            country: 'vbm',
            phoneNumber: 'rty'
          },
          {
            memberSince: 159,
            email: 'qwe@qwe.qwe',
            firstName: 'first',
            lastName: 'last',
            editedBirthdayDate: '18.02.1824',
            username: 'firstlast',
            id: '123',
            category: 'qwe',
            occupation: 'asd',
            website: 'zxc',
            address: 'fdh',
            city: 'tjh',
            country: 'vbm',
            phoneNumber: 'rty'
          },
          {
            memberSince: 159,
            email: 'qwe@qwe.qwe',
            firstName: 'first',
            lastName: 'last',
            editedBirthdayDate: '18.02.1824',
            username: 'firstlast',
            id: '1235',
            category: 'qwe',
            occupation: 'asd',
            website: 'zxc',
            address: 'fdh',
            city: 'tjh',
            country: 'vbm',
            phoneNumber: 'rty'
          }
        ],
        memberInfo: {},
        dialogTypeInfo: {
          approve: {
            title: 'Approve request?',
            description:
              'Request will be approved and person will become a member'
          },
          reject: {
            title: 'Decline request?',
            description:
              'Request will be declined and person will not become a member'
          }
        },
        dialogInfo: {
          isOpen: false,
          data: {},
          type: ''
        }
      };
    },

    methods: {
      openMemberInfoDialog(item) {
        this.memberInfo = item;
        this.memberInfoDialog = true;
      },
      closeMemberInfoDialog() {
        this.memberInfoDialog = false;
      },
      rejectMemberInfoDialog() {
        this.closeMemberInfoDialog();
        this.openDialog('reject');
      },
      approveMemberInfoDialog() {
        this.closeMemberInfoDialog();
        this.openDialog('approve');
      },
      dialogApprove() {
        if (this.dialogInfo.type === 'approve') {
          console.log('approve approve');
        } else if (this.dialogInfo.type === 'reject') {
          console.log('reject approve');
        }
        this.closeDialog();
      },
      dialogReject() {
        console.log('Reject');
        this.closeDialog();
      },
      closeDialog() {
        this.dialogInfo.isOpen = false;
      },
      openDialog(dialogType) {
        this.dialogInfo.isOpen = true;
        this.dialogInfo.data = this.dialogTypeInfo[dialogType];
        this.dialogInfo.type = dialogType;
      }
    }
  };
</script>

<style scoped>
</style>
