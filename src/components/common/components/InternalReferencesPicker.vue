<template>
    <v-card>
        <template>
            <div class="row c-p-3 c-mb-5">
                <div class="col-grow">
                    <div class="row c-mh-auto group-members-max-width">
                        <div class="col-12">
                            <div v-if="showSelected">
                                <div class="row-nowrap legacy-justify-between align-center c-pt-4"
                                    v-for="(ref, i) in selected" :key="i + '-picked'"
                                >
                                    <div>{{ref.title}} ({{ref.research_title}})</div>
                                    <v-btn @click="removeReference(ref)" flat color="grey" class="ma-0">Remove</v-btn>
                                </div>
                            </div>

                            <v-divider v-if="showSelected" class="c-mt-4 c-mb-4" v-show="selected.length"></v-divider>

                            <div>
                                <div class="row-nowrap legacy-justify-between align-center c-pt-4" v-for="(ref, i) in searchable" 
                                    :key="i + '-selectable'" v-if="!isReferenceSelected(ref)"
                                >
                                    <div>
                                        <router-link target="_blank" class="a body-1"
                                            :to="{ 
                                                name: 'ResearchContentDetails',
                                                params: { 
                                                    research_group_permlink: encodeURIComponent(ref.group_permlink),
                                                    research_permlink: encodeURIComponent(ref.research_permlink),
                                                    content_permlink: encodeURIComponent(ref.permlink)
                                                } 
                                            }"
                                        >
                                            {{ref.title}} ({{ref.research_title}})
                                        </router-link>
                                    </div>

                                    <v-btn @click="addReference(ref)" flat color="primary" class="ma-0">+ Add reference</v-btn>
                                </div>
                            </div>

                            <v-text-field
                                label="Add references to material posted at DEIP"
                                single-line
                                append-icon="search"
                                prepend-icon="mdi-note-text"
                                v-model="term"
                                @input="searchReferences()">
                            </v-text-field>
                        </div>
                    </div>
                </div>
            </div>

            <v-divider></v-divider>
        </template>
    </v-card>
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
        methods: {
            addReference(ref) {
                if (!this.selected.some(r => r.id == ref.id)) {
                    this.selected.push(ref);
                    this.term = '';
                    this.searchable = [];
                    this.$emit('referenceAdded', ref);
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
                            return content.title.toLowerCase().startsWith(term) && content.research_id != this.currentResearchId;});}
                    
                }, 600
            ),

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
