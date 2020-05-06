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

    <v-dialog v-model="actionDialog.isOpen" max-width="420px" scrollable>
      <v-card>
        <v-card-title>
          <span class="headline">{{ actionDialog.data.title }}</span>
          <v-spacer />
          <v-btn
            small
            icon
            class="mr-n2"
            @click="closeActionDialog"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="text--primary pt-5">
          {{ actionDialog.data.description }}
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            v-for="(action, index) of actionDialog.data.actions"
            :key="index"
            color="primary"
            text
            @click="action.method ? action.method(actionDialog.data.title) : closeActionDialog()"
          >
            {{ action.title }}
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
    name: 'AdminCriteria',
    components: {
      SideActionsCard,
      AdminView
    },
    data() {

      const actionDialogDefaults = {
        title: ' ',
        description: ' ',
        actions: [
          {
            title: 'close'
          }
        ]
      };

      return {
        actionDialogDefaults,
        actionDialog: {
          isOpen: false,
          data: actionDialogDefaults,
          types: {
            publish: {
              title: 'publish',
              description: 'Criterion will be set for each project and will appear on: project page, project request form.',
              actions: [
                {
                  title: 'close'
                },
                {
                  title: 'publish',
                  method: this.publishCriteria
                }
              ]
            },
            unpublish: {
              title: 'unpublish',
              description: 'Criterion will be removed from: project page, project request form.',
              actions: [
                {
                  title: 'close'
                },
                {
                  title: 'publish',
                  method: this.unpublishCriteria
                }
              ]
            },
            delete: {
              title: 'delete',
              description: 'Criterion will be deleted permanently.',
              actions: [
                {
                  title: 'close'
                },
                {
                  title: 'publish',
                  method: this.deleteCriteria
                }
              ]
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
          this.actionDialog.data = this.actionDialogDefaults;
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
