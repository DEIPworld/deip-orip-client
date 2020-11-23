<template>
  <div
    :class="limitAccessClasses"
    v-bind="limitAccessProps"
  >
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

        <router-link
          v-if="$isLoggedIn"
          class="a"
          :to="routeAccessCheck({
            name: 'project.content.details',
            params: {
              contentExternalId: item.externalId,
              researchExternalId: $route.params.researchExternalId,
            }
          })"
        >
          {{ item.title }}
        </router-link>
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
            :disabled="limitedAccess"
            :to="routeAccessCheck({
              name: 'ResearchContentReferences',
              params: {
                research_group_permlink: $store.getters['Project/projectDetails'].researchGroup.permlink,
                content_permlink: item.permlink,
                research_permlink: $store.getters['Project/projectDetails'].permlink,
              }
            })"
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
  </div>
</template>

<script>
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { contentListStore } from '@/features/Contents/store/contentsListStore';
  import { mapState } from 'vuex';

  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';
  import DMetaItem from '@/components/Deipify/DMeta/DMetaItem';
  import { ResearchService } from '@deip/research-service';
  import { limitAccess } from '@/mixins/limitAccess';
  import { contentCommon } from '@/features/Contents/mixins';

  const researchService = ResearchService.getInstance();

  export default {
    name: 'ContentsList',
    components: {
      DMetaItem,
      DSimpleTooltip
    },
    mixins: [
      contentCommon,
      componentStoreFactory(contentListStore),
      limitAccess
    ],
    props: {
      projectId: {
        type: String,
        default: null
      }
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
    },
    computed: {
      ...mapState({
        contents(state, getters) { return getters[`${this.storeNS}/contentsList`]; }
      }),
    },
    created() {
      this.updateData();
    },
    methods: {
      updateData() {
        this.$setReady(false);

        return Promise.all([
          this.$store.dispatch(`${this.storeNS}/getContents`, {
            projectId: this.projectId
          })
        ])
          .then(() => {
            this.$setReady(true);
          });
      }
    }
  };
</script>
