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
          :headers="publicProjectsHeaders"
          :items="publicProjects"
          :items-per-page="50"
          @click:row="goToResearch"
        >
          <template #item.created_at="{item}">
            <div class="text-no-wrap">
              {{ item.created_at | dateFormat('MMMM DD YYYY', true) }}
            </div>
          </template>
        </v-data-table>
      </v-tab-item>

      <v-tab-item :transition="false" :reverse-transition="false">
        <v-data-table
          :headers="pendingProjectsHeaders"
          :items="pendingProjects"
          :items-per-page="50"
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
              <v-btn icon small @click.stop="openActionDialog('decline', item._id)">
                <v-icon>close</v-icon>
              </v-btn>
            </crud-actions>
          </template>
        </v-data-table>
      </v-tab-item>
    </v-tabs-items>

    <full-screen-modal
      v-model="researchDialog.isOpen"
      title="Approve"
    >
      <research-request-form-read
        :key="researchDialog.id"
        get-from="adminPanel/pendingProjects"
        :research-id="researchDialog.id"
      >
        <template #buttons>
          <v-btn
            color="primary"
            class="ml-2"
            @click="openActionDialog('reject', researchDialog.id)"
          >
            Reject research
          </v-btn>
          <v-btn
            color="primary"
            class="ml-2"
            @click="openActionDialog('approve', researchDialog.id)"
          >
            Approve research
          </v-btn>
        </template>
      </research-request-form-read>
    </full-screen-modal>

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
          {{ actionDialog.data.action.title }}
        </v-btn>
      </template>
    </action-dialog>
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import { mapGetters } from 'vuex';
  import CrudActions from '@/components/layout/CrudActions';
  import ResearchRequestFormRead from '@/components/ResearchRequestForm/ResearchRequestFormRead';
  import FullScreenModal from '@/components/layout/FullScreen/FullScreenModal';
  import ActionDialog from '@/components/layout/ActionDialog';

  import { ResearchService } from '@deip/research-service';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'AdminProjects',
    components: {
      ActionDialog,
      FullScreenModal,
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
          id: null
        },

        actionDialog: {
          isOpen: false,
          data: {},
          types: {
            approve: {
              title: 'Approve request?',
              description:
                'Request will be approved and person will become a member.',
              action: {
                title: 'approve',
                method: this.approveResearchApplication
              }
            },
            reject: {
              title: 'Reject request?',
              description:
                'Request will be declined and person will not become a member.',
              action: {
                title: 'reject',
                method: this.rejectResearchApplication
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
            this.finishAction()
          })
          .catch((err) => {
            console.log(err);
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
        this.researchDialog.id = item._id;
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
