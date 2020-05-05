<template>
  <admin-view title="Members">
    <template #toolbarAction>
      <v-btn outlined color="primary" :to="{name: 'admin.members.add'}">
        <v-icon left>person_add</v-icon>Add member
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
          <template v-slot:item.name="{ item }">{{item.firstName}} {{item.lastName}}</template>
        </v-data-table>
      </v-tab-item>

      <v-tab-item :transition="false" :reverse-transition="false">
        <v-data-table
          :headers="waitingMembersTableHeaders"
          :items="waitingMembers"
          @click:row="openMemberInfoDialog"
        >
          <template v-slot:top>
            <v-dialog v-model="dialogInfo.isOpen" max-width="420px">
              <v-card>
                <v-card-title>
                  <span class="headline">{{dialogInfo.data.title}}</span>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" icon @click="closeDialog">
                    <v-icon color="black">close</v-icon>
                  </v-btn>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text class="pt-5">
                  <div>{{dialogInfo.data.description}}</div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialogReject">Reject</v-btn>
                  <v-btn color="blue darken-1" text @click="dialogApprove">Approve</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <template v-slot:item.name="{ item }">{{item.firstName}} {{item.lastName}}</template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click.stop="openDialog('approve', item)">mdi-check</v-icon>
            <v-icon small @click.stop="openDialog('reject', item)">close</v-icon>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>

    <v-dialog v-model="memberInfoDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ `${memberInfo.firstName} ${memberInfo.lastName}` }}</span>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" icon @click="closeMemberInfoDialog">
            <v-icon color="black">close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <v-container>
            <div class="mb-6">
              <div class="title mb-2">Personal information</div>
              <div>Name: {{memberInfo.firstName}}</div>
              <div>Last name: {{memberInfo.lastName}}</div>
              <div>Date of birth: {{memberInfo.editedBirthdayDate}}</div>
              <div>ID: {{memberInfo.id}}</div>
            </div>

            <div class="mb-6">
              <div class="title mb-2">Account information</div>
              <div>Email: {{memberInfo.email}}</div>
              <div>Category: {{memberInfo.category}}</div>
            </div>

            <div class="mb-6">
              <div class="title mb-2">Contact information</div>
              <div>Address: {{memberInfo.address}}</div>
              <div>City: {{memberInfo.city}}</div>
              <div>Country: {{memberInfo.country}}</div>
              <div>Phone number: {{memberInfo.phoneNumber}}</div>
            </div>

            <div>
              <div class="title mb-2">Occupation information</div>
              <div>Occupation: {{memberInfo.occupation}}</div>
            </div>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="rejectMemberInfoDialog">Reject</v-btn>
          <v-btn color="blue darken-1" text @click="approveMemberInfoDialog">Approve</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <router-view name="dialog" />
  </admin-view>
</template>

<script>
import AdminView from "@/components/AdminPanel/AdminView";

export default {
  name: "AdminMembers",
  components: { AdminView },
  data() {
    return {
      tab: null,
      memberInfoDialog: false,
      deleteDialog: false,
      approveDialog: false,
      registerMembersTableHeaders: [
        { text: "Name", value: "name", sortable: false },
        { text: "Member since", value: "memberSince", sortable: false },
        { text: "Category", value: "category", sortable: false },
        { text: "Country", value: "country", sortable: false }
      ],
      waitingMembersTableHeaders: [
        { text: "Name", value: "name", sortable: false },
        {
          text: "Request date",
          value: "editedBirthdayDate",
          align: "center",
          sortable: false
        },
        { text: "", value: "actions", align: "right", sortable: false }
      ],
      registerMembers: [
        {
          memberSince: 159,
          country: 4.0,
          email: "qwe@qwe.qwe",
          firstName: "first",
          lastName: "last",
          editedBirthdayDate: "18.02.1824",
          username: "firstlast",
          id: "1232",
          category: "qwe",
          occupation: "asd",
          website: "zxc",
          address: "fdh",
          city: "tjh",
          country: "vbm",
          phoneNumber: "rty"
        },
        {
          memberSince: 159,
          country: 4.0,
          email: "qwe@qwe.qwe",
          firstName: "first",
          lastName: "last",
          editedBirthdayDate: "18.02.1824",
          username: "firstlast",
          id: "123",
          category: "qwe",
          occupation: "asd",
          website: "zxc",
          address: "fdh",
          city: "tjh",
          country: "vbm",
          phoneNumber: "rty"
        },
        {
          memberSince: 159,
          country: 4.0,
          email: "qwe@qwe.qwe",
          firstName: "first",
          lastName: "last",
          editedBirthdayDate: "18.02.1824",
          username: "firstlast",
          id: "1235",
          category: "qwe",
          occupation: "asd",
          website: "zxc",
          address: "fdh",
          city: "tjh",
          country: "vbm",
          phoneNumber: "rty"
        }
      ],
      waitingMembers: [
        {
          memberSince: 159,
          country: 4.0,
          email: "qwe@qwe.qwe",
          firstName: "first",
          lastName: "last",
          editedBirthdayDate: "18.02.1824",
          username: "firstlast",
          id: "1232",
          category: "qwe",
          occupation: "asd",
          website: "zxc",
          address: "fdh",
          city: "tjh",
          country: "vbm",
          phoneNumber: "rty"
        },
        {
          memberSince: 159,
          country: 4.0,
          email: "qwe@qwe.qwe",
          firstName: "first",
          lastName: "last",
          editedBirthdayDate: "18.02.1824",
          username: "firstlast",
          id: "123",
          category: "qwe",
          occupation: "asd",
          website: "zxc",
          address: "fdh",
          city: "tjh",
          country: "vbm",
          phoneNumber: "rty"
        },
        {
          memberSince: 159,
          country: 4.0,
          email: "qwe@qwe.qwe",
          firstName: "first",
          lastName: "last",
          editedBirthdayDate: "18.02.1824",
          username: "firstlast",
          id: "1235",
          category: "qwe",
          occupation: "asd",
          website: "zxc",
          address: "fdh",
          city: "tjh",
          country: "vbm",
          phoneNumber: "rty"
        }
      ],
      memberInfo: {},
      dialogTypeInfo: {
        approve: {
          title: "Approve request?",
          description:
            "Request will be approved and person will become a member"
        },
        reject: {
          title: "Decline request?",
          description:
            "Request will be declined and person will not become a member"
        }
      },
      dialogInfo: {
        isOpen: false,
        data: {},
        type: ""
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
      this.openDialog("reject");
    },
    approveMemberInfoDialog() {
      this.closeMemberInfoDialog();
      this.openDialog("approve");
    },
    dialogApprove() {
      if (this.dialogInfo.type === "approve") {
        console.log("approve approve");
      } else if (this.dialogInfo.type === "reject") {
        console.log("reject approve");
      }
      this.closeDialog();
    },
    dialogReject() {
      console.log("Reject");
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
