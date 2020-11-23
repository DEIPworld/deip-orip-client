<template>
  <d-layout-section>
    <d-layout-section-main>
      <projects-list
        ref="projectList"
        :view-types="[VIEW_TYPES.TABLE]"
        row-layout-key="AdminProjectListRow"
        :title="$t('adminRouting.projects.title')"
      >
        <template #title-append-after>
          <v-btn
            outlined
            small
            color="primary"
            :to="{name: 'project.create'}"
          >
            <v-icon left>
              mdi-file-document-outline
            </v-icon>
            {{ $t('adminRouting.projects.create') }}
          </v-btn>
        </template>

        <template #contentPrepend>
          <v-divider />
        </template>

        <template #itemRowActions="{ project }">
          <crud-actions>
            <v-btn icon small @click="editProject(project.externalId)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small @click="deleteProject(project.externalId)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </crud-actions>
        </template>

      </projects-list>
    </d-layout-section-main>
  </d-layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import CrudActions from '@/components/layout/CrudActions';
  import ResearchRequestFormRead from '@/components/ResearchRequest/ResearchRequestRead/ResearchRequestRead';

  import { TenantService } from '@deip/tenant-service';
  import DDialog from '@/components/Deipify/DDialog/DDialog';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import ProjectsList from '@/features/Projects/components/List/ProjectsList';
  import { VIEW_TYPES } from '@/variables';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminProjects',
    components: {
      CrudActions,
      ProjectsList,
      DLayoutSection,
      DLayoutSectionMain,
      DDialog,
      ResearchRequestFormRead
    },
    data() {
      return {
        VIEW_TYPES,

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
      })
    },

    methods: {
      editProject(id) {
        this.$router.push({
          name: 'project.edit',
          params: {
            researchExternalId: id
          }
        });
      },

      deleteProject(id) {
        this.$confirm(
          'Technology will be deleted permanently and will be removed from platform.',
          {
            title: 'Remove technology?',
            buttonTrueText: 'Delete'
          }
        )
          .then((confirmed) => {
            if (confirmed) {
              const clone = _.cloneDeep(this.tenant.profile);
              clone.settings.researchBlacklist.push(id);

              tenantService.updateTenantProfile(clone)
                .then(() => {
                  this.$notifier.showSuccess();
                  this.$refs.projectList.getData();
                })
                .catch((err) => {
                  console.error(err);
                  this.$notifier.showError();
                });
            }
          });
      }
    }
  };
</script>
