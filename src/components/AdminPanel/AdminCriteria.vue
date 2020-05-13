<template>
  <admin-view title="Criteria">
    <template #toolbarAction>
      <v-btn outlined color="primary" :to="{name: 'admin.criteria.add'}">
        <v-icon left>
          extension
        </v-icon>
        Add criteria
      </v-btn>
    </template>

    <side-actions-card v-for="(item, i) in researchComponents" :key="`${i}-stepper`" class="mb-6">
      <div class="subtitle-1 font-weight-medium mb-4">
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
          @click="actionDialog.data.action.method(actionDialog.data.researchComponentsId)"
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
  import LevellerListExpander from '@/components/Leveller/LevellerListExpander';
  import LevellerSelector from '@/components/Leveller/LevellerSelector';
  import { mapGetters } from 'vuex';
  import { TenantService } from '@deip/tenant-service';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminCriteria',
    components: {
      LevellerSelector,
      LevellerListExpander,
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
      },
      openActionDialog(type, researchComponentsId) {
        this.actionDialog.isOpen = true;
        this.actionDialog.data = this.actionDialog.types[type];
        this.actionDialog.data.researchComponentsId = researchComponentsId;
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
            return { ...step, isVisible: true };
          } else {
            return step;
          }
        });
        this.updateResearchComponents(updateResearchComponents);
      },
      unpublishCriteria(id) {
        const updateResearchComponents = this.researchComponents.map((step) => {
          if (step._id === id) {
            return { ...step, isVisible: false };
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
