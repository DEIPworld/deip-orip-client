<template>
  <admin-view title="FAQ">
    <template #toolbarAction>
      <v-btn outlined color="primary" :to="{name: 'admin.faq.add'}">
        <v-icon left>
          add_comment
        </v-icon>
        Add question
      </v-btn>
    </template>

    <side-actions-card
      v-for="(item, i) in questions"
      :key="`${i}-questions`"
      :class="{'mb-6': (i + 1) < questions.length}"
    >
      <div class="subtitle-1 font-weight-medium">
        {{ item.title }}
      </div>
      {{ item.description }}

      <template #actions>
        <v-btn icon @click="openDialog('publish')">
          <v-icon>mdi-flag-outline</v-icon>
        </v-btn>
        <v-btn icon :to="{name: 'admin.faq.add', query:{id:item.id}}">
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn icon @click="openDialog('delete')">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </side-actions-card>

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
          <v-btn color="blue darken-1" text @click="dialogReject">
            Reject
          </v-btn>
          <v-btn color="blue darken-1" text @click="dialogApprove">
            Approve
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <router-view name="dialog" />
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import SideActionsCard from '@/components/layout/SideActionsCard';

  export default {
    name: 'AdminFAQ',
    components: { SideActionsCard, AdminView },

    data() {
      return {
        questions: [
          {
            title: 'How can I become a contractor?',
            description: 'You can sign up with us at ar3c.com/signup. Once we receive your application, we will review it and add you to our contractor list. You or your company will be invited on an as-needed basis by our project participants to complete their projects.',
            id: 1
          },
          {
            title: 'How can I become a contractor?',
            description: 'You can sign up with us at ar3c.com/signup. Once we receive your application, we will review it and add you to our contractor list. You or your company will be invited on an as-needed basis by our project participants to complete their projects.',
            id: 2
          },
          {
            title: 'How can I become a contractor?',
            description: 'You can sign up with us at ar3c.com/signup. Once we receive your application, we will review it and add you to our contractor list. You or your company will be invited on an as-needed basis by our project participants to complete their projects.',
            id: 3
          },
          {
            title: 'How can I become a contractor?',
            description: 'You can sign up with us at ar3c.com/signup. Once we receive your application, we will review it and add you to our contractor list. You or your company will be invited on an as-needed basis by our project participants to complete their projects.',
            id: 4
          }
        ],
        dialogTypeInfo: {
          publish: {
            title: 'Approve request?',
            description:
              'Request will be approved and person will become a member'
          },
          delete: {
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
      dialogApprove() {
        if (this.dialogInfo.type === 'publish') {
          console.log('publish approve');
        } else if (this.dialogInfo.type === 'delete') {
          console.log('delete approve');
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
