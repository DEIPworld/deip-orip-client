<template>
  <d-layout-section>
    <d-layout-section-main>
      <d-block :title="$t('adminRouting.projects.title')">
        <template #titleAddon>
          <v-btn
            outlined
            small
            color="primary"
            :to="{name: 'research.create'}"
          >
            <v-icon left>
              mdi-file-document-outline
            </v-icon>
            {{ $t('adminRouting.projects.create') }}
          </v-btn>
        </template>

        <v-divider class="mb-6" />
        <v-skeleton-loader
          type="table-thead, table-tbody"
          :loading="!$ready"
        >
          <v-data-table
            v-custom="'hover-row'"

            :hide-default-footer="projects.length < 50"
            :footer-props="{itemsPerPageOptions: [5, 10, 20, 50, -1]}"
            :items-per-page="50"

            :headers="projectsHeaders"
            :items="projects"
            sort-by="created_at"
            sort-desc
          >
            <template #item="{ item }">
              <admin-projects-item-row
                :research="item"
                @click:delete="openActionDialog('delete', $event)"
                @click:edit="goToResearchEdit($event)"
              />
            </template>
          </v-data-table>
        </v-skeleton-loader>
      </d-block>

      <d-dialog
        v-model="researchDialog.isOpen"
        max-width="800"
        :cancel-button-title="$t('adminRouting.projects.researchDialog.reject')"
        :confirm-button-title="$t('adminRouting.projects.researchDialog.submitBtn')"
        @click:cancel="openActionDialog('reject', researchDialog.data._id)"
        @click:confirm="openActionDialog('approve', researchDialog.data._id)"
      >
        <research-request-form-read
          :key="researchDialog.data._id"
          get-from="adminPanel/pendingProjects"
          :research-id="researchDialog.data._id"
        />
      </d-dialog>

      <d-dialog
        v-model="actionDialog.isOpen"
        :title="actionDialog.title"
        :confirm-button-title="actionDialog.actionLabel"
        :loading="isDisabled"
        @click:confirm="actionDialog.action()"
      >
        {{ actionDialog.description }}
      </d-dialog>
    </d-layout-section-main>
  </d-layout-section>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import { mapGetters } from 'vuex';
  import CrudActions from '@/components/layout/CrudActions';
  import ResearchRequestFormRead from '@/components/ResearchRequest/ResearchRequestRead/ResearchRequestRead';

  import { ResearchService } from '@deip/research-service';
  import { TenantService } from '@deip/tenant-service';
  import DDialog from '@/components/Deipify/DDialog/DDialog';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import AdminProjectsItemRow from '@/components/AdminPanel/Projects/Item/AdminProjectsItemRow';

  const researchService = ResearchService.getInstance();
  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminProjects',
    components: {
      AdminProjectsItemRow,
      DBlock,
      DLayoutSection,
      DLayoutSectionMain,
      DDialog,
      ResearchRequestFormRead
    },
    data() {
      return {
        tab: null,
        isDisabled: false,

        researchDialog: {
          isOpen: false,
          data: {}
        },

        actionDialog: {
          isOpen: false,
          title: null,
          description: null,
          actionLabel: null,
          data: {},
          action: () => false
        }
      };
    },
    computed: {
      ...mapGetters({
        projects: 'adminPanel/publicProjects',
        user: 'auth/user',
        tenant: 'auth/tenant'
      }),

      projectsHeaders() {
        const { layout } = this.$tenantSettings.researchLayouts.AdminProjectListRow;
        const row = _.cloneDeep(layout[0]);

        if (row) {
          return [
            ...row.children.map((cell) => ({
              text: cell.attrs && cell.attrs.title ? cell.attrs.title : ''
            })),
            ...[{}]
          ];
        }

        return [];
      }
    },

    created() {
      this.$store.dispatch('adminPanel/getAllProjects')
        .then(() => {
          this.$setReady();
        });
    },

    methods: {
      goToResearchEdit(id) {
        this.$router.push({
          name: 'research.edit',
          params: {
            researchExternalId: id
          }
        });
      },

      // approveResearchApplication(proposalId) {
      //   this.isDisabled = true;
      //
      //   researchService.approveResearchApplicationViaOffchain(this.user.privKey, {
      //     proposalId,
      //     tenant: this.tenant.account.external_id
      //   })
      //     .then(() => {
      //       this.finishAction();
      //     })
      //     .catch((err) => {
      //       console.error(err);
      //     });
      // },

      // rejectResearchApplication(proposalId) {
      //   this.isDisabled = true;
      //
      //   researchService.rejectResearchApplicationViaOffchain(this.user.privKey, {
      //     proposalId,
      //     tenant: this.tenant.account.external_id
      //   })
      //     .then(() => {
      //       this.finishAction();
      //     })
      //     .catch((err) => {
      //       console.error(err);
      //     });
      // },

      deleteResearchApplication(id) {
        const updatedProfile = _.cloneDeep(this.tenant.profile);
        this.isDisabled = true;

        if (id) {
          updatedProfile.settings.researchBlacklist.push(id);
        }

        tenantService.updateTenantProfile(updatedProfile)
          .then(() => {
            this.finishAction();

            this.$notifier.showSuccess();
            this.$store.dispatch('adminPanel/getAllProjects');
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError();
          });
      },

      openActionDialog(type, id) {
        if (this.researchDialog.isOpen) {
          this.researchDialog.isOpen = false;
        }

        const types = {
          approve: {
            title: this.$t('adminRouting.projects.approveDialog.title'),
            description: this.$t('adminRouting.projects.approveDialog.description'),
            actionLabel: this.$t('adminRouting.projects.approveDialog.submitBtn'),
            action: () => { this.approveResearchApplication(id); }
          },
          reject: {
            title: this.$t('adminRouting.projects.rejectDialog.title'),
            description: this.$t('adminRouting.projects.rejectDialog.description'),
            actionLabel: this.$t('adminRouting.projects.rejectDialog.submitBtn'),
            action: () => { this.rejectResearchApplication(id); }
          },
          delete: {
            title: this.$t('adminRouting.projects.deleteDialog.title'),
            description: this.$t('adminRouting.projects.deleteDialog.description'),
            actionLabel: this.$t('adminRouting.projects.deleteDialog.submitBtn'),
            action: () => { this.deleteResearchApplication(id); }
          }
        };

        this.actionDialog = {
          ...types[type],
          isOpen: true
        };
      },

      openResearchDialog(item) {
        this.researchDialog.data = item;
        this.researchDialog.isOpen = true;
      },

      finishAction() {
        this.$store.dispatch('adminPanel/getAllProjects').then(() => {
          this.isDisabled = false;
          this.actionDialog.isOpen = false;
        });
      }
    }
  };
</script>
