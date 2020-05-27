<template>
  <layout-section>
    <v-tabs v-model="tab">
      <v-tab>Waiting for approval</v-tab>
      <v-tab>Declined</v-tab>
    </v-tabs>
    <v-divider />
    <v-tabs-items v-model="tab">

      <v-tab-item :transition="false" :reverse-transition="false">
        <v-data-table
          :headers="pendingProjectsHeaders"
          :items="pendingProjects"
          :items-per-page="50"
        >
          <template #item.created_at="{item}">
            <div class="text-no-wrap">
              {{ item.created_at | dateFormat('MMMM DD YYYY', true) }}
            </div>
          </template>
          <template #item.actions="{item}">
            <crud-actions row>
              <v-btn icon small @click.stop="openConfirmDialog('delete', item._id)">
                <v-icon>delete</v-icon>
              </v-btn>
              <v-btn icon small @click.stop="showResearch(item)">
                <v-icon>edit</v-icon>
              </v-btn>
            </crud-actions>
          </template>
        </v-data-table>
      </v-tab-item>

      <v-tab-item :transition="false" :reverse-transition="false">
        <v-data-table
          :headers="rejectedProjectsHeaders"
          :items="rejectedProjects"
          :items-per-page="50"
        >
          <template #item.created_at="{item}">
            <div class="text-no-wrap">
              {{ item.created_at | dateFormat('MMMM DD YYYY', true) }}
            </div>
          </template>
        </v-data-table>
      </v-tab-item>

    </v-tabs-items>

    <full-screen-modal
      v-model="researchDialog.isOpen"
      title="Edit research"
    >
      <research-request-form-edit
        :key="researchDialog.id"
        get-from="account/pendingProjects"
        :research-id="researchDialog.id"
        @done="hideResearch"
      />
    </full-screen-modal>

    <action-dialog
      :open="confirmDialog.isOpen"
      :title="confirmDialog.data.title"
      @close="closeConfirmDialog"
    >
      {{ confirmDialog.data.description }}
      <template #actions>
        <v-btn
          color="primary"
          text
          :disabled="isDisabled"
          @click="closeConfirmDialog"
        >
          cancel
        </v-btn>
        <v-btn
          color="primary"
          :disabled="isDisabled"
          :loading="isDisabled"
          text
          v-if="confirmDialog.data.action"
          @click="confirmDialog.data.action.method(confirmDialog.data.id)"
        >
          {{ confirmDialog.data.action.title }}
        </v-btn>
      </template>
    </action-dialog>

  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import CrudActions from '@/components/layout/CrudActions';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import FullScreenModal from '@/components/layout/FullScreen/FullScreenModal';
  import ResearchRequestFormEdit from '@/components/ResearchRequest/ResearchRequestFormEdit';
  import ActionDialog from '@/components/layout/ActionDialog';
  import { ResearchService } from '@deip/research-service';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'AccountProjectRequests',
    components: {
      ActionDialog,
      ResearchRequestFormEdit,
      FullScreenModal,
      LayoutSection,
      CrudActions
    },

    data() {
      return {
        tab: null,
        isDisabled: false,

        confirmDialog: {
          isOpen: false,
          data: {},
          types: {
            delete: {
              title: 'Delete project?',
              description:
                'Project will be hidden from platform permanently.',
              action: {
                title: 'delete',
                method: this.deleteRequest
              }
            }
          }
        },

        researchDialog: {
          isOpen: false,
          id: null
        },

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
        ],

        rejectedProjectsHeaders: [
          {
            text: 'Title',
            value: 'title'
          },
          {
            text: 'Created',
            value: 'created_at'
          }
        ]
      };
    },

    computed: {
      ...mapGetters({
        pendingProjects: 'account/pendingProjects',
        rejectedProjects: 'account/rejectedProjects',
        user: 'auth/user',
        tenant: 'auth/tenant'
      })
    },

    methods: {
      showResearch(item) {
        this.researchDialog.id = item._id;
        this.researchDialog.isOpen = true;
      },

      deleteRequest(proposalId) {
        this.finishAction();
      },

      finishAction() {
        const username = decodeURIComponent(this.$store.getters['auth/user'].account.name);
        this.$store.dispatch('account/getAllProjects', { username }).then(() => {
          this.isDisabled = false;
          this.closeConfirmDialog();
        });
      },

      hideResearch() {
        this.researchDialog.isOpen = false;
      },

      closeConfirmDialog() {
        this.confirmDialog.isOpen = false;
        setTimeout(() => {
          this.confirmDialog.data = {};
        }, 300);
      },
      openConfirmDialog(type, id) {
        if (this.researchDialog.isOpen) {
          this.hideResearch();
        }

        this.confirmDialog.isOpen = true;
        this.confirmDialog.data = this.confirmDialog.types[type];
        this.confirmDialog.data.id = id;
      },
    },

    $dataPreload() {
      const username = decodeURIComponent(this.$store.getters['auth/user'].account.name);
      return this.$store.dispatch('account/getAllProjects', { username });
    }
  };
</script>

<style scoped>

</style>
