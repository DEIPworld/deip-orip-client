<template>
  <admin-view v-if="$ready" title="Projects">
    <template #toolbarExtension>
      <v-tabs v-model="tab">
        <v-tab>All projects</v-tab>
        <v-tab>
          Waiting for approval
          <v-badge
            v-if="pendingProjects.length"
            :content="pendingProjects.length"
            color="green"
            inline
          />
        </v-tab>
      </v-tabs>
    </template>

    <v-tabs-items v-model="tab">
      <v-tab-item :transition="false" :reverse-transition="false">
        <v-data-table
          v-custom="'hover-row'"
          :headers="publicProjectsHeaders"
          :items="publicProjects"
          :items-per-page="50"
          sort-by="created_at"
          sort-desc
          @click:row="goToResearch"
        >
          <template #item.created_at="{item}">
            <div class="text-no-wrap">
              {{ item.created_at | dateFormat('MMMM DD YYYY', true) }}
            </div>
          </template>

          <template #item.actions="{item}">
            <crud-actions row>
              <v-btn icon small @click.stop="openActionDialog('delete', item.external_id)">
                <v-icon>delete</v-icon>
              </v-btn>
            </crud-actions>
          </template>
        </v-data-table>
      </v-tab-item>

      <v-tab-item :transition="false" :reverse-transition="false">
        <v-data-table
          v-custom="'hover-row'"
          :headers="pendingProjectsHeaders"
          :items="pendingProjects"
          :items-per-page="50"
          sort-by="created_at"
          sort-desc
          @click:row="openResearchDialog"
        >
          <template #item.created_at="{item}">
            <div class="text-no-wrap">
              {{ item.created_at | dateFormat('MMMM DD YYYY', true) }}
            </div>
          </template>
          <template #item.actions="{item}">
            <crud-actions row>
              <v-btn icon small @click.stop="openActionDialog('approve', item._id)">
                <v-icon>done</v-icon>
              </v-btn>
              <v-btn icon small @click.stop="openActionDialog('reject', item._id)">
                <v-icon>close</v-icon>
              </v-btn>
            </crud-actions>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>


    <d-dialog
      v-model="researchDialog.isOpen"
      max-width="800"
      cancel-button-title="Reject"
      confirm-button-title="Approve"
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
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import { mapGetters } from 'vuex';
  import CrudActions from '@/components/layout/CrudActions';
  import ResearchRequestFormRead from '@/components/ResearchRequest/ResearchRequestRead/ResearchRequestRead';

  import { ResearchService } from '@deip/research-service';
  import { TenantService } from '@deip/tenant-service';
  import DDialog from '@/components/Deipify/DDialog/DDialog';

  const researchService = ResearchService.getInstance();
  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminProjects',
    components: {
      DDialog,
      ResearchRequestFormRead,
      CrudActions,
      AdminView
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
        },

        publicProjectsHeaders: [
          {
            text: 'Title',
            value: 'title'
          },
          {
            text: 'Created',
            value: 'created_at'
          },
          {
            value: 'actions',
            align: 'end'
          }
        ],

        pendingProjectsHeaders: [
          {
            text: 'Title',
            value: 'title'
          },
          {
            text: 'Created',
            value: 'created_at'
          },
          {
            text: 'Project innovator',
            value: 'researcher'
          },
          {
            value: 'actions',
            align: 'end'
          }
        ]
      };
    },
    computed: {
      ...mapGetters({
        pendingProjects: 'adminPanel/pendingProjects',
        publicProjects: 'adminPanel/publicProjects',
        user: 'auth/user',
        tenant: 'auth/tenant'
      })
    },

    created() {
      this.$store.dispatch('adminPanel/getAllProjects')
        .then(() => {
          this.$setReady();
        });
    },

    methods: {
      goToResearch(e) {
        const routeData = this.$router.resolve({
          name: 'ResearchDetails',
          params: {
            research_group_permlink: encodeURIComponent(e.research_group.permlink),
            research_permlink: encodeURIComponent(e.permlink)
          }
        });
        window.open(routeData.href, '_blank');
      },

      approveResearchApplication(proposalId) {
        this.isDisabled = true;

        researchService.approveResearchApplicationViaOffchain(this.user.privKey, {
          proposalId,
          tenant: this.tenant.account.external_id
        })
          .then(() => {
            this.finishAction();
          })
          .catch((err) => {
            console.log(err);
          });
      },

      rejectResearchApplication(proposalId) {
        this.isDisabled = true;

        researchService.rejectResearchApplicationViaOffchain(this.user.privKey, {
          proposalId,
          tenant: this.tenant.account.external_id
        })
          .then(() => {
            this.finishAction();
          })
          .catch((err) => {
            console.error(err);
          });
      },

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
            title: 'Approve request?',
            description: 'Project request will be approved and project will be published.',
            actionLabel: 'Approve',
            action: () => { this.approveResearchApplication(id); }
          },
          reject: {
            title: 'Reject request?',
            description: 'Project request will not be approved and project will not be published.',
            actionLabel: 'Reject',
            action: () => { this.rejectResearchApplication(id); }
          },
          delete: {
            title: 'Delete project?',
            description: 'Project will be hidden from platform permanently.',
            actionLabel: 'Delete',
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
