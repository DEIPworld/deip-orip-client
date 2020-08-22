<template>
  <admin-view title="Criteria">
    <template #toolbarAction>
      <v-btn outlined color="primary" :to="{name: 'admin.criteria.add'}">
        <v-icon left>
          extension
        </v-icon>
        Add criterion
      </v-btn>
    </template>

    <side-actions-card v-for="(item, i) in researchAttributes" :key="`${i}-stepper`" class="mb-6">
      <div class="text-subtitle-1 font-weight-medium mb-4">
        {{ item.title }}
      </div>

      <leveller-list-expander :data="item.valueOptions" />

      <template #actions>
        <v-btn
          :color="item.isVisible ? 'success' : null"
          icon
          @click="openActionDialog(item.isVisible ? 'unpublish' : 'publish', item._id)"
        >
          <v-icon>{{ item.isVisible ? 'flag' : 'outlined_flag' }}</v-icon>
        </v-btn>
        <v-btn icon :to="{name: 'admin.criteria.add', query:{id:item._id}}">
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn icon @click="openActionDialog('delete', item._id)">
          <v-icon>delete</v-icon>
        </v-btn>
      </template>
    </side-actions-card>

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
  import SideActionsCard from '@/components/layout/SideActionsCard';
  import LevellerListExpander from '@/components/Leveller/LevellerListExpander';
  import { mapGetters } from 'vuex';
  import { TenantService } from '@deip/tenant-service';
  import DDialog from '@/components/Deipify/DDialog/DDialog';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminCriteria',
    components: {
      DDialog,
      LevellerListExpander,
      SideActionsCard,
      AdminView
    },
    data() {
      return {
        isDisabled: false,

        actionDialog: {
          isOpen: false,
          description: null,
          actionLabel: null,
          action: () => false
        }
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
