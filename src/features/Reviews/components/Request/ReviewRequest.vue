<template>
  <div>
    <slot name="button" :startRequest="startRequest">
      <v-btn
        outlined
        color="primary"
        small
        @click="startRequest"
      >
        {{ $t('reviews.request') }}
      </v-btn>
    </slot>

    <validation-observer v-slot="{ invalid, handleSubmit }" ref="observer">
      <v-form>
        <vex-dialog
          v-model="requestDialog"
          :title="$t('reviews.request')"
          :true-disabled="invalid || loading"
          :false-disabled="loading"
          @click:confirm="handleSubmit(createRequest)"
        >
          <d-stack>
            <!-- TODO: replace conditions after switch to externalId -->
            <div v-if="contentId === null">
              <validation-provider
                v-slot="{ errors }"
                name="Content"
                rules="required"
              >
                <content-selector
                  v-model="formModel.contentId"
                  :error-messages="errors"
                  v-bind="$$dataContextProps"
                />
              </validation-provider>
            </div>

            <validation-provider
              v-slot="{ errors }"
              name="Content"
              rules="required"
            >
              <user-selector
                v-model="formModel.reviewer"
                v-bind="reviewerConditions"
                :error-messages="errors"
              />
            </validation-provider>
          </d-stack>
        </vex-dialog>
      </v-form>
    </validation-observer>

  </div>

</template>

<script>
  import DStack from '@/components/Deipify/DStack/DStack';
  import UserSelector from '@/features/Users/components/Selector/UserSelector';
  import ContentSelector from '@/features/Contents/components/Selector/ContentSelector';

  import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';
  import { dataContextSwitch } from '@/mixins/dataContextSwitch';

  const researchContentReviewsService = ResearchContentReviewsService.getInstance();

  export default {
    name: 'ReviewRequest',
    components: {
      ContentSelector,
      UserSelector,
      DStack
    },
    mixins: [dataContextSwitch],

    props: {
      reviewerConditions: {
        type: Object,
        default: () => ({})
      },
      projectId: {
        type: String,
        default: null
      },
      contentId: {
        type: String,
        default: null
      }
    },

    data() {
      return {
        requestDialog: false,
        loading: false,
        formModel: {
          contentId: this.contentId ? this.contentId : null,
          reviewer: null
        }
      };
    },

    methods: {
      startRequest() {
        this.requestDialog = true;
      },

      createRequest() {
        this.loading = true;

        return researchContentReviewsService.createReviewRequest({
          researchContentExternalId: this.formModel.contentId,
          expert: this.formModel.reviewer
        })
          .then(() => {
            this.$notifier.showSuccess('Request for the review has been sent successfully');
            this.requestDialog = false;
          })
          .catch((err) => {
            this.$notifier.showError(
              err.response && err.response.data
                ? err.response.data
                : 'An error occurred while requesting the review. Please try again later'
            );
          })
          .finally(() => {
            this.loading = false;
          });
      }
    }
  };
</script>
