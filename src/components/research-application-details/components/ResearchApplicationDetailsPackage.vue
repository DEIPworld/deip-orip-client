<template>
  <v-row no-gutters>
    <v-col cols="8">
      <div class="text-h6 c-pb-10">
        {{ application.title }}
      </div>
    </v-col>
    <v-col v-if="isResolvingApplicationAvailable" cols="4">
      <div class="float-right">
        <v-btn
          outlined
          color="primary"
          :loading="isApproveBtnLoading"
          @click="approveApplication()"
        >
          Approve
        </v-btn>
        <v-btn
          outlined
          color="error"
          :loading="isRejectBtnLoading"
          @click="rejectApplication()"
        >
          Reject
        </v-btn>
      </div>
    </v-col>
    <v-col v-if="!isApplicationPending" offset="2">
      <div>
        <div class="float-right">
          <span v-if="isApplicationApproved" class="text-h6 green--text text--darken-2">Approved</span>
          <span v-if="isApplicationRejected" class="text-h6 red--text text--darken-2">Rejected</span>
        </div>
      </div>
    </v-col>
    <v-col cols="8">
      <div class="float-left">
        <router-link
          class="text-subtitle-1"
          style="text-decoration: none"
          :to="{ name: 'GrantProgramDetails',
                 params: {
                   agency: program.agency_name,
                   foa: program.funding_opportunity_number }}"
        >
          {{ program.funding_opportunity_number + ' ' + program.funding_opportunity_title }}
        </router-link>
      </div>
    </v-col>
    <v-col cols="4">
      <div class="text-subtitle-1 c-pb-5 float-right">
        Total amount: $ {{ fromAssetsToFloat(application.total_amount) }}
      </div>
    </v-col>
    <v-col cols="12">
      <div>
        <div class="text-subtitle-1 c-pt-5 c-pb-5">
          Application: <span class="text-caption grey--text">({{ application.letterHash }})</span>
        </div>
        <v-card>
          <v-card-text>
            <a target="_blank" class="a" :href="`${fileStorageBaseUrl}/applications/files/${applicationRef.agency}/${applicationRef.foaId}/${applicationRef.hash}/${applicationContent.hash}`">
              {{ applicationContent.filename }}
            </a>
            <span class="float-right text-body-2 grey--text">{{ applicationContent.hash.slice(0, 8) }}</span>
          </v-card-text>
        </v-card>
      </div>
    </v-col>
    <v-col cols="12">
      <div>
        <div class="text-subtitle-1 c-pt-5 c-pb-5">
          Package: <!-- <span class="text-caption grey--text">({{application.packageHash}})</span> -->
        </div>
        <v-card v-for="form in formsContent" :key="form.hash">
          <v-card-text>
            <a target="_blank" class="a" :href="`${fileStorageBaseUrl}/applications/files/${applicationRef.agency}/${applicationRef.foaId}/${applicationRef.hash}/${form.hash}`">
              {{ form.filename }}
            </a>
            <span class="float-right text-body-2 grey--text">{{ form.hash.slice(0, 8) }}</span>
          </v-card-text>
        </v-card>
      </div>
    </v-col>
    <v-col cols="12">
      <!-- START Research Content Reviews section -->
      <div class="c-pt-5 sidebar-fullwidth">
        <v-divider />
      </div>

      <div v-if="applicationReviewsList.length" class="c-pt-5 c-pb-5">
        <div id="agency-appliation-reviews">
          <div class="c-pt-2 title">
            {{ program.agency_name.toUpperCase() }} reviews:
            <span class="green--text text--darken-2">{{ agencyPositiveReviewsCount }}</span> /
            <span class="red--text text--darken-2">{{ agencyNegativeReviewsCount }}</span>
          </div>
          <div class="c-pt-6">
            <application-review-list-item v-for="(review, i) in applicationReviewsList" :key="'agency-review-' + i" :review="review" />
          </div>
        </div>
      </div>
      <div v-else class="c-pt-5 c-pb-5">
        <div class="text-subtitle-1 text-center">
          There are no reviews from {{ program.agency_name.toUpperCase() }}
        </div>
      </div>

      <div v-if="thirdpartyApplicationsReviewsList.length" class="text-subtitle-1 text-center" @click="isThirdpartyReviewsVisible = !isThirdpartyReviewsVisible">
        <a>{{ !isThirdpartyReviewsVisible ? `Show other reviews (${thirdpartyApplicationsReviewsList.length})` : `Hide other reviews` }}</a>
      </div>

      <div v-if="thirdpartyApplicationsReviewsList.length" v-show="isThirdpartyReviewsVisible" class="c-pt-5 c-pb-10">
        <div id="other-appliation-reviews">
          <div class="c-pt-2 title">
            Other reviews:
            <span class="green--text text--darken-2">{{ otherPositiveReviewsCount }}</span> /
            <span class="red--text text--darken-2">{{ otherNegativeReviewsCount }}</span>
          </div>
          <div class="c-pt-6">
            <application-review-list-item v-for="(review, i) in thirdpartyApplicationsReviewsList" :key="'other-review-' + i" :review="review" />
          </div>
        </div>
      </div>
      <!-- END Research Content Reviews section -->
    </v-col>
  </v-row>
</template>

<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';

  export default {
    name: 'ResearchApplicationDetailsPackage',
    data() {
      return {
        fileStorageBaseUrl: window.env.DEIP_SERVER_URL,
        isApproveBtnLoading: false,
        isRejectBtnLoading: false,
        isThirdpartyReviewsVisible: false
      };
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        isGrantProgramOfficer: 'auth/isGrantProgramOfficer',
        userExperise: 'auth/userExperise',
        application: 'rad/application',
        program: 'rad/program',
        research: 'rad/research',
        membersList: 'rad/membersList',
        allApplicationsReviewsList: 'rad/allApplicationsReviewsList',
        applicationReviewsList: 'rad/applicationReviewsList',
        thirdpartyApplicationsReviewsList: 'rad/thirdpartyApplicationsReviewsList',
        applicationRef: 'rad/applicationRef'
      }),
      isResolvingApplicationAvailable() {
        return (this.isGrantProgramOfficer || this.program.officers.some((o) => o == this.user.username)) && this.isApplicationPending;
      },
      isApplicationApproved() {
        return this.application && this.application.status === 'application_approved';
      },
      isApplicationRejected() {
        return this.application && this.application.status === 'application_rejected';
      },
      isApplicationPending() {
        return this.application && this.application.status === 'application_pending';
      },
      applicationContent() {
        return this.applicationRef.packageForms.find((f) => f.hash == this.application.letterHash);
      },
      formsContent() {
        return this.applicationRef.packageForms.filter((f) => f.hash != this.application.letterHash);
      },
      agencyPositiveReviewsCount() {
        return this.applicationReviewsList.filter((r) => r.is_positive).length;
      },
      agencyNegativeReviewsCount() {
        return this.applicationReviewsList.filter((r) => !r.is_positive).length;
      },
      otherPositiveReviewsCount() {
        return this.thirdpartyApplicationsReviewsList.filter((r) => r.is_positive).length;
      },
      otherNegativeReviewsCount() {
        return this.thirdpartyApplicationsReviewsList.filter((r) => !r.is_positive).length;
      }
    },
    methods: {

      approveApplication() {
        this.isApproveBtnLoading = true;
        deipRpc.broadcast.approveGrantApplicationAsync(
          this.user.privKey,
          this.application.id,
          this.user.username,
          []
        )
          .then(() => {
            this.$notifier.showSuccess('Application has been approved successfully')
            this.$store.dispatch('rad/setApplicationStatus', { status: 'application_approved' });
          })
          .catch((err) => {
            this.$notifier.showError('An error occured while approving application, please try again later')
            console.error(err);
          }).finally(() => {
            this.isApproveBtnLoading = false;
          });
      },

      rejectApplication() {
        this.isRejectBtnLoading = true;
        deipRpc.broadcast.rejectGrantApplicationAsync(
          this.user.privKey,
          this.application.id,
          this.user.username,
          []
        )
          .then(() => {
            this.$notifier.showSuccess('Application has been rejected successfully')
            this.$store.dispatch('rad/setApplicationStatus', { status: 'application_rejected' });
          })
          .catch((err) => {
            this.$notifier.showError('An error occured while rejecting application, please try again later')
            console.error(err);
          }).finally(() => {
            this.isRejectBtnLoading = false;
          });
      }
    }
  };
</script>

<style lang="less" scoped>

</style>
