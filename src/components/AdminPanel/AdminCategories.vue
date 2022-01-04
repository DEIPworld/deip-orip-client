<template>
  <admin-view :title="$t('adminRouting.categories.title')">
    <template #toolbarAction>
      <v-btn outlined color="primary" :to="{name: 'admin.categories.add'}">
        <v-icon left>
          category
        </v-icon>{{ $t('adminRouting.categories.create') }}
      </v-btn>
    </template>

    <v-data-table
      v-custom="'hover-row'"

      :hide-default-footer="categories.length < 50"
      :footer-props="{itemsPerPageOptions: [5, 10, 20, 50, -1]}"
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

    <vex-dialog
      v-model="actionDialog.isOpen"
      :title="actionDialog.title"
      :button-true-text="actionDialog.actionLabel"
      @click:confirm="actionDialog.action()"
    >
      {{ actionDialog.description }}
    </vex-dialog>
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import CrudActions from '@/components/layout/CrudActions';
  import { mapGetters } from 'vuex';
  import { PortalService } from '@deip/portal-service';

  const portalService = PortalService.getInstance();

  export default {
    name: 'AdminCategories',
    components: { CrudActions, AdminView },
    data() {
      return {
        xxx: true,

        categoriesTableHeader: [
          {
            text: this.$t('adminRouting.categories.categoriesTable.name'),
            value: 'text',
            sortable: false
          },
          {
            text: this.$t('adminRouting.categories.categoriesTable.projects'),
            value: 'projectCount',
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
        categories: 'adminPanel/categories'
      })
    },

    methods: {
      openActionDialog(type, item) {
        const types = {
          delete: {
            title: this.$t('adminRouting.categories.deleteDialog.title'),
            description: this.$t('adminRouting.categories.deleteDialog.description'),
            actionLabel: this.$t('adminRouting.categories.deleteDialog.submitBtn'),
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

        const updatedProfile = _.cloneDeep(this.$portal.profile);
        updatedProfile.settings.projectCategories = updatedCategories;
        portalService.updatePortalProfile(updatedProfile)
          .then(() => {
            this.$notifier.showSuccess();
            const portal = window.env.TENANT;
            this.$store.dispatch('auth/loadPortal', { portal });
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
