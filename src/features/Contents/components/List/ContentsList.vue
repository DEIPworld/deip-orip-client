<template>
  <div
    :class="limitAccessClasses"
    v-bind="limitAccessProps"
  >
    <v-data-table
      v-if="contentsList.length"
      v-custom="'hover-row'"
      :headers="tableHeaders"
      :items="contentsList"
      disable-sort
      disable-pagination
      hide-default-footer
    >
      <template #item.type="{item}">
        <div class="text-no-wrap">
          {{ $$contentType(item.content_type).text }}
        </div>
      </template>

      <template #item.title="{item}">
        <!-- START TEMP SOLUTION (query) -->
        <router-link
          v-if="$isLoggedIn"
          tag="div"
          :to="routeAccessCheck({
            name: 'ResearchContentDetails',
            params: {
              research_group_permlink: $store.getters['Project/data'].researchGroup.permlink,
              content_permlink: item.permlink,
              research_permlink: $store.getters['Project/data'].permlink,
            }
          })"
        >
          <!-- END TEMP SOLUTION (query) -->

          <!-- <router-link
            v-if="$isLoggedIn"
            class="a"
            :to="routeAccessCheck({
              name: 'project.content.details',
              params: {
                contentExternalId: item.external_id,
                researchExternalId: $route.params.researchExternalId,
              }
            })"
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
            :disabled="limitedAccess"
            :to="routeAccessCheck({
              name: 'ResearchContentReferences',
              params: {
                research_group_permlink: $store.getters['Project/data'].researchGroup.permlink,
                content_permlink: item.permlink,
                research_permlink: $store.getters['Project/data'].permlink,
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
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { contentListStore } from '@/features/Contents/store/contentsList';
  import { mapGetters } from 'vuex';
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
      componentStoreFactoryOnce(contentListStore, 'ProjectContents'),
      limitAccess
    ],
    props: {
      researchId: {
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
      ...mapGetters({
        contentsList: 'ProjectContents/list'
      })
    },
    created() {
      this.updateData();
    },
    methods: {
      updateData() {
        this.$setReady(false);

        return Promise.all([
          this.$store.dispatch('ProjectContents/getContents', this.researchId)
        ])
          .then(() => {
            this.$setReady(true);
          });
      },
    }
  };
</script>
