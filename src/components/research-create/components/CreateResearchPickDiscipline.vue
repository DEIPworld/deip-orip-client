<template>
    <div class="column full-height col-grow" style="max-width: 1000px;">
        <div class="c-mb-4 col-grow column">

            <div class="step-title">Select only disciplines your research is related to</div>
            <div class="col-grow overflow-y-auto">
                <div class="row discipline-picker c-mh-auto full-height overflow-y-auto">
                    <div class="col-3 c-p-4 overflow-y-auto">
                        <div class="bold uppercase c-pb-4">Recently used</div>
                        <div><span class="deip-label">Religion</span></div>
                        <div><span class="deip-label">Chemistry</span></div>
                        <div><span class="deip-label">Biology</span></div>
                        <div><span class="deip-label">Physics</span></div>
                        <div><span class="deip-label">Belarusian</span></div>
                    </div>

                    <div class="col-3 c-p-4 overflow-y-auto">
                        <div class="bold uppercase c-pb-4">Popular</div>
                        <div><span class="deip-label">Religion</span></div>
                        <div><span class="deip-label">Chemistry</span></div>
                        <div><span class="deip-label">Biology</span></div>
                        <div><span class="deip-label">Physics</span></div>
                        <div><span class="deip-label">Belarusian</span></div>
                    </div>

                    <div class="col-6 c-p-4 full-height overflow-y-auto">
                        <div class="bold uppercase c-pb-4">All</div>
                        <discipline-tree-picker @select="selectDiscipline"></discipline-tree-picker>
                    </div>
                </div>
            </div>

        </div>
        <div class="row justify-center align-center">
            <v-btn color="primary" :disabled="nextDisabled" @click.native="nextStep()">Next</v-btn>
        </div>
    </div>
</template>

<script>

    import { mapGetters } from 'vuex';
    
    export default {
        name: "CreateResearchPickDiscipline",
        data() { 
            return {
                selectedDiscepline: undefined
            } 
        },
        computed: {
            nextDisabled(){
                return !this.selectedDiscepline;
            }
        },
        methods: {
            selectDiscipline(discipline){
                this.selectedDiscepline = discipline;
                this.$emit('selectDiscipline', discipline);
            },
            nextStep() {
                this.$emit('incStep');
            }
        }
    };
</script>

<style lang="less">
    .discipline-picker {
        border: 1px solid #E0E0E0;
        & > :not(:last-child) {
            border-right: 1px solid #E0E0E0;
        }
    }
</style>
