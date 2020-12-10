<template>

  <v-data-table
    v-if="contents.length"
    v-custom="'hover-row'"
    :headers="tableHeaders"
    :items="contents"
    disable-sort
    disable-pagination
    hide-default-footer
  >
    <template #item.type="{item}">
      <div class="text-no-wrap">
        {{ $$contentType(item.contentType).text }}
      </div>
    </template>

    <template #item.title="{item}">

      <component
        :is="disableAllRoutes || disableContentRoute ? 'span' : 'router-link'"
        v-if="$isLoggedIn"
        class="a"
        :to="{
          name: 'project.content.details',
          params: {
            contentExternalId: item.externalId,
            researchExternalId: $route.params.researchExternalId,
          }
        }"
      >
        {{ item.title }}
      </component>
      <template v-else>
        {{ item.title }}
      </template>
    </template>

    <template #item.ref="{item}">
      <d-simple-tooltip tooltip="Browse references">
        <!-- TODO: need ref -->
        <v-btn
          icon
          small
          :disabled="disableAllRoutes || disableReferenceRoute"
          :to="{
            name: 'ResearchContentReferences',
            params: {
              research_group_permlink: $store.getters['Project/projectDetails'].researchGroup.permlink,
              content_permlink: item.permlink,
              research_permlink: $store.getters['Project/projectDetails'].permlink,
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
      <d-meta-item v-if="$$hasReviews(item)" :meta="{icon: 'chat_bubble'}">
        <span
          v-show="$$hasPositiveReviews(item)"
          class="success--text font-weight-medium"
        >{{ $$countReviews(item, true) }}</span>
        <span v-show="$$hasPositiveReviews(item) && $$hasNegativeReviews(item)">/</span>
        <span
          v-show="$$hasNegativeReviews(item)"
          class="error--text font-weight-medium"
        >{{ $$countReviews(item, false) }}</span>
      </d-meta-item>
    </template>
  </v-data-table>
</template>

<script>

  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';
  import { contentList } from '@/features/Contents/mixins';

  export default {
    name: 'ContentsList',
    components: {
      DMetaItem,
      DSimpleTooltip
    },
    mixins: [
      contentList
    ],
    props: {
      disableAllRoutes: Boolean,
      disableReferenceRoute: Boolean,
      disableContentRoute: Boolean,
    },
    data() {
      return {
        expanded: [],
        tableHeaders: [
          {
            text: 'Type',
            value: 'type'
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
          {
            text: '',
            value: 'data-table-expand'
          }
        ]
      };
    }
  };
</script>
