<template>
  <admin-view title="FAQ">
    <template #toolbarAction>
      <v-btn outlined color="primary" :to="{name: 'admin.faq.add'}">
        <v-icon left>add_comment</v-icon>Add question
      </v-btn>
    </template>

    <side-actions-card
      v-for="(item, i) in questions"
      :key="`${i}-questions`"
      :class="{'mb-6': (i + 1) < questions.length}"
    >
      <div class="subtitle-1 font-weight-medium">{{ item.question }}</div>

      {{ item.answer }}
      <template #actions>
        <v-btn :color="item.isVisible ? 'success' : null" icon @click="openActionDialog('publish')">
          <v-icon>{{ item.isVisible ? 'flag' : 'outlined_flag' }}</v-icon>
        </v-btn>
        <v-btn icon :to="{name: 'admin.faq.add', query:{id:item.id}}">
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn icon @click="openActionDialog('delete')">
          <v-icon>delete</v-icon>
        </v-btn>
      </template>
    </side-actions-card>

    <action-dialog
      :open="actionDialog.isOpen"
      :title="actionDialog.data.title"
      @close="closeActionDialog"
    >
      {{ actionDialog.data.description }}
      <template #actions>
        <v-btn color="primary" text @click="closeActionDialog">cancel</v-btn>
        <v-btn
          v-if="actionDialog.data.action"
          color="primary"
          text
          @click="actionDialog.data.action.method(actionDialog.data.title)"
        >{{ actionDialog.data.action.title }}</v-btn>
      </template>
    </action-dialog>

    <router-view name="dialog" />
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import SideActionsCard from '@/components/layout/SideActionsCard';
  import ActionDialog from '@/components/layout/ActionDialog';

  export default {
    name: 'AdminFAQ',
    components: { SideActionsCard, AdminView, ActionDialog },

    data() {
      return {
        questions: [
          {
            question: 'How can I become a contractor?',
            answer:
              'You can sign up with us at ar3c.com/signup. Once we receive your application, we will review it and add you to our contractor list. You or your company will be invited on an as-needed basis by our project participants to complete their projects.',
            id: 1,
            isVisible: false
          },
          {
            question: 'How can I become a contractor?',
            answer:
              'You can sign up with us at ar3c.com/signup. Once we receive your application, we will review it and add you to our contractor list. You or your company will be invited on an as-needed basis by our project participants to complete their projects.',
            id: 2,
            isVisible: true
          },
          {
            question: 'How can I become a contractor?',
            answer:
              'You can sign up with us at ar3c.com/signup. Once we receive your application, we will review it and add you to our contractor list. You or your company will be invited on an as-needed basis by our project participants to complete their projects.',
            id: 3,
            isVisible: false
          },
          {
            question: 'How can I become a contractor?',
            answer:
              'You can sign up with us at ar3c.com/signup. Once we receive your application, we will review it and add you to our contractor list. You or your company will be invited on an as-needed basis by our project participants to complete their projects.',
            id: 4,
            isVisible: true
          }
        ],
        actionDialog: {
          isOpen: false,
          data: {},
          types: {
            publish: {
              title: 'Publish  Q&A',
              description:
                'Request will be approved and person will become a member',
              action: {
                title: 'approve',
                method: this.publishFAQ
              }
            },
            unpublish: {
              title: 'Unpublish Q&A',
              description:
                'Request will be approved and person will become a member',
              action: {
                title: 'approve',
                method: this.unpublishFAQ
              }
            },
            delete: {
              title: 'Delete Q&A',
              description: 'Request will be approved and person will become a member',
              action: {
                title: 'approve',
                method: this.deleteFAQ
              }
            }
          }
        }
      };
    },
    methods: {
      openActionDialog(type, item) {
        this.actionDialog.isOpen = true;
        this.actionDialog.data = this.actionDialog.types[type];
      },
      closeActionDialog() {
        this.actionDialog.isOpen = false;
        setTimeout(() => {
          this.actionDialog.data = {};
        }, 300);
      },
      publishFAQ(item) {
        console.log(item);
        this.closeActionDialog();
      },
      unpublishFAQ(item) {
        console.log(item);
        this.closeActionDialog();
      },
      deleteFAQ(item) {
        console.log(item);
        this.closeActionDialog();
      }
    }
  };
</script>

<style scoped>
</style>
