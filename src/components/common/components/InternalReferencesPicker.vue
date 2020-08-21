<template>
  <div class="full-width">
    <div v-if="showSelected">
      <div v-show="selected.length" class="text-subtitle-1 py-2">
        Selected References:
      </div>
      <v-row
        v-for="(ref, i) in selected"
        :key="i + '-picked'"
        no-gutters
        justify="space-between"
        align="center"
        :class="{'py-2': i > 0}"
      >
        <v-col class="text-body-1 pr-6">
          <span>{{ ref.title }} ({{ ref.research_title }})</span>
        </v-col>
        <v-col cols="auto" class="text--right">
          <v-btn
            small
            color="primary"
            outlined
            class="ma-0"
            @click="removeReference(ref)"
          >
            Remove
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <v-divider v-if="showSelected && selected.length" class="my-2" />

    <v-row
      v-for="(ref, i) in list"
      :key="i + '-selectable'"
      no-gutters
      justify="space-between"
      align="center"
      :class="{'py-2': i > 0, 'pt-4': i == 0}"
    >
      <v-col class="pr-6">
        <router-link
          target="_blank"
          class="a text-body-1"
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
      </v-col>
      <v-col cols="auto" class="text--right">
        <v-btn
          outlined
          small
          color="primary"
          class="ma-0"
          @click="addReference(ref)"
        >
          + Add
        </v-btn>
      </v-col>
    </v-row>

    <v-text-field
      ref="searchInput"
      v-model="term"
      label="Add references to material posted at DEIP"
      hint="Search by material title"
      outlined
      append-icon="device_hub"
      @input="searchReferences()"
    />
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    name: 'InternalReferencesPicker',

    props: {
      showSelected: { type: Boolean, default: false },
      preselected: { type: Array, default: () => [] },
      currentResearch: { type: Object, required: true },
      allReferencesList: { type: Array, required: true }
    },

    data() {
      return {
        term: '',
        searchable: []
      };
    },

    computed: {
      list() {
        return this.searchable.filter((ref) => !this.isReferenceSelected(ref));
      },
      selected() {
        return this.allReferencesList.filter((r) => this.preselected.some((id) => r.external_id === id));
      }
    },
    methods: {
      addReference(ref) {
        if (!this.selected.some((r) => r.external_id === ref.external_id)) {
          this.selected.push(ref);
          this.term = '';
          this.searchable = [];
          this.$emit('referenceAdded', ref);
          this.$refs.searchInput.focus();
        }
      },
      removeReference(ref) {
        if (this.selected.some((r) => r.external_id === ref.external_id)) {
          this.selected = this.selected.filter((r) => r.external_id !== ref.external_id);
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
          return this.allReferencesList
            .filter((content) => content.title != null)
            .filter((content) => content.title.toLowerCase().startsWith(term) && content.research_id != this.currentResearch.id);
        }

        this.searchable = filter.call(this, term);
      }, 600),

      isReferenceSelected(ref) {
        return this.selected.some((r) => r.external_id === ref.external_id);
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
