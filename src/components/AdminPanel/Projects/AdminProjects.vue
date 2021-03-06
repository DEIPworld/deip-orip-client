<template>
  <d-layout-section>
    <d-layout-section-main>
      <projects-list
        ref="projectList"
        :view-types="[VIEW_TYPES.TABLE]"
        :portal-id="portal.account.name"
        row-layout-key="AdminProjectListRow"
        :title="$t('adminRouting.projects.title')"
      >
        <template
          v-if="$hasModule(DEIP_MODULE.ADMIN_PANEL_PROJECTS_REGISTRATION)"
          #title-append-after>
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
            <v-btn icon small @click.stop="editProject(project._id)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              v-if="$hasModule(DEIP_MODULE.ADMIN_PANEL_PROJECTS_REGISTRATION)"
              icon
              small
              @click.stop="deleteProject(project._id)">
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
  import { ProjectService } from '@deip/project-service';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import ProjectsList from '@/features/Projects/components/List/ProjectsList';
  import { VIEW_TYPES } from '@/variables';

  const projectService = ProjectService.getInstance();


  export default {
    name: 'AdminProjects',
    components: {
      CrudActions,
      ProjectsList,
      DLayoutSection,
      DLayoutSectionMain
    },
    data() {
      return {
        VIEW_TYPES,

        tab: null,
        isDisabled: false,

        projectDialog: {
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
        portal: 'auth/portal'
      })
    },

    methods: {
      editProject(id) {
        this.$router.push({
          name: 'project.edit',
          params: {
            projectId: id
          }
        });
      },

      deleteProject(id) {
        this.$confirm(
          this.$t('adminRouting.projects.deleteDialog.description'),
          {
            title: this.$t('adminRouting.projects.deleteDialog.title'),
            buttonTrueText: this.$t('adminRouting.projects.deleteDialog.submitBtn')
          }
        )
          .then((confirmed) => {
            if (confirmed) {
              projectService.deleteProject(id)
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
