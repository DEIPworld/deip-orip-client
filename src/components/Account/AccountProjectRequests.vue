<template>
  <layout-section v-if="$ready">
    <v-tabs v-model="tab">
      <v-tab>{{ $t('account.projectRequests.waiting') }}</v-tab>
      <v-tab>{{ $t('account.projectRequests.declined') }}</v-tab>
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
              <v-btn icon small @click.stop="openResearchEditModal(item)">
                <v-icon>edit</v-icon>
              </v-btn>
            </crud-actions>
          </template>
        </v-data-table>
      </v-tab-item>

      <v-tab-item :transition="false" :reverse-transition="false">
        <v-data-table
          v-custom="'hover-row'"
          :headers="rejectedProjectsHeaders"
          :items="rejectedProjects"
          :items-per-page="50"
          @click:row="openResearchViewDialog"
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
      v-model="researchEditModal.isOpen"
      title="Edit project"
    >
      <research-request-form-edit
        :key="researchEditModal.data._id"
        get-from="account/pendingProjects"
        :research-id="researchEditModal.data._id"
        @done="closeResearchEditModal"
      />
    </full-screen-modal>

    <vex-dialog
      v-model="researchViewDialog.isOpen"
      max-width="800"
      hide-buttons
    >
      <research-request-form-read
        :key="researchViewDialog.data._id"
        get-from="account/rejectedProjects"
        :research-id="researchViewDialog.data._id"
      />
    </vex-dialog>

    <vex-dialog
      v-model="actionDialog.isOpen"
      :title="actionDialog.title"
      :button-true-text="actionDialog.actionLabel"
      @click:confirm="actionDialog.action()"
    >
      {{ actionDialog.description }}
    </vex-dialog>
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import CrudActions from '@/components/layout/CrudActions';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import FullScreenModal from '@/components/layout/FullScreen/FullScreenModal';
  import ResearchRequestFormEdit from '@/components/ResearchRequest/ResearchRequestFormEdit';
  import ResearchRequestFormRead from '@/components/ResearchRequest/ResearchRequestRead/ResearchRequestRead';
  import { ResearchService } from '@deip/research-service';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'AccountProjectRequests',
    components: {
      ResearchRequestFormEdit,
      FullScreenModal,
      LayoutSection,
      CrudActions,
      ResearchRequestFormRead
    },

    data() {
      return {
        tab: null,
        isDisabled: false,

        actionDialog: {
          isOpen: false,
          title: null,
          description: null,
          actionLabel: null,
          action: () => false
        },

        researchEditModal: {
          isOpen: false,
          data: {}
        },

        researchViewDialog: {
          isOpen: false,
          data: {}
        },

        pendingProjectsHeaders: [
          {
            text: this.$t('account.projectRequests.tableHeader.title'),
            value: 'title'
          },
          {
            text: this.$t('account.projectRequests.tableHeader.created'),
            value: 'created_at'
          },
          {
            value: 'actions',
            align: 'end'
          }
        ],

        rejectedProjectsHeaders: [
          {
            text: this.$t('account.projectRequests.tableHeader.title'),
            value: 'title'
          },
          {
            text: this.$t('account.projectRequests.tableHeader.created'),
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

    created() {
      const username = decodeURIComponent(this.$store.getters['auth/user'].account.name);
      this.$store.dispatch('account/getAllProjects', { username })
        .then(() => {
          this.$setReady();
        });
    },

    methods: {
      openResearchEditModal(item) {
        this.researchEditModal.data = item;
        this.researchEditModal.isOpen = true;
      },

      closeResearchEditModal() {
        this.researchEditModal.isOpen = false;
      },

      openResearchViewDialog(item) {
        this.researchViewDialog.data = item;
        this.researchViewDialog.isOpen = true;
      },

      openConfirmDialog(type, id) {
        const types = {
          delete: {
            title: this.$t('account.projectRequests.deleteDialog.title'),
            description: this.$t('account.projectRequests.deleteDialog.description'),
            actionLabel: this.$t('account.projectRequests.deleteDialog.submitBtn'),
            action: () => { this.deleteRequest(id); }
          }
        };

        this.actionDialog = {
          ...types[type],
          isOpen: true
        };
      },

      deleteRequest(proposalId) {
        researchService.deleteResearchApplication(this.user.privKey, {
          researcher: this.user.username,
          proposalId
        })
          .catch((err) => console.error(err))
          .finally(() => {
            this.finishAction();
          });
      },

      finishAction() {
        const username = decodeURIComponent(this.$store.getters['auth/user'].account.name);
        this.$store.dispatch('account/getAllProjects', { username }).then(() => {
          this.isDisabled = false;
          this.actionDialog.isOpen = false;
        });
      }
    }
  };
</script>

<style scoped>

</style>
