<template>
        <div class="step-title">Coming soon</div>
 <!--   <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Direct grants distribution</div>
            <div class="sm-title bold c-mb-2 text-align-center">Please select research</div>
            <div class="caption c-mb-4 text-align-center grey--text">Your tokens will be granted to the researchers</div>

            <div class="col-grow overflow-y-auto">

                <div class="c-mh-auto full-height overflow-y-auto research-picker">
                    <div class="c-ph-8 c-pt-12">
                        <v-autocomplete
                            :items="researches"
                            :filter="customFilter"
                            v-model="grantInfo.research"
                            item-text="title"
                            label="Start typing research title or researcher's name"
                        ></v-autocomplete>
                    </div>
                </div>

            </div>
        </div>

        <div class="row justify-center align-center">
            <v-btn color="primary" :disabled="nextDisabled" @click.native="nextStep()">Next</v-btn>
        </div>
    </div> -->
</template>

<script>
    import deipRpc from '@deip/deip-rpc-client';
    import _ from 'lodash';

    export default {
        name: "DirectGrantPickResearch",

        props: {
            grantInfo: { type: Object, required: true }
        },

        data() {
            return {
                researches: [],
                customFilter(item, queryText, itemText) {
                    if (_.isEmpty(queryText)) {
                        return true;
                    }

                    const text = !_.isEmpty(item.title) ? item.title : '';
                    return text.toString()
                        .toLowerCase()
                        .indexOf(queryText.toString().toLowerCase()) > -1;
                }
            };
        },

        computed: {
            nextDisabled() {
                return _.isEmpty(this.grantInfo.research);
            }
        },

        methods: {
            nextStep() {
                this.$emit('incStep');
            }
        },

        created() {
            deipRpc.api.getAllResearchesListingAsync(0, 0)
                .then(researches => {
                    // researches.forEach((item, index) => item.index = index);
                    this.researches = researches;
                });
        }
    };
</script>

<style lang="less" scoped>
    .research-picker {
        max-width: 700px;
    }
</style>
