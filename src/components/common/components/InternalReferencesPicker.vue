<template>
  <v-layout row>
    <v-layout column>
      <div class="full-width">

        <div v-if="showSelected">
          <div v-show="selected.length" class="subheading py-2">Selected References:</div>
          <v-layout row justify-space-between align-center :class="{'py-2': i > 0}" v-for="(ref, i) in selected" :key="i + '-picked'">
            <div class="body-1 pr-4"><span>{{ref.title}} ({{ref.research_title}})</span></div>
            <div class="text-xs-right"><v-btn @click="removeReference(ref)" small outline class="ma-0">Remove</v-btn></div>
          </v-layout>
        </div>

        <v-divider v-if="showSelected && selected.length" class="my-2"></v-divider>

        <v-layout row justify-space-between align-center :class="{'py-2': i > 0, 'pt-4': i == 0}" v-for="(ref, i) in list" :key="i + '-selectable'">
          <div class="pr-4">
            <router-link target="_blank" class="a body-1"
              :to="{ 
                name: 'ResearchContentDetails',
                params: { 
                  research_group_permlink: encodeURIComponent(ref.group_permlink),
                  research_permlink: encodeURIComponent(ref.research_permlink),
                  content_permlink: encodeURIComponent(ref.permlink)
                } 
              }">{{ref.title}} ({{ref.research_title}})
            </router-link>
          </div>
          <div class="text-xs-right"><v-btn @click="addReference(ref)" outline small color="primary" class="ma-0">+ Add</v-btn></div>
        </v-layout>

        <v-text-field
          ref="searchInput"
          label="Add references to material posted at DEIP"
          hint="Search by material title"
          single-line
          append-icon="device_hub"
          v-model="term"
          @input="searchReferences()">
        </v-text-field>
        
      </div>
    </v-layout>
  </v-layout>
</template>

<script>

import contentHttpService from './../../../services/http/content';
import searchHttpService from './../../../services/http/search';

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
    }
  },

  computed: {
    list() {
      return this.searchable.filter(ref => !this.isReferenceSelected(ref));
    }
  },
  methods: {
    addReference(ref) {
      if (!this.selected.some(r => r.id == ref.id)) {
        this.selected.push(ref);
        this.term = '';
        this.searchable = [];
        this.$emit('referenceAdded', ref);
        this.$refs.searchInput.focus();
      }
    },
    removeReference(ref) {
      if (this.selected.some(r => r.id == ref.id)) {
        this.selected = this.selected.filter(r => r.id != ref.id);
        this.$emit('referenceRemoved', ref);
      }
    },
    searchReferences: _.debounce(
      function() {
        if (!this.term) {
          this.searchable = [];
          return;
        }
        const term = this.term.toLowerCase();
        this.searchable = filter.call(this, term);

        function filter(term) {
          return this.references.filter(content => {
            return content.title.toLowerCase().startsWith(term) && content.research_id != this.currentResearchId;});
        }
        
      }, 600),

      isReferenceSelected(ref) {
        return this.selected.some(r => r.id == ref.id);
      }
  },
  created() {
    searchHttpService.getAllResearchContents()
      .then((contents) => {
        this.references.push(...contents);
        this.selected = this.references.filter(r => this.preselected.some(id => r.id == id));
      });
  }
}
</script>

<style lang="less" scoped>
</style>
