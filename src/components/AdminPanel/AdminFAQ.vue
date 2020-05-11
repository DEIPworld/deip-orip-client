<template>
  <admin-view title="FAQ">
    <template #toolbarAction>
      <v-btn outlined color="primary" :to="{name: 'admin.faq.add'}">
        <v-icon left>add_comment</v-icon>Add question
      </v-btn>
    </template>

    <side-actions-card
      v-for="(item, i) in faqs"
      :key="`${i}-faq`"
      :class="{'mb-6': (i + 1) < faqs.length}"
    >
      <div class="subtitle-1 font-weight-medium">
        {{ item.question }}
      </div>
      {{ item.answer }}
      <template #actions>
        <div class="display-flex flex-column">
          <v-btn :color="item.isVisible ? 'success' : null" icon @click="openActionDialog(item.isVisible ? 'unpublish' : 'publish', item._id)">
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

    <action-dialog
      :open="actionDialog.isOpen"
      :title="actionDialog.data.title"
      @close="closeActionDialog"
    >
      {{ actionDialog.data.description }}
      <template #actions>
        <v-btn color="primary" text @click="closeActionDialog">cancel</v-btn>
        <v-btn
          v-if="actionDialog.data.action"
          color="primary"
          text
          @click="actionDialog.data.action.method(actionDialog.data.faqId)"
        >{{ actionDialog.data.action.title }}</v-btn>
      </template>
    </action-dialog>

    <router-view name="dialog" />
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import SideActionsCard from '@/components/layout/SideActionsCard';
  import ActionDialog from '@/components/layout/ActionDialog';
  import { mapGetters } from 'vuex';
  import { TenantService } from '@deip/tenant-service';
  
  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminFAQ',
    components: { SideActionsCard, AdminView, ActionDialog },

    computed: {
      ...mapGetters({
        tenant: 'auth/tenant',
        faqs: 'adminPanel/faqs'
      })
    },

    data() {
      return {
        actionDialog: {
          isOpen: false,
          data: {},
          types: {
            publish: {
              title: 'Publish Q&A?',
              description:
                'Selected question and answer will be published on FAQ page.',
              action: {
                title: 'Publish',
                method: this.publishFAQ
              }
            },
            unpublish: {
              title: 'Unpublish Q&A?',
              description:
                'Selected question and answer will be removed from FAQ page.',
              action: {
                title: 'Unpublish',
                method: this.unpublishFAQ
              }
            },
            delete: {
              title: 'Delete Q&A?',
              description: 'Question and answer will be deleted permanently.',
              action: {
                title: 'Delete Q&A ',
                method: this.deleteFAQ
              }
            }
          }
        }
      };
    },
    methods: {
      updateFAQ(FAQsArr) {
        const updatedProfile = _.cloneDeep(this.tenant.profile);
        updatedProfile.settings.faq = FAQsArr;
        tenantService.updateTenantProfile(updatedProfile)
          .then(() => {
            this.$store.dispatch('layout/setSuccess', { message: 'Successfully' });
            const tenant = window.env.TENANT;
            this.$store.dispatch('auth/loadTenant', { tenant });
          })
          .catch((err) => {
            console.error(err);
            this.$store.dispatch('layout/setError', {
              message: 'An error occurred while sending the request, please try again later.'
            });
          })
          .finally(() => this.closeActionDialog());
      },
      openActionDialog(type, faqId) {
        this.actionDialog.isOpen = true;
        this.actionDialog.data = this.actionDialog.types[type];
        this.actionDialog.data.faqId = faqId;
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
            return { ...q, isVisible: true };
          } else {
            return q;
          }
        });
        this.updateFAQ(updatedFAQ);
      },
      unpublishFAQ(id) {
        const updatedFAQ = this.faqs.map((q) => {
          if (q._id === id) {
            return { ...q, isVisible: false };
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
