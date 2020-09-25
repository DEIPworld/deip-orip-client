<template>
  <d-block v-if="internalContents.length" :title="title">
    <v-data-table
      :headers="tableHeaders"
      :items="internalContents"
      disable-sort
      disable-pagination
      hide-default-footer
    >
      <template #item.type="{item}">
        {{ getResearchContentType(item.content_type).text }}
      </template>

      <template #item.title="{item}">
        <!-- START TEMP SOLUTION (query) -->
        <router-link
          v-if="$isLoggedIn"
          class="a"
          :to="{
            name: 'ResearchContentDetails',
            params: {
              research_group_permlink: $store.getters['Research/data'].research_group.permlink,
              content_permlink: item.permlink,
              research_permlink: $store.getters['Research/data'].permlink,
            }
          }"
        >
        <!-- END TEMP SOLUTION (query) -->

        <!-- <router-link
          v-if="$isLoggedIn"
          class="a"
          :to="{
            name: 'research.content.details',
            params: {
              contentExternalId: item.external_id,
              researchExternalId: $route.params.researchExternalId,
            }
          }"
        > -->
          {{ item.title }}
        </router-link>
        <template v-else>
          {{ item.title }}
        </template>
      </template>

      <template #item.ref="{item}">
        <d-simple-tooltip tooltip="Browse references">
          <v-btn
            icon
            small
            :to="{
              name: 'research.content.details',
              params: {
                contentExternalId: item.external_id,
                researchExternalId: researchId,
              }
            }"
          >
            <v-icon small>
              device_hub
            </v-icon>
          </v-btn>
        </d-simple-tooltip>
      </template>

      <template #item.comments="{ item }">
        <d-meta-item v-if="hasReviews(item)" :meta="{icon: 'chat_bubble'}">
          <span v-show="hasPositiveReviews(item)" class="success--text font-weight-medium">{{ countContentReviews(item, true) }}</span>
          <span v-show="hasPositiveReviews(item) && hasNegativeReviews(item)">/</span>
          <span v-show="hasNegativeReviews(item)" class="error--text font-weight-medium">{{ countContentReviews(item, false) }}</span>
        </d-meta-item>
      </template>
    </v-data-table>
  </d-block>
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { contentListStore } from '@/components/ContentsList/store';
  import { mapGetters } from 'vuex';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';
  import { ResearchService } from '@deip/research-service';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ContentsList',
    components: { DMetaItem, DSimpleTooltip, DBlock },
    mixins: [componentStoreFactoryOnce(contentListStore, 'ResearchContents')],
    props: {
      researchId: {
        type: String,
        default: null
      },
      drafts: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: 'Research materials'
      }
    },
    data() {
      return {
        expanded: [],
        tableHeaders: [
          {
            text: 'Type',
            value: 'type',
            width: '0%'
          },
          {
            text: 'Title',
            value: 'title',
            width: '70%'
          },
          {
            value: 'ref',
            width: '10%'
          },
          {
            value: 'comments',
            width: '10%'
          },
          { text: '', value: 'data-table-expand' }
        ]
      };
    },
    computed: {
      ...mapGetters({
        contents: 'ResearchContents/list'
      }),

      internalContents() {
        return this.$where(this.contents, { isDraft: this.drafts });
      }
    },
    created() {
      this.updateData();
    },
    methods: {
      updateData() {
        this.$setReady(false);

        return Promise.all([
          this.$store.dispatch('ResearchContents/getContents', this.$route.params.researchExternalId)
        ])
          .then(() => {
            this.$setReady(true);
          });
      },

      getResearchContentType(type) {
        return researchService.getResearchContentType(type);
      },

      hasReviews(content) {
        return content.reviews.length;
      },

      hasPositiveReviews(content) {
        return content.reviews.some((r) => r.is_positive);
      },

      hasNegativeReviews(content) {
        return content.reviews.some((r) => !r.is_positive);
      },

      countContentReviews(content, isPositive) {
        return content.reviews.reduce(
          (acc, review) => ((review.is_positive && isPositive)
          || (!review.is_positive && !isPositive)
            ? acc + 1
            : acc),
          0
        );
      },
    }
  };
</script>
