<template>
  <admin-view title="Attributes">
    <template #toolbarAction>
      <v-btn outlined color="primary" :to="{name: 'admin.attributes.edit'}">
        <v-icon left>
          extension
        </v-icon>
        Add attribute
      </v-btn>
    </template>
<!--    <pre>-->
<!--      {{researchAttributes[6]}}-->
<!--    </pre>-->

    <v-data-table
      :headers="attributesTable"
      :items="researchAttributes"
      :items-per-page="50"
    >

      <template #item.type="{ item }">
        <v-chip outlined>
          {{ ATTR_TYPES_LIST[item.type] ? ATTR_TYPES_LIST[item.type].text : 'undefined' }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <crud-actions row>
          <v-btn
            :color="item.isVisible ? 'success' : null"
            icon
            small
            @click="openActionDialog(item.isVisible ? 'unpublish' : 'publish', item._id)"
          >
            <v-icon>{{ item.isVisible ? 'flag' : 'outlined_flag' }}</v-icon>
          </v-btn>

          <template v-if="item.isEditable">
            <v-btn icon small :to="{name: 'admin.attributes.edit', query:{id:item._id}}">
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn icon small @click="openActionDialog('delete', item._id)">
              <v-icon>delete</v-icon>
            </v-btn>
          </template>
          <template v-else>
            <v-btn icon small disabled>
              <v-icon>lock</v-icon>
            </v-btn>
          </template>

        </crud-actions>
      </template>

    </v-data-table>


    <d-dialog
      v-model="actionDialog.isOpen"
      :title="actionDialog.title"
      :confirm-button-title="actionDialog.actionLabel"
      :loading="isDisabled"
      @click:confirm="actionDialog.action()"
    >
      {{ actionDialog.description }}
    </d-dialog>
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import { mapGetters } from 'vuex';
  import { TenantService } from '@deip/tenant-service';
  import { ATTR_TYPES, ATTR_TYPES_LIST } from '@/variables';
  import DDialog from '@/components/Deipify/DDialog/DDialog';
  import CrudActions from '@/components/layout/CrudActions';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminAttributes',
    components: {
      CrudActions,
      DDialog,
      AdminView
    },
    data() {
      return {
        ATTR_TYPES,
        ATTR_TYPES_LIST,

        isDisabled: false,

        actionDialog: {
          isOpen: false,
          description: null,
          actionLabel: null,
          action: () => false
        },

        attributesTable: [
          {
            text: 'Type',
            value: 'type',
            width: '1%'
          },
          {
            text: 'Title',
            value: 'title',
            width: '50%'
          },
          {
            text: 'Short Title',
            value: 'shortTitle',
            width: '50%'
          },
          {
            value: 'actions',
            width: '1%',
            // align: 'end'
          },
        ]
      };
    },
    computed: {
      ...mapGetters({
        tenant: 'auth/tenant',
        researchAttributes: 'adminPanel/researchAttributes'
      })
    },
    methods: {

      openActionDialog(type, researchAttributeId) {
        const types = {
          publish: {
            title: 'Publish criterion?',
            description: `Criterion will be set for each project and will appear on:
              - project page,
              - project application form,
              - explore page.
              `,
            actionLabel: 'publish',
            action: () => { this.publishCriteria(researchAttributeId); }

          },
          unpublish: {
            title: 'Unpublish criterion?',
            description: `Criterion will be removed from:
              - project page,
              - project application form,
              - explore page.
              `,
            actionLabel: 'unpublish',
            action: () => { this.unpublishCriteria(researchAttributeId); }

          },
          delete: {
            title: 'Delete criterion?',
            description: `Criterion will be deleted permanently and will be removed from:
              - project page,
              - project application form,
              - explore page.
              `,
            actionLabel: 'delete',
            action: () => { this.deleteCriteria(researchAttributeId); }

          }
        };

        this.actionDialog = {
          ...types[type],
          isOpen: true
        };
      },
      closeActionDialog() {
        this.actionDialog.isOpen = false;
        setTimeout(() => {
          this.actionDialog.data = {};
        }, 300);
      },
      publishCriteria(id) {
        const researchAttribute = this.researchAttributes.find((step) => step._id === id);
        tenantService.updateTenantResearchAttribute({ ...researchAttribute, isVisible: true })
          .then(() => {
            this.$notifier.showSuccess();
            const tenant = window.env.TENANT;
            this.$store.dispatch('auth/loadTenant', { tenant });
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError();
          })
          .finally(() => this.closeActionDialog());
      },
      unpublishCriteria(id) {
        const researchAttribute = this.researchAttributes.find((step) => step._id === id);
        tenantService.updateTenantResearchAttribute({ ...researchAttribute, isVisible: false })
          .then(() => {
            this.$notifier.showSuccess();
            const tenant = window.env.TENANT;
            this.$store.dispatch('auth/loadTenant', { tenant });
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError();
          })
          .finally(() => this.closeActionDialog());
      },
      deleteCriteria(id) {
        tenantService.deleteTenantResearchAttribute(id)
          .then(() => {
            this.$notifier.showSuccess();
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

<style scoped>

</style>
