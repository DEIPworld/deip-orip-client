<template>
  <div>
    <v-layout
      row
      class="rd-header full-height pa-5 feed-header"
      :style="{ background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 70%, transparent), url('+ $options.filters.researchBackgroundSrc(research.id) +'), 100%, 100%, no-repeat'}"
    >
      <v-flex xs12 lg8>
        <div style="width: 95%">
          <div class="rd-header__title">{{research.title}}</div>
          <div class="rd-header__created pt-4">
            <v-layout row align-baseline>
              <span>
                <v-icon small color="white">today</v-icon>
                &nbsp;Created {{research.created_at | dateFormat('D MMM YYYY', true)}}
              </span>
              <span v-if="isResearchGroupMember" class="pl-4">
                <v-btn
                  class="ma-0 pa-0"
                  small
                  outline
                  color="white"
                  :to="{  
                      name: 'ResearchEdit',
                      params: {
                        research_group_permlink: encodeURIComponent(research.group_permlink),
                        research_permlink: encodeURIComponent(research.permlink)
                      } 
                    }"
                >Edit</v-btn>
              </span>
            </v-layout>
          </div>
          <div class="rd-header__abstract">
            <toggle-text class="py-3" :text="$options.filters.researchAbstract(research.abstract)"></toggle-text>
          </div>
        </div>
      </v-flex>
      <v-flex xs12 lg4 text-xs-right class="align-start" v-if="researchPresentationSrc">
        <div>
          <iframe
            class="presentation-video"
            :src="getEmbedVideoUrl(researchPresentationSrc)"
            frameborder="0"
            allowfullscreen
          />
        </div>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12>
        <div v-if="!isResearchGroupMember" class="text-xs-right pa-3">
          <v-btn
            v-if="!bookmarkId"
            class="ma-0 pa-0"
            color="primary"
            outline
            small
            @click="addToBookmarks()"
            :loading="isBookmarkActionInProgress"
          >Follow</v-btn>

          <v-btn
            v-else
            class="ma-0 pa-0"
            color="grey"
            outline
            small
            @click="removeFromBookmarks()"
            :loading="isBookmarkActionInProgress"
          >Unfollow</v-btn>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import bookmarksService from "@/services/http/bookmarks";

export default {
  name: "ResearchDetails",

  data() {
    return {
      bookmarkId: null,
      isBookmarkActionInProgress: false
    };
  },

  computed: {
    ...mapGetters({
      group: "rd/group",
      research: "rd/research",
      user: "auth/user"
    }),

    isResearchGroupMember() {
      return this.research
        ? this.$store.getters["auth/userIsResearchGroupMember"](
            this.research.research_group_id
          )
        : false;
    },

    researchPresentationSrc() {
      return this.$options.filters.researchVideoSrc(this.research.abstract);
    }
  },

  methods: {
    addToBookmarks() {
      this.isBookmarkActionInProgress = true;
      return bookmarksService
        .createResearchBookmark(this.user.username, this.research.id)
        .then(bookmark => {
          this.$store.dispatch("auth/loadResearchBookmarks");
          this.bookmarkId = bookmark._id;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.isBookmarkActionInProgress = false;
        });
    },

    removeFromBookmarks() {
      this.isBookmarkActionInProgress = true;
      return bookmarksService
        .removeResearchBookmark(this.user.username, this.bookmarkId)
        .then(() => {
          this.$store.dispatch("auth/loadResearchBookmarks");
          this.bookmarkId = null;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.isBookmarkActionInProgress = false;
        });
    }
  },

  created() {
    const bookmark = this.user.researchBookmarks.find(
      b => b.researchId === this.research.id
    );
    if (bookmark) {
      this.bookmarkId = bookmark._id;
    }
  }
};
</script>

<style lang="less" scoped>
.rd-header {
  height: 300px;
  overflow: auto;

  font-style: normal;
  color: white;

  &__title {
    font-family: Muli;
    font-weight: 900;
    font-size: 36px;
    line-height: 40px;
    letter-spacing: 0.25px;
  }
  &__created {
  }
  &__abstract {
    font-family: Roboto;
    font-size: 14px;
    line-height: 16px;
  }
}
.feed-header {
  background-size: cover !important;
  background-repeat: no-repeat !important;
  height: 300px;
  width: 100%;
  font-style: normal;
  color: white;
}
</style>