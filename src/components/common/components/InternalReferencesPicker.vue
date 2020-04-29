<template>
  <div class="full-width">
    <div v-if="showSelected">
      <div v-show="selected.length" class="subtitle-1 py-2">
        Selected References:
      </div>
      <v-row

        v-for="(ref, i) in selected"
        :key="i + '-picked'"
        justify="space-between"
        align="center"
        :class="{'py-2': i > 0}"
      >
        <div class="body-1 pr-6">
          <span>{{ ref.title }} ({{ ref.research_title }})</span>
        </div>
        <div class="text--right">
          <v-btn
            small
            outlined
            class="ma-0"
            @click="removeReference(ref)"
          >
            Remove
          </v-btn>
        </div>
      </v-row>
    </div>

    <v-divider v-if="showSelected && selected.length" class="my-2" />

    <v-row

      v-for="(ref, i) in list"
      :key="i + '-selectable'"
      justify="space-between"
      align="center"
      :class="{'py-2': i > 0, 'pt-4': i == 0}"
    >
      <div class="pr-6">
        <router-link
          target="_blank"
          class="a body-1"
          :to="{
            name: 'ResearchContentDetails',
            params: {
              research_group_permlink: encodeURIComponent(ref.group_permlink),
              research_permlink: encodeURIComponent(ref.research_permlink),
              content_permlink: encodeURIComponent(ref.permlink)
            }
          }"
        >
          {{ ref.title }} ({{ ref.research_title }})
        </router-link>
      </div>
      <div class="text--right">
        <v-btn
          outlined
          small
          color="primary"
          class="ma-0"
          @click="addReference(ref)"
        >
          + Add
        </v-btn>
      </div>
    </v-row>

    <v-text-field
      ref="searchInput"
      v-model="term"
      label="Add references to material posted at DEIP"
      hint="Search by material title"
      single-line
      append-icon="device_hub"
      @input="searchReferences()"
    />
  </div>
</template>

<script>
  import { SearchService } from '@deip/search-service';
  import _ from 'lodash';

  const searchService = SearchService.getInstance();

  export default {
    name: 'InternalReferencesPicker',

    props: {
      showSelected: { type: Boolean, default: false },
      preselected: { type: Array, default: () => [] },
      currentResearchId: { type: Number, required: true }
    },
    data() {
      return {
        term: '',
        selected: [],
        searchable: [],
        references: []
      };
    },

    computed: {
      list() {
        return this.searchable.filter((ref) => !this.isReferenceSelected(ref));
      }
    },
    methods: {
      addReference(ref) {
        if (!this.selected.some((r) => r.id === ref.id)) {
          this.selected.push(ref);
          this.term = '';
          this.searchable = [];
          this.$emit('referenceAdded', ref);
          this.$refs.searchInput.focus();
        }
      },
      removeReference(ref) {
        if (this.selected.some((r) => r.id === ref.id)) {
          this.selected = this.selected.filter((r) => r.id !== ref.id);
          this.$emit('referenceRemoved', ref);
        }
      },
      searchReferences: _.debounce(function f() {
        if (!this.term) {
          this.searchable = [];
          return;
        }
        const term = this.term.toLowerCase();

        function filter() {
          return this.references.filter((content) => content.title.toLowerCase().startsWith(term)
            && content.research_id !== this.currentResearchId);
        }

        this.searchable = filter.call(this, term);
      }, 600),

      isReferenceSelected(ref) {
        return this.selected.some((r) => r.id === ref.id);
      }
    },
    created() {
      searchService.getAllResearchContents()
        .then((contents) => {
          this.references.push(...contents);
          this.selected = this.references.filter((r) => this.preselected.some((id) => r.id === id));
        });
    }
  };
</script>

<style lang="less" scoped>
</style>
