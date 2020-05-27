<template>
  <layout-section>
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
          <v-btn icon small @click.stop="showResearch(item)">
            <v-icon>edit</v-icon>
          </v-btn>
        </crud-actions>
      </template>
    </v-data-table>

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

  </layout-section>

</template>

<script>
  import { mapGetters } from 'vuex';
  import CrudActions from '@/components/layout/CrudActions';
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import FullScreenModal from '@/components/layout/FullScreen/FullScreenModal';
  import ResearchRequestFormEdit from '@/components/ResearchRequest/ResearchRequestFormEdit';

  export default {
    name: 'AccountProjectRequests',
    components: {
      ResearchRequestFormEdit,
      FullScreenModal,
      LayoutSection,
      CrudActions
    },

    data() {
      return {
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
        ]
      };
    },

    computed: {
      ...mapGetters({
        pendingProjects: 'account/pendingProjects'
      })
    },

    methods: {
      showResearch(item) {
        this.researchDialog.id = item._id;
        this.researchDialog.isOpen = true;
      },

      hideResearch() {
        this.researchDialog.isOpen = false;
      },
    },

    $dataPreload() {
      return this.$store.dispatch('account/getPendingProjects', {
        username: decodeURIComponent(this.$store.getters['auth/user'].account.name)
      });
    }
  };
</script>

<style scoped>

</style>
