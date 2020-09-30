<template>
  <d-layout>
    <d-layout-section-main>
      <d-block title="Attributes">

        <template #titleAddon>
          <v-btn outlined small color="primary" :to="{name: 'admin.attributes.settings'}">
            <v-icon left>
              widgets
            </v-icon>
            Placement settings
          </v-btn>

          <v-btn small color="primary" :to="{name: 'admin.attributes.edit'}">
            <v-icon left>
              extension
            </v-icon>
            Add attribute
          </v-btn>
        </template>

        <v-divider class="mb-6" />
        <v-data-table
          :headers="attributesTable"
          :items="researchAttributes"
          :items-per-page="50"
        >

          <template #item.type="{ item }">
            <v-chip outlined small>
              {{ ATTR_TYPES_LABELS[item.type] ? ATTR_TYPES_LABELS[item.type] : 'undefined' }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <crud-actions row>
              <template v-if="item.isRequired">
                <v-btn icon small disabled class="ml-auto">
                  <v-icon>lock</v-icon>
                </v-btn>
              </template>
              <template v-else>
                <v-btn
                  :color="item.isPublished ? 'success' : null"
                  icon
                  small
                  @click="openActionDialog(item.isPublished ? 'unpublish' : 'publish', item._id)"
                >
                  <v-icon>{{ item.isPublished ? 'flag' : 'outlined_flag' }}</v-icon>
                </v-btn>

                <v-btn icon small :to="{name: 'admin.attributes.edit', query:{id:item._id}}">
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn icon small @click="openActionDialog('delete', item._id)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </template>

            </crud-actions>
          </template>

        </v-data-table>

      </d-block>
    </d-layout-section-main>

    <d-dialog
      v-model="actionDialog.isOpen"
      :title="actionDialog.title"
      :confirm-button-title="actionDialog.actionLabel"
      :loading="isDisabled"
      @click:confirm="actionDialog.action()"
    >
      {{ actionDialog.description }}
    </d-dialog>
  </d-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { TenantService } from '@deip/tenant-service';
  import { ATTR_TYPES, ATTR_TYPES_LABELS } from '@/variables';
  import DDialog from '@/components/Deipify/DDialog/DDialog';
  import CrudActions from '@/components/layout/CrudActions';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DLayout from '@/components/Deipify/DLayout/DLayout';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminAttributes',
    components: {
      DLayoutSectionMain,
      DLayout,
      DBlock,
      CrudActions,
      DDialog,
    },
    data() {
      return {
        ATTR_TYPES,
        ATTR_TYPES_LABELS,

        xxx: [],

        isDisabled: false,

        actionDialog: {
          isOpen: false,
          description: null,
          actionLabel: null,
          action: () => false
        },

        attributesTable: [
          {
            text: 'Type',
            value: 'type',
            width: '1%'
          },
          {
            text: 'Title',
            value: 'title',
            width: '50%'
          },
          {
            text: 'Short Title',
            value: 'shortTitle',
            width: '50%'
          },
          {
            value: 'actions',
            width: '1%',
            align: 'end'
          }
        ]
      };
    },
    computed: {
      ...mapGetters({
        tenant: 'auth/tenant',
        researchAttributes: 'adminPanel/researchAttributes'
      })
    },
    methods: {

      openActionDialog(type, researchAttributeId) {
        const types = {
          publish: {
            title: 'Publish attribute?',
            description: `Attribute will be set for each project and will appear on:
              - project page,
              - project application form,
              - explore page.
              `,
            actionLabel: 'publish',
            action: () => { this.publishCriteria(researchAttributeId); }

          },
          unpublish: {
            title: 'Unpublish attribute?',
            description: `Attribute will be removed from:
              - project page,
              - project application form,
              - explore page.
              `,
            actionLabel: 'unpublish',
            action: () => { this.unpublishCriteria(researchAttributeId); }

          },
          delete: {
            title: 'Delete attribute?',
            description: `Attribute will be deleted permanently and will be removed from:
              - project page,
              - project application form,
              - explore page.
              `,
            actionLabel: 'delete',
            action: () => { this.deleteCriteria(researchAttributeId); }

          }
        };

        this.actionDialog = {
          ...types[type],
          isOpen: true
        };
      },
      closeActionDialog() {
        this.actionDialog.isOpen = false;
        setTimeout(() => {
          this.actionDialog.data = {};
        }, 300);
      },
      publishCriteria(id) {
        const researchAttribute = this.researchAttributes.find((step) => step._id === id);
        tenantService.updateTenantResearchAttribute({
          ...researchAttribute,
          isPublished: true
        })
          .then(() => {
            this.$notifier.showSuccess();
            const tenant = window.env.TENANT;
            this.$store.dispatch('auth/loadTenant', { tenant });
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError();
          })
          .finally(() => this.closeActionDialog());
      },
      unpublishCriteria(id) {
        const researchAttribute = this.researchAttributes.find((step) => step._id === id);
        tenantService.updateTenantResearchAttribute({
          ...researchAttribute,
          isPublished: false
        })
          .then(() => {
            this.$notifier.showSuccess();
            const tenant = window.env.TENANT;
            this.$store.dispatch('auth/loadTenant', { tenant });
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError();
          })
          .finally(() => this.closeActionDialog());
      },
      deleteCriteria(id) {
        tenantService.deleteTenantResearchAttribute(id)
          .then(() => {
            this.$notifier.showSuccess();
            const tenant = window.env.TENANT;
            this.$store.dispatch('auth/loadTenant', { tenant });
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError();
          })
          .finally(() => this.closeActionDialog());
      }
    }
  };
</script>

<style scoped>

</style>
