<template>
  <admin-view title="Project categories">
    <template #toolbarAction>
      <v-btn outlined color="primary" :to="{name: 'admin.categories.add'}">
        <v-icon left>
          category
        </v-icon>Create catergory
      </v-btn>
    </template>

    <v-data-table
      v-custom="'hover-row'"

      :hide-default-header="categories.length > 50"
      :footer-props="{itemsPerPageOptions: [5, 10, 20, -1]}"
      :items-per-page="50"

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

    <d-dialog
      v-model="actionDialog.isOpen"
      :title="actionDialog.title"
      :confirm-button-title="actionDialog.actionLabel"
      @click:confirm="actionDialog.action()"
    >
      {{ actionDialog.description }}
    </d-dialog>
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import CrudActions from '@/components/layout/CrudActions';
  import { mapGetters } from 'vuex';
  import { TenantService } from '@deip/tenant-service';
  import DDialog from '@/components/Deipify/DDialog/DDialog';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminCategories',
    components: { DDialog, CrudActions, AdminView },
    data() {
      return {
        xxx: true,

        categoriesTableHeader: [
          {
            text: 'Name',
            value: 'text',
            sortable: false
          },
          {
            text: 'Assigned projects',
            value: 'researchCount',
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
          title: null,
          description: null,
          actionLabel: null,
          action: () => false
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
        const types = {
          delete: {
            title: 'Delete category?',
            description: `Category  will be deleted permanently.
              Assigned projects will stay without category
            `,
            actionLabel: 'Delete',
            action: () => { this.deleteCategory(item); }
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
      deleteCategory(categoryId) {
        const updatedCategories = this.categories.filter(({ _id }) => _id !== categoryId);

        const updatedProfile = _.cloneDeep(this.tenant.profile);
        updatedProfile.settings.researchCategories = updatedCategories;
        tenantService.updateTenantProfile(updatedProfile)
          .then(() => {
            this.$notifier.showSuccess()
            const tenant = window.env.TENANT;
            this.$store.dispatch('auth/loadTenant', { tenant });
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError();
          })
          .finally(() => this.closeActionDialog());
      }
    }
  };
</script>
