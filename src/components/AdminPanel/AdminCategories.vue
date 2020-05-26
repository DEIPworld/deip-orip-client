<template>
  <admin-view title="Project categories">
    <template #toolbarAction>
      <v-btn outlined color="primary" :to="{name: 'admin.categories.add'}">
        <v-icon left>category</v-icon>Create catergory
      </v-btn>
    </template>

    <v-data-table
      :headers="categoriesTableHeader"
      :items="categories"
    >
      <template v-slot:item.actions="{ item }">
        <crud-actions row>
          <v-btn icon small @click.stop="openActionDialog('delete', item._id)">
            <v-icon>delete</v-icon>
          </v-btn>
        </crud-actions>
      </template>
    </v-data-table>

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
          @click="actionDialog.data.action.method(actionDialog.data.categoryId)"
        >{{ actionDialog.data.action.title }}</v-btn>
      </template>
    </action-dialog>

  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import CrudActions from '@/components/layout/CrudActions';
  import ActionDialog from '@/components/layout/ActionDialog';
  import { mapGetters } from 'vuex';
  import { TenantService } from '@deip/tenant-service';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminCategories',
    components: { CrudActions, AdminView, ActionDialog },
    data() {
      return {
        categoriesTableHeader: [
          {
            text: 'Name',
            value: 'text',
            sortable: false
          },
          {
            text: 'Assigned projects',
            value: 'assignedProjects',
            align: 'center',
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
          data: {},
          types: {
            delete: {
              title: 'Delete category?',
              description:
                `Category  will be deleted permanently.
                Assigned projects will stay without category`,
              action: {
                title: 'Delete category',
                method: this.deleteCategory
              }
            }
          }
        }
      };
    },

    computed: {
      ...mapGetters({
        tenant: 'auth/tenant',
        categories: 'adminPanel/categories'
      })
    },

    methods: {
      openActionDialog(type, item) {
        this.actionDialog.isOpen = true;
        this.actionDialog.data = this.actionDialog.types[type];
        this.actionDialog.data.categoryId = item;
      },
      closeActionDialog() {
        this.actionDialog.isOpen = false;
        setTimeout(() => {
          this.actionDialog.data = {};
        }, 300);
      },
      deleteCategory(categoryId) {
        const updatedCategories = this.categories.filter(({ _id }) => _id !== categoryId);

        const updatedProfile = _.cloneDeep(this.tenant.profile);
        updatedProfile.settings.researchCategories = updatedCategories;
        tenantService.updateTenantProfile(updatedProfile)
          .then(() => {
            this.$store.dispatch('layout/setSuccess', { message: 'Successfully' });
            const tenant = window.env.TENANT;
            this.$store.dispatch('auth/loadTenant', { tenant });
          })
          .catch((err) => {
            console.error(err);
            this.$store.dispatch('layout/setError', {
              message: 'An error occurred while sending the request, please try again later.'
            });
          })
          .finally(() => this.closeActionDialog());
      }
    }
  };
</script>