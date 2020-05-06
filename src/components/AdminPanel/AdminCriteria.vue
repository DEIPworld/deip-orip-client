<template>
  <admin-view title="Criteria">
    <template #toolbarAction>
      <v-btn outlined color="primary" :to="{name: 'admin.faq.add'}">
        <v-icon left>
          extension
        </v-icon>
        Add criteria
      </v-btn>
    </template>

    <side-actions-card>
      <template #actions>
        <v-btn icon @click="openActionDialog('unpublish')">
          <v-icon>flag</v-icon>
        </v-btn>
        <v-btn icon @click="openActionDialog('publish')">
          <v-icon>outlined_flag</v-icon>
        </v-btn>
        <v-btn icon @click="">
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
        <v-btn
          color="primary"
          text
          @click="closeActionDialog"
        >
          cancel
        </v-btn>
        <v-btn
          v-if="actionDialog.data.action"
          color="primary"
          text
          @click="actionDialog.data.action.method(actionDialog.data.title)"
        >
          {{ actionDialog.data.action.title }}
        </v-btn>
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
    name: 'AdminCriteria',
    components: {
      ActionDialog,
      SideActionsCard,
      AdminView
    },
    data() {
      return {
        actionDialog: {
          isOpen: false,
          data: {},
          types: {
            publish: {
              title: 'Publish criterion?',
              description: 'Criterion will be set for each project and will appear on: project page, project request form.',
              action: {
                title: 'publish',
                method: this.publishCriteria
              }
            },
            unpublish: {
              title: 'Unpublish criterion?',
              description: 'Criterion will be removed from: project page, project request form.',
              action: {
                title: 'unpublish',
                method: this.unpublishCriteria
              }
            },
            delete: {
              title: 'Delete criterion?',
              description: 'Criterion will be deleted permanently.',
              action: {
                title: 'delete',
                method: this.deleteCriteria
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
      publishCriteria(item) {
        console.log(item);
        this.closeActionDialog();
      },
      unpublishCriteria(item) {
        console.log(item);
        this.closeActionDialog();
      },
      deleteCriteria(item) {
        console.log(item);
        this.closeActionDialog();
      }
    }
  };
</script>

<style scoped>

</style>
