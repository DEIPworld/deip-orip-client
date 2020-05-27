<template>
  <admin-view v-if="dataLoaded" title="Projects">
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
          @click:row="showResearch"
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

    <v-dialog
      v-model="researchDialog.isOpen"
      max-width="800"
      scrollable
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ researchDialog.data.title }}</span>
          <v-spacer />
          <v-btn
            small
            icon
            class="mr-n2"
            @click="hideResearch"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="px-6 py-3 text--primary">
          <research-request-form-read
            :key="researchDialog.data._id"
            get-from="adminPanel/pendingProjects"
            :research-id="researchDialog.data._id"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            class="ml-2"
            text
            @click="openActionDialog('reject', researchDialog.data._id)"
          >
            Reject
          </v-btn>
          <v-btn
            color="primary"
            class="ml-2"
            text
            @click="openActionDialog('approve', researchDialog.data._id)"
          >
            Approve
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <action-dialog
      :open="actionDialog.isOpen"
      :title="actionDialog.data.title"
      @close="closeActionDialog"
    >
      {{ actionDialog.data.description }}
      <template #actions>
        <v-btn
          color="primary"
          :disabled="isDisabled"
          :v-if="!isDisabled"
          text
          @click="closeActionDialog"
        >
          cancel
        </v-btn>
        <v-btn
          v-if="actionDialog.data.action"
          color="primary"
          :disabled="isDisabled"
          :loading="isDisabled"
          text
          @click="actionDialog.data.action.method(actionDialog.data.id)"
        >
          {{ actionDialog.data.action.title || 'delete' }}
        </v-btn>
      </template>
    </action-dialog>
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import { mapGetters } from 'vuex';
  import CrudActions from '@/components/layout/CrudActions';
  import ResearchRequestFormRead from '@/components/ResearchRequest/ResearchRequestRead/ResearchRequestRead';
  import ActionDialog from '@/components/layout/ActionDialog';

  import { ResearchService } from '@deip/research-service';
  import { TenantService } from '@deip/tenant-service';

  const researchService = ResearchService.getInstance();
  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminProjects',
    components: {
      ActionDialog,
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
          data: {},
          types: {
            approve: {
              title: 'Approve request?',
              description:
                'Project request will be approved and project will be published.',
              action: {
                title: 'approve',
                method: this.approveResearchApplication
              }
            },
            reject: {
              title: 'Reject request?',
              description:
                'Project request will not be approved and project will not be published.',
              action: {
                title: 'reject',
                method: this.rejectResearchApplication
              }
            },
            delete: {
              title: 'Delete project?',
              description:
                'Project will be hidden from platform permanently.',
              action: {
                title: 'delete',
                method: this.deleteResearchApplication
              }
            }
          }
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
            console.log(err);
          });
      },

      deleteResearchApplication(id) {
        const updatedProfile = _.cloneDeep(this.tenant.profile);

        if (id) {
          updatedProfile.settings.researchBlacklist.push(id);
        }

        tenantService.updateTenantProfile(updatedProfile)
          .then(() => {
            this.finishAction();

            this.$store.dispatch('layout/setSuccess', { message: 'Successfully' });
            this.$store.dispatch('adminPanel/getAllProjects');
          })
          .catch((err) => {
            console.error(err);
            this.$store.dispatch('layout/setError', {
              message: 'An error occurred while sending the request, please try again later.'
            });
          });
      },

      openActionDialog(type, id) {
        if (this.researchDialog.isOpen) {
          this.hideResearch();
        }

        this.actionDialog.isOpen = true;
        this.actionDialog.data = this.actionDialog.types[type];
        this.actionDialog.data.id = id;
      },

      closeActionDialog() {
        this.actionDialog.isOpen = false;
        setTimeout(() => {
          this.actionDialog.data = {};
        }, 300);
      },

      showResearch(item) {
        this.researchDialog.data = item;
        this.researchDialog.isOpen = true;
      },

      hideResearch() {
        this.researchDialog.isOpen = false;
      },

      finishAction() {
        this.$store.dispatch('adminPanel/getAllProjects').then(() => {
          this.isDisabled = false;
          this.closeActionDialog();
        });
      }
    },

    $dataPreload() {
      return this.$store.dispatch('adminPanel/getAllProjects');
    }
  };
</script>
