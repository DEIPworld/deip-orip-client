<template>
  <admin-view :title="$t('adminRouting.faq.title')">
    <template #toolbarAction>
      <v-btn outlined color="primary" :to="{name: 'admin.faq.add'}">
        <v-icon left>
          add_comment
        </v-icon>
        {{ $t('adminRouting.faq.add') }}
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
            :color="item.isPublished ? 'success' : null"
            icon
            @click="openActionDialog(item.isPublished ? 'unpublish' : 'publish', item._id)"
          >
            <v-icon>{{ item.isPublished ? 'flag' : 'outlined_flag' }}</v-icon>
          </v-btn>
          <v-btn icon :to="{name: 'admin.faq.add', query:{id:item._id}}">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn icon @click="openActionDialog('delete', item._id)">
            <v-icon>delete</v-icon>
          </v-btn>

                    <!-- <v-btn icon @click="xFaqTest(item._id)">
                      <v-icon>settings</v-icon>
                    </v-btn> -->
        </div>
      </template>
    </side-actions-card>

    <vex-dialog
      v-model="actionDialog.isOpen"
      :title="actionDialog.title"
      :button-true-text="actionDialog.actionLabel"
      @click:confirm="actionDialog.action()"
    >
      {{ actionDialog.description }}
    </vex-dialog>
  </admin-view>
</template>

<script>
  import AdminView from '@/components/AdminPanel/AdminView';
  import SideActionsCard from '@/components/layout/SideActionsCard';
  import { mapGetters } from 'vuex';
  import { TenantService } from '@deip/tenant-service';

  const tenantService = TenantService.getInstance();

  export default {
    name: 'AdminFAQ',
    components: {
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
        faqs: 'adminPanel/faqs'
      })
    },

    methods: {
      // xFaqTest(id) {
      //   this.$confirm(
      //     'New dialog mega test message',
      //     {
      //       title: 'New dialog',
      //       buttonTrueText: 'Kill all hummans'
      //     }
      //   )
      //     .then((confirm) => {
      //       if (confirm) {
      //         console.info('process', id);
      //       } else {
      //         console.info('cancel', id);
      //       }
      //     });
      // },

      updateFAQ(FAQsArr) {
        const updatedProfile = _.cloneDeep(this.$tenant.profile);
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
            title: this.$t('adminRouting.faq.publishDialog.title'),
            description: this.$t('adminRouting.faq.publishDialog.description'),
            actionLabel: this.$t('adminRouting.faq.publishDialog.submitBtn'),
            action: () => { this.publishFAQ(faqId); }
          },
          unpublish: {
            title: this.$t('adminRouting.faq.unpublishDialog.title'),
            description: this.$t('adminRouting.faq.unpublishDialog.description'),
            actionLabel: this.$t('adminRouting.faq.unpublishDialog.submitBtn'),
            action: () => { this.unpublishFAQ(faqId); }
          },
          delete: {
            title: this.$t('adminRouting.faq.deleteDialog.title'),
            description: this.$t('adminRouting.faq.deleteDialog.description'),
            actionLabel: this.$t('adminRouting.faq.deleteDialog.submitBtn'),
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
              isPublished: true
            };
          }
          return q;
        });
        this.updateFAQ(updatedFAQ);
      },

      unpublishFAQ(id) {
        const updatedFAQ = this.faqs.map((q) => {
          if (q._id === id) {
            return {
              ...q,
              isPublished: false
            };
          }
          return q;
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
