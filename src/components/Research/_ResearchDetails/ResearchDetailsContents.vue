<template>
  <d-block v-if="internalContents.length" :title="title">
    <v-data-table
      :headers="tableHeaders"
      :single-expand="true"
      :expanded.sync="expanded"
      item-key="external_id"
      :items="internalContents"
      disable-sort
      show-expand
      disable-pagination
      hide-default-footer
    >
      <template #item.type="{item}">
        {{ getResearchContentType(item.content_type).text }}
      </template>

      <template #item.title="{item}">
        <router-link
          v-if="$isLoggedIn"
          class="a"
          :to="{
            name: 'ResearchContentDetails',
            params: {
              research_group_permlink: encodeURIComponent(research.research_group.permlink),
              research_permlink: encodeURIComponent(research.permlink),
              content_permlink: encodeURIComponent(item.permlink)
            }
          }"
        >
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
              name: 'ResearchContentReferences',
              params: {
                research_group_permlink: encodeURIComponent(research.research_group.permlink),
                research_permlink: encodeURIComponent(research.permlink),
                content_permlink: encodeURIComponent(item.permlink)
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

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" style="height: auto" class="pa-0">
          <div class="grey lighten-4 pa-4">
            <div>
              {{ createContentAuthorsString(item.authors) }}
            </div>

            <div class="mt-2">
              <span
                v-for="eci of getContentEciList(item)"
                :key="eci.disciplineName"
              >
                <span class="mr-1">{{ eci.disciplineName }}</span>
                <span class="mr-6 bold">{{ eci.value }}</span>
              </span>
            </div>

            <d-meta-item :meta="{icon: 'event'}" class="mt-2">
              {{ item.created_at | dateFormat('D MMM YYYY', true) }}
            </d-meta-item>
          </div>
        </td>
      </template>
    </v-data-table>
  </d-block>
</template>

<script>
  import { ResearchService } from '@deip/research-service';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import { mapGetters } from 'vuex';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ResearchDetailsContents',
    components: { DBlock, DMetaItem, DSimpleTooltip },
    props: {
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
        research: 'research/data',
        contents: 'research/contents',
        members: 'research/members',
      }),

      internalContents() {
        return this.$where(this.contents, { isDraft: this.drafts });
      }
    },

    methods: {
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

      createContentAuthorsString(members) {
        return this.members
          .filter((m) => members.some((a) => a === m.account.name))
          .map((m) => this.$options.filters.fullname(m))
          .join('  ·  ');
      },

      getContentEciList(content) {
        return this.research.disciplines.map((discipline) => {
          const eciObj = content.eci_per_discipline.find(
            (item) => item[0] === discipline.id
          );

          return {
            disciplineName: discipline.name,
            value: eciObj ? eciObj[1] : 0
          };
        });
      }
    }
  };
</script>
