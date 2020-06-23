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

    <side-actions-card v-for="(item, i) in researchComponents" :key="`${i}-stepper`" class="mb-6">
      <div class="text-subtitle-1 font-weight-medium mb-4">
        {{ item.component.readinessLevelTitle }}
      </div>

      <leveller-list-expander :data="item.component.readinessLevels" />

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
        researchComponents: 'adminPanel/researchComponents'
      })
    },
    methods: {
      updateResearchComponents(updatedResearchComponents) {
        const updatedProfile = _.cloneDeep(this.tenant.profile);
        updatedProfile.settings.researchComponents = updatedResearchComponents;
        tenantService.updateTenantProfile(updatedProfile)
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

      openActionDialog(type, researchComponentsId) {
        const types = {
          publish: {
            title: 'Publish criterion?',
            description: `Criterion will be set for each project and will appear on:
              - project page,
              - project application form,
              - explore page.
              `,
            actionLabel: 'publish',
            action: () => { this.publishCriteria(researchComponentsId) }

          },
          unpublish: {
            title: 'Unpublish criterion?',
            description: `Criterion will be removed from:
              - project page,
              - project application form,
              - explore page.
              `,
            actionLabel: 'unpublish',
            action: () => { this.unpublishCriteria(researchComponentsId) }

          },
          delete: {
            title: 'Delete criterion?',
            description: `Criterion will be deleted permanently and will be removed from:
              - project page,
              - project application form,
              - explore page.
              `,
            actionLabel: 'delete',
            action: () => { this.deleteCriteria(researchComponentsId) }

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
        const updateResearchComponents = this.researchComponents.map((step) => {
          if (step._id === id) {
            return {
              ...step,
              isVisible: true
            };
          } else {
            return step;
          }
        });
        this.updateResearchComponents(updateResearchComponents);
      },
      unpublishCriteria(id) {
        const updateResearchComponents = this.researchComponents.map((step) => {
          if (step._id === id) {
            return {
              ...step,
              isVisible: false
            };
          } else {
            return step;
          }
        });
        this.updateResearchComponents(updateResearchComponents);
      },
      deleteCriteria(id) {
        const updateResearchComponents = this.researchComponents.filter(({ _id }) => _id !== id);
        this.updateResearchComponents(updateResearchComponents);
      }
    }
  };
</script>

<style scoped>

</style>
