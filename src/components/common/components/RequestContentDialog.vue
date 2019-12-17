<template>
  <v-layout row justify-start>
    <v-dialog v-model="isShown" persistent :max-width="620">
      <v-card class="pa-4">
        <v-layout
          row justify-center
          v-if="isDataLoading"
        >
          <v-progress-circular
            indeterminate
            color="primary"
          />
        </v-layout>
        <template v-else>
          <v-card-title>
            <v-layout row align-baseline>
              <v-flex grow class="headline">Request access to the material</v-flex>
              <v-flex shrink align-self-center right-top-angle>
                <v-btn @click="cancel()" :disabled="isRequesting" icon class="pa-0 ma-0">
                  <v-icon color="black">close</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-title>

          <v-card-text>
            <v-layout class="info-line my-2" v-if="contentName">
              <v-flex xs3 class="info-line__label">Material</v-flex>
              <v-flex xs9 class="pl-2 info-line__value">{{contentName}}</v-flex>
            </v-layout>
            <v-layout class="info-line my-2" v-if="projectName">
              <v-flex xs3 class="info-line__label">Project</v-flex>
              <v-flex xs9 class="pl-2 info-line__value">{{projectName}}</v-flex>
            </v-layout>
            <v-layout class="info-line my-2" v-if="author">
              <v-flex xs3 class="info-line__label">Author</v-flex>
              <v-flex xs9 class="pl-2 info-line__value">
                <platform-avatar 
                  :user="{ profile: author, account: { name: author._id} }"
                  :size="20"
                  link-to-profile
                  link-to-profile-class="px-1"
                ></platform-avatar>
              </v-flex>
            </v-layout>
            <v-layout class="info-line my-2" v-if="organization">
              <v-flex xs3 class="info-line__label">Organization</v-flex>
              <v-flex xs9 class="pl-2 info-line__value">
                <v-layout align-center>
                  <v-avatar size="20px">
                    <img :src="organization.logoMiniSrc" />
                  </v-avatar>
                  <span class="ml-2">{{ organization.name }}</span>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-textarea
              class="mt-2"
              v-model="coverLetter"
              :disabled="isRequesting"
              :rows="2"
              auto-grow
              name="Cover letter"
              label="Cover letter"
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-layout row wrap>
              <v-flex xs12 py-2>
                <v-btn
                  color="primary"
                  block
                  :loading="isRequesting"
                  @click="requestAccess()"
                >Request Access</v-btn>
              </v-flex>
              <v-flex xs12 py-2>
                <v-btn
                  color="primary"
                  flat
                  block
                  :disabled="isRequesting"
                  @click="cancel()"
                >Cancel</v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import contentAccessRequestsService from "@/services/http/contentAccessRequests";
  import * as ResearchGroupService from "@/services/ResearchGroupService";

  export default {
    name: 'RequestContentDialog',
    props: {
      isShown: { type: Boolean, required: true },
      contentRefId: { type: String, required: true },
      contentId: { type: Number, required: true },
    },
    data() {
      return {
        contentName: '',
        projectName: '',
        author: null,
        organization: null,
        coverLetter: '',
        isDataLoading: false,
        isRequesting: false,
      }
    },
    methods: {
      cancel() {
        this.$emit('canceled');
      },
      fetchData() {
        this.isDataLoading = true;
        contentAccessRequestsService.researchContentAccessRequestIntent(this.contentRefId)
          .then(({ contentRef, pi, researchGroup, research }) => {
            this.contentName = contentRef.title;
            this.projectName = research.title;
            this.author = pi;
            this.organization = ResearchGroupService.mapResearchGroup(researchGroup);
          }).catch((err) => {
            console.error(err);
          }).finally(() => {
            this.isDataLoading = false;
          })
      },
      requestAccess() {
        this.isRequesting = true;
        contentAccessRequestsService.createResearchContentAccessRequest({
          contentRefId: this.contentRefId,
          contentId: this.contentId,
          coverLetter: this.coverLetter
        }).then(() => {
          this.$emit('requested');
        }).catch((err) => {
          console.error(err);
        }).finally(() => {
          this.isRequesting = false;
        })
      }
    },
    watch: {
      isShown(val) {
        if (val) {
          this.fetchData();
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .info-line {
    &__label {
      font-family: Roboto;
      font-size: 14px;
      line-height: 16px;
      color: #9E9E9E;
    }
    &__value {
      font-family: Roboto;
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
    }
  }
</style>
