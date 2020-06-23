<template>
  <admin-view title="FAQ">
    <template #toolbarAction>
      <v-btn outlined color="primary" :to="{name: 'admin.faq.add'}">
        <v-icon left>add_comment</v-icon>
        Add question
      </v-btn>
    </template>

    <side-actions-card
      v-for="(item, i) in faqs"
      :key="`${i}-faq`"
      :class="{'mb-6': (i + 1) < faqs.length}"
    >
      <div class="text-subtitle-1 font-weight-medium">
        {{ item.question }}
      </div>
      {{ item.answer }}
      <template #actions>
        <div class="display-flex flex-column">
          <v-btn
            :color="item.isVisible ? 'success' : null"
            icon
            @click="openActionDialog(item.isVisible ? 'unpublish' : 'publish', item._id)"
          >
            <v-icon>{{ item.isVisible ? 'flag' : 'outlined_flag' }}</v-icon>
          </v-btn>
          <v-btn icon :to="{name: 'admin.faq.add', query:{id:item._id}}">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn icon @click="openActionDialog('delete', item._id)">
            <v-icon>delete</v-icon>
          </v-btn>
        </div>
      </template>
    </side-actions-card>


    <d-dialog
      v-model="actionDialog.isOpen"
      :title="actionDialog.title"
      :confirm-button-title="actionDialog.actionLabel"
      @click:confirm="actionDialog.action()"
    >
      {{ actionDialog.description }}
    </d-dialog>

  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import SideActionsCard from '@/components/layout/SideActionsCard';
  import { mapGetters } from 'vuex';
  import { TenantService } from '@deip/tenant-service';
  import DDialog from '@/components/Deipify/DDialog/DDialog';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminFAQ',
    components: {
      DDialog,
      SideActionsCard,
      AdminView
    },

    data() {
      return {
        actionDialog: {
          isOpen: false,
          description: null,
          actionLabel: null,
          action: () => false
        }
      };
    },

    computed: {
      ...mapGetters({
        tenant: 'auth/tenant',
        faqs: 'adminPanel/faqs'
      })
    },

    methods: {
      updateFAQ(FAQsArr) {
        const updatedProfile = _.cloneDeep(this.tenant.profile);
        updatedProfile.settings.faq = FAQsArr;
        tenantService.updateTenantProfile(updatedProfile)
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
      openActionDialog(type, faqId) {
        const types = {
          publish: {
            title: 'Publish Q&A?',
            description: 'Selected question and answer will be published on FAQ page.',
            actionLabel: 'Publish',
            action: () => { this.publishFAQ(faqId); }
          },
          unpublish: {
            title: 'Unpublish Q&A?',
            description: 'Selected question and answer will be removed from FAQ page.',
            actionLabel: 'Unpublish',
            action: () => { this.unpublishFAQ(faqId); }
          },
          delete: {
            title: 'Delete Q&A?',
            description: 'Question and answer will be deleted permanently.',
            actionLabel: 'Delete Q&A ',
            action: () => { this.deleteFAQ(faqId); }
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
      publishFAQ(id) {
        const updatedFAQ = this.faqs.map((q) => {
          if (q._id === id) {
            return {
              ...q,
              isVisible: true
            };
          } else {
            return q;
          }
        });
        this.updateFAQ(updatedFAQ);
      },
      unpublishFAQ(id) {
        const updatedFAQ = this.faqs.map((q) => {
          if (q._id === id) {
            return {
              ...q,
              isVisible: false
            };
          } else {
            return q;
          }
        });
        this.updateFAQ(updatedFAQ);
      },
      deleteFAQ(id) {
        const updatedFAQ = this.faqs.filter(({ _id }) => _id !== id);
        this.updateFAQ(updatedFAQ);
      }
    }
  };
</script>

<style scoped>
</style>
