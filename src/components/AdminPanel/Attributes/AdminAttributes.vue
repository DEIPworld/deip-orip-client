<template>
  <d-layout>
    <d-layout-section-main>
      <d-block :title="$t('adminRouting.attributes.title')">

        <template 
          v-if="$hasModule(DEIP_MODULE.ADMIN_PANEL_ATTRIBUTES_REGISTARTION)" 
          #title-append
        >
          <v-btn small color="primary" :to="{name: 'admin.attributes.edit'}">
            <v-icon left>
              extension
            </v-icon>
            {{ $t('adminRouting.attributes.add') }}
          </v-btn>
        </template>

        <v-divider />

        <v-data-table
          :headers="attributesTable"
          :items="researchAttributes"
          :items-per-page="50"
        >

          <template #item.type="{ item }">
            <v-chip outlined small>
              {{ ATTR_LABELS[item.type] ? ATTR_LABELS[item.type] : 'undefined' }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <crud-actions row>


              <!-- <v-btn
                v-if="!item.isRequired"
                :color="item.isPublished ? 'success' : null"
                icon
                small
                @click="openActionDialog(item.isPublished ? 'unpublish' : 'publish', item._id)"
              >
                <v-icon>{{ item.isPublished ? 'flag' : 'outlined_flag' }}</v-icon>
              </v-btn> -->

              <v-btn icon small :to="{name: 'admin.attributes.edit', query:{id:item._id}}">
                <v-icon>edit</v-icon>
              </v-btn>

              <v-btn
                icon
                small
                :disabled="item.isRequired || !$hasModule(DEIP_MODULE.ADMIN_PANEL_ATTRIBUTES_REGISTARTION)"
                @click="openActionDialog('delete', item._id)"
                class="ml-auto"
              >
                <v-icon>{{ item.isRequired || !$hasModule(DEIP_MODULE.ADMIN_PANEL_ATTRIBUTES_REGISTARTION) ? 'lock' : 'delete' }}</v-icon>
              </v-btn>

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
  import { ATTR_TYPES, ATTR_LABELS } from '@/variables';
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
      DDialog
    },
    data() {
      return {
        ATTR_TYPES,
        ATTR_LABELS,

        isDisabled: false,

        actionDialog: {
          isOpen: false,
          description: null,
          actionLabel: null,
          action: () => false
        },

        attributesTable: [
          {
            text: this.$t('adminRouting.attributes.attributesTable.type'),
            value: 'type',
            width: '1%'
          },
          {
            text: this.$t('adminRouting.attributes.attributesTable.title'),
            value: 'title',
            width: '50%'
          },
          {
            text: this.$t('adminRouting.attributes.attributesTable.shortTitle'),
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
            title: this.$t('adminRouting.attributes.publishDialog.title'),
            description: this.$t('adminRouting.attributes.publishDialog.description'),
            actionLabel: this.$t('adminRouting.attributes.publishDialog.submitBtn'),
            action: () => { this.publishAttribute(researchAttributeId); }

          },
          unpublish: {
            title: this.$t('adminRouting.attributes.unpublishDialog.title'),
            description: this.$t('adminRouting.attributes.unpublishDialog.description'),
            actionLabel: this.$t('adminRouting.attributes.unpublishDialog.submitBtn'),
            action: () => { this.unpublishAttribute(researchAttributeId); }

          },
          delete: {
            title: this.$t('adminRouting.attributes.deleteDialog.title'),
            description: this.$t('adminRouting.attributes.deleteDialog.description'),
            actionLabel: this.$t('adminRouting.attributes.deleteDialog.submitBtn'),
            action: () => { this.deleteAttribute(researchAttributeId); }

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
      publishAttribute(id) {
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
      unpublishAttribute(id) {
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
      deleteAttribute(id) {
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
